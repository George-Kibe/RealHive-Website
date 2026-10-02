import { publicQuote } from "@/lib/quote/pricing";
import { prepareQuote, QuoteInputError } from "@/lib/quote/server";
import { NextResponse } from "next/server";

// live estimate for the quote page: final local amounts only (see publicQuote)
export const POST = async (request) => {
    try {
        const { quote } = await prepareQuote(await request.json().catch(() => ({})));
        return NextResponse.json({ success: true, quote: publicQuote(quote) }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        if (error instanceof QuoteInputError) return new NextResponse(error.message, {status: 422});
        return new NextResponse("Couldn't calculate the estimate", {status: 500});
    }
}
