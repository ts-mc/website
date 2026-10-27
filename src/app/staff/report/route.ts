import { NextResponse } from "next/server";

const STAFF_REPORT_URL = "https://discord.gg/theysix";

export async function GET() {
  return NextResponse.redirect(STAFF_REPORT_URL);
}
