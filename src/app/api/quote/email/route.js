import { connectDB } from "@/db/connectDB";
import { sendQuoteEmail, sendQuoteNotification } from "@/lib/emails";
import { clientIpHash } from "@/lib/quote/location";
import { buildQuotePdf } from "@/lib/quote/pdf";
import { formatMoney } from "@/lib/quote/format";
import { prepareQuote, QuoteInputError } from "@/lib/quote/server";
import { CONTACT } from "@/lib/schema";
import { SITE } from "@/lib/seo";
import Quote from "@/models/QuoteModel";
import { NextResponse } from "next/server";

// Limits per rolling hour, so the form can't be used to spam inboxes.
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;
const HOUR_MS = 60 * 60 * 1000;

// email the visitor their quotation PDF, save it as a lead and notify the team
export const POST = async (request) => {
    let prepared;
    try {
        prepared = await prepareQuote(await request.json().catch(() => ({})), { requireContact: true });
    } catch (error) {
        if (error instanceof QuoteInputError) return new NextResponse(error.message, {status: 422});
        return new NextResponse(error.message, {status: 500});
    }
    const { quote, selection, contact } = prepared;
    await connectDB();
    try {
        const ipHash = await clientIpHash();
        const since = new Date(Date.now() - HOUR_MS);
        const [byIp, byEmail] = await Promise.all([
            Quote.countDocuments({ ipHash, createdAt: { $gte: since } }),
            Quote.countDocuments({ email: contact.email, createdAt: { $gte: since } }),
        ]);
        if (byIp >= MAX_PER_IP || byEmail >= MAX_PER_EMAIL) {
            return new NextResponse("Too many quote requests. Please try again in an hour, or contact us directly.", {status: 429});
        }

        const pdf = await buildQuotePdf(quote, contact);
        await sendQuoteEmail({ to: contact.email, name: contact.name, quote, pdf, formatMoney, siteUrl: SITE.url, phone: CONTACT.telephone });
        await Quote.create({
            ...contact,
            reference: quote.reference,
            country: quote.country,
            countryDetected: quote.countryDetected,
            tier: quote.tier,
            buildLevel: quote.buildLevel,
            selection,
            items: quote.items,
            projectFrom: quote.projectFrom,
            monthlyFrom: quote.monthlyFrom,
            projectFromUsd: quote.projectFromUsd,
            monthlyFromUsd: quote.monthlyFromUsd,
            weeksFrom: quote.weeksFrom,
            currency: quote.currency,
            exchangeRate: quote.rate,
            ipHash,
        });
        // the visitor already has their quote; a failed internal notification shouldn't fail the request
        try {
            await sendQuoteNotification({ quote, contact, pdf, formatMoney });
        } catch (error) {
            console.error("Quote notification email failed: ", error.message);
        }
        return NextResponse.json(
            { message: 'Quote sent', success: true, reference: quote.reference },
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse("We couldn't send your quote right now. Please try again or download the PDF instead.", {status: 500});
    }
}
