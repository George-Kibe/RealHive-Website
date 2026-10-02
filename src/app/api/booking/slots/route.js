import { getAvailableSlots } from "@/lib/booking/server";
import { NextResponse } from "next/server";

// available consultation slots (UTC instants); the page shows them in the visitor's time zone
export const GET = async () => {
    try {
        const { settings, slots } = await getAvailableSlots();
        return NextResponse.json(
            { success: true, slotMinutes: settings.slotMinutes, slots: slots.map((s) => s.toISOString()) },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        return new NextResponse("Couldn't load available times", {status: 500});
    }
}
