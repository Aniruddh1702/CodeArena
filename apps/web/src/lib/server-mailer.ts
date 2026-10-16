import nodemailer from "nodemailer";

interface SendOtpOptions {
  recipient: string;
  otp: string;
  firstName?: string;
  subject?: string;
}

interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  message: string;
  demoMode?: boolean;
  error?: string;
}

/**
 * Creates and returns a Nodemailer transporter configured from environment variables.
 * Supports:
 * 1. Direct Gmail SMTP via GMAIL_USER and GMAIL_APP_PASSWORD
 * 2. Generic SMTP via SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 */
function getTransporter() {
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (process.env.GMAIL_USER || (gmailUser && gmailUser.includes("@gmail.com"))) {
    if (!gmailPass) return null;
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass.replace(/\s+/g, ""), // Strip spaces from App Password
      },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpHost && gmailUser && gmailPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  return null;
}

/**
 * Returns a polished, responsive HTML email template for CodeArena OTP verification.
 */
function buildOtpEmailHtml(otp: string, firstName?: string): string {
  const nameGreeting = firstName ? `Hi ${firstName},` : "Hello,";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your CodeArena Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 15px;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background: linear-gradient(180deg, #131b2e 0%, #0e1626 100%);
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 40px 32px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
    }
    .logo-container {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo-badge {
      display: inline-block;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #38bdf8;
      text-decoration: none;
      padding: 8px 18px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #f8fafc;
      text-align: center;
      margin: 0 0 10px 0;
    }
    .subtitle {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      text-align: center;
      margin: 0 0 28px 0;
    }
    .otp-box {
      background: #090e1a;
      border: 2px dashed rgba(56, 189, 248, 0.4);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #38bdf8;
      margin: 0;
    }
    .otp-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
      margin-top: 8px;
      font-weight: 700;
    }
    .info-list {
      background: rgba(30, 41, 59, 0.4);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #64748b;
      margin-top: 24px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo-container">
        <div class="logo-badge">⚡ CODEARENA</div>
      </div>
      <h1 class="title">Verify Your Email Address</h1>
      <p class="subtitle">
        ${nameGreeting} Thank you for joining CodeArena. Use the verification code below to verify your account and begin competing.
      </p>

      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="otp-label">One-Time Verification Code</div>
      </div>

      <div class="info-list">
        • This code will expire in <strong>10 minutes</strong>.<br>
        • Never share this verification code with anyone.<br>
        • If you did not request this account registration, please ignore this email.
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} CodeArena Competitive Programming Platform.<br>
        Automated verification message. Please do not reply directly to this email.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dispatches an OTP verification email to the user's Gmail / email inbox.
 */
export async function sendOtpEmail({
  recipient,
  otp,
  firstName,
  subject = "Your CodeArena Verification Code",
}: SendOtpOptions): Promise<SendEmailResult> {
  const cleanEmail = recipient.toLowerCase().trim();
  const transporter = getTransporter();

  console.log(`[CodeArena OTP Mailer] 📬 Request to dispatch OTP to: ${cleanEmail}`);

  if (!transporter) {
    const isProd = process.env.NODE_ENV === "production";
    console.warn(
      `[CodeArena OTP Mailer] ⚠️ SMTP/Gmail credentials not detected. ` +
      `Set GMAIL_USER and GMAIL_APP_PASSWORD in environment to dispatch live emails.`
    );
    console.log(`[CodeArena OTP Mailer] 🔑 DEMO/FALLBACK OTP for ${cleanEmail}: ${otp}`);

    return {
      success: true,
      delivered: false,
      demoMode: true,
      message: `Verification code generated. (Add GMAIL_USER & GMAIL_APP_PASSWORD to send live emails to inboxes)`,
    };
  }

  const fromEmail = process.env.SMTP_FROM || process.env.GMAIL_USER || "CodeArena <noreply@codearena.dev>";

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: cleanEmail,
      subject: `${otp} is your CodeArena verification code`,
      html: buildOtpEmailHtml(otp, firstName),
      text: `Your CodeArena verification code is: ${otp}. It expires in 10 minutes.`,
    });

    console.log(`[CodeArena OTP Mailer] ✅ Email successfully sent to ${cleanEmail}: MessageID ${info.messageId}`);
    return {
      success: true,
      delivered: true,
      message: `Verification code sent directly to ${cleanEmail}`,
    };
  } catch (err: any) {
    console.error(`[CodeArena OTP Mailer] ❌ Failed to dispatch email via Nodemailer:`, err);
    return {
      success: false,
      delivered: false,
      message: `Failed to dispatch email: ${err.message || "SMTP error"}.`,
      error: err.message,
    };
  }
}
