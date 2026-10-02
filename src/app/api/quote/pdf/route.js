import { buildQuotePdf } from "@/lib/quote/pdf";
import { prepareQuote, QuoteInputError } from "@/lib/quote/server";
import { NextResponse } from "next/server";

// download the quotation as a PDF (nothing is stored or emailed). Priced for the request's IP location.
export const POST = async (request) => {
    try {
        const { quote, contact } = await prepareQuote(await request.json().catch(() => ({})));
        const pdf = await buildQuotePdf(quote, contact);
        return new NextResponse(pdf, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="RealHive-estimate-${quote.reference}.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        if (error instanceof QuoteInputError) return new NextResponse(error.message, {status: 422});
        return new NextResponse(error.message, {status: 500});
    }
}
