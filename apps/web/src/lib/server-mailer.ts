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

const DEFAULT_GMAIL_USER = "aniruddh2820@gmail.com";
const DEFAULT_GMAIL_PASS = "ltiphzbggwgifepm";

/**
 * Creates and returns a Nodemailer transporter configured from environment variables.
 * Falls back to CodeArena platform's verified Gmail SMTP credentials.
 */
function getTransporter() {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_GMAIL_USER).trim();
  const rawPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || DEFAULT_GMAIL_PASS).trim();
  const gmailPass = rawPass.replace(/\s+/g, ""); // Strip spaces from App Password

  if (gmailUser && (gmailUser.includes("@gmail.com") || process.env.GMAIL_USER)) {
    if (!gmailPass) return null;
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
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

export function isEmailProviderConfigured(): boolean {
  return getTransporter() !== null;
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

  if (!transporter) {
    return {
      success: true,
      delivered: false,
      demoMode: true,
      message: `Verification code generated. (Configure GMAIL_USER & GMAIL_APP_PASSWORD to send live emails)`,
    };
  }

  const effectiveGmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_GMAIL_USER;
  const fromEmail = process.env.SMTP_FROM || `CodeArena <${effectiveGmailUser}>`;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: cleanEmail,
      subject: `${otp} is your CodeArena verification code`,
      html: buildOtpEmailHtml(otp, firstName),
      text: `Your CodeArena verification code is: ${otp}. It expires in 10 minutes.`,
    });

    return {
      success: true,
      delivered: true,
      message: `Verification code sent directly to ${cleanEmail}`,
    };
  } catch (err: any) {
    console.error(`[CodeArena Mailer] Failed to dispatch email via Nodemailer:`, err.message);
    return {
      success: false,
      delivered: false,
      message: `Failed to dispatch email: ${err.message || "SMTP error"}.`,
      error: err.message,
    };
  }
}

/**
 * Dispatches a password reset email containing a secure link.
 */
export async function sendPasswordResetEmail(
  recipient: string,
  token: string,
  firstName?: string
): Promise<SendEmailResult> {
  const cleanEmail = recipient.toLowerCase().trim();
  const transporter = getTransporter();

  const webUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.WEB_URL ||
    "https://codearena-web-eg2p.onrender.com"
  ).replace(/\/$/, "");
  const resetUrl = `${webUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your CodeArena Password</title>
</head>
<body style="margin:0;padding:40px 15px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;">
  <div style="max-width:520px;margin:0 auto;background:#131b2e;border:1px solid #1e293b;border-radius:16px;padding:36px 28px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:22px;font-weight:900;color:#38bdf8;padding:6px 14px;background:rgba(56,189,248,0.1);border-radius:8px;">⚡ CODEARENA</span>
    </div>
    <h2 style="font-size:20px;font-weight:800;color:#f8fafc;text-align:center;margin:0 0 12px 0;">Password Reset Request</h2>
    <p style="font-size:14px;line-height:1.6;color:#94a3b8;text-align:center;margin:0 0 24px 0;">
      ${greeting} We received a request to reset the password for your CodeArena account. Click the button below to choose a new password.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">
        Reset Your Password &rarr;
      </a>
    </div>
    <p style="font-size:12px;color:#64748b;text-align:center;word-break:break-all;">
      Or copy and paste this URL into your browser:<br>
      <a href="${resetUrl}" style="color:#38bdf8;">${resetUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
    <p style="font-size:11px;color:#64748b;text-align:center;margin:0;">
      This password reset link expires in 1 hour and can only be used once. If you did not request a password reset, please ignore this email.
    </p>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    return {
      success: true,
      delivered: false,
      demoMode: true,
      message: "Reset link generated. (Configure GMAIL_USER & GMAIL_APP_PASSWORD to send live emails)",
    };
  }

  const effectiveGmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_GMAIL_USER;
  const fromEmail = process.env.SMTP_FROM || `CodeArena <${effectiveGmailUser}>`;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: cleanEmail,
      subject: "Reset your CodeArena account password",
      html,
      text: `Reset your CodeArena password here: ${resetUrl}`,
    });

    return {
      success: true,
      delivered: true,
      message: `Password reset instructions sent to ${cleanEmail}`,
    };
  } catch (err: any) {
    console.error(`[CodeArena Mailer] Failed to dispatch password reset email:`, err.message);
    return {
      success: false,
      delivered: false,
      message: `Failed to dispatch email: ${err.message || "SMTP error"}.`,
      error: err.message,
    };
  }
}

/**
 * Dispatches a link-based email verification message.
 */
export async function sendVerificationLinkEmail(
  recipient: string,
  token: string,
  firstName?: string
): Promise<SendEmailResult> {
  const cleanEmail = recipient.toLowerCase().trim();
  const transporter = getTransporter();

  const webUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.WEB_URL ||
    "https://codearena-web-eg2p.onrender.com"
  ).replace(/\/$/, "");
  const verificationUrl = `${webUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your CodeArena Email</title>
</head>
<body style="margin:0;padding:40px 15px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;">
  <div style="max-width:520px;margin:0 auto;background:#131b2e;border:1px solid #1e293b;border-radius:16px;padding:36px 28px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:22px;font-weight:900;color:#38bdf8;padding:6px 14px;background:rgba(56,189,248,0.1);border-radius:8px;">⚡ CODEARENA</span>
    </div>
    <h2 style="font-size:20px;font-weight:800;color:#f8fafc;text-align:center;margin:0 0 12px 0;">Verify Your Email Address</h2>
    <p style="font-size:14px;line-height:1.6;color:#94a3b8;text-align:center;margin:0 0 24px 0;">
      ${greeting} Please confirm your email address to activate your student account.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${verificationUrl}" style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#6366f1);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">
        Verify Email Address &rarr;
      </a>
    </div>
    <p style="font-size:12px;color:#64748b;text-align:center;word-break:break-all;">
      Or copy and paste this link into your browser:<br>
      <a href="${verificationUrl}" style="color:#38bdf8;">${verificationUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
    <p style="font-size:11px;color:#64748b;text-align:center;margin:0;">
      This link expires in 24 hours. If you did not create a CodeArena account, please ignore this email.
    </p>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    return {
      success: true,
      delivered: false,
      demoMode: true,
      message: "Verification link generated. (Configure GMAIL_USER & GMAIL_APP_PASSWORD to send live emails)",
    };
  }

  const effectiveGmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_GMAIL_USER;
  const fromEmail = process.env.SMTP_FROM || `CodeArena <${effectiveGmailUser}>`;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: cleanEmail,
      subject: "Verify your CodeArena student account",
      html,
      text: `Verify your email here: ${verificationUrl}`,
    });

    return {
      success: true,
      delivered: true,
      message: `Verification link sent to ${cleanEmail}`,
    };
  } catch (err: any) {
    console.error(`[CodeArena Mailer] Failed to dispatch verification email:`, err.message);
    return {
      success: false,
      delivered: false,
      message: `Failed to dispatch email: ${err.message || "SMTP error"}.`,
      error: err.message,
    };
  }
}
