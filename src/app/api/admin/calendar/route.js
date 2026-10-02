import { getAdmin } from "@/lib/adminAuth";
import { getCalendarSettings, saveCalendarSettings, SettingsError, validateSettings } from "@/lib/booking/settings";
import { NextResponse } from "next/server";

// get the calendar settings (admin only)
export const GET = async () => {
    if (!(await getAdmin())) return new NextResponse("Unauthorized", {status: 401});
    return NextResponse.json({ success: true, settings: await getCalendarSettings() }, { status: 200 });
}

// replace the calendar settings (admin only)
export const PUT = async (request) => {
    if (!(await getAdmin())) return new NextResponse("Unauthorized", {status: 401});
    try {
        const values = validateSettings(await request.json().catch(() => ({})));
        const settings = await saveCalendarSettings(values);
        return NextResponse.json({ message: 'Calendar saved', success: true, settings }, { status: 200 });
    } catch (error) {
        if (error instanceof SettingsError) return new NextResponse(error.message, {status: 422});
        return new NextResponse(error.message, {status: 500});
    }
}
