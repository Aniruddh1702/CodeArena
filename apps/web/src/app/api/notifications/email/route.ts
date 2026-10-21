import { NextRequest, NextResponse } from "next/server";
import { sendGeneralEmail } from "@/lib/server-mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient, subject, htmlBody, type, contestId } = body;

    if (!recipient || !subject) {
      return NextResponse.json(
        { success: false, message: "Recipient and subject are required." },
        { status: 400 }
      );
    }

    console.log(`[CodeArena Mailer] 📧 Dispatched ${type || "EMAIL"} to ${recipient}: "${subject}"`);

    const result = await sendGeneralEmail(
      recipient,
      subject,
      htmlBody || `<p>${subject}</p>`
    );

    return NextResponse.json({
      success: result.success,
      delivered: result.delivered,
      message: result.message,
      timestamp: new Date().toISOString(),
      recipient,
      subject,
      contestId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to dispatch email" },
      { status: 500 }
    );
  }
}
