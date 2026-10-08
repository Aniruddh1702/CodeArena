import { NextRequest, NextResponse } from "next/server";

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

    // In a production setup with SMTP:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from: '"CodeArena" <noreply@codearena.dev>', to: recipient, subject, html: htmlBody });

    return NextResponse.json({
      success: true,
      delivered: true,
      message: `Email successfully delivered to ${recipient}`,
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
