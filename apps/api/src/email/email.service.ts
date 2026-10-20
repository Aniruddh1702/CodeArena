import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailDispatchResult {
  success: boolean;
  delivered: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    this.initTransporter();
  }

  private readonly defaultGmailUser = 'aniruddh2820@gmail.com';
  private readonly defaultGmailPass = 'ltiphzbggwgifepm';

  private initTransporter() {
    const gmailUser = (this.config.get<string>('GMAIL_USER') || this.config.get<string>('SMTP_USER') || this.defaultGmailUser).trim();
    const rawPass = (this.config.get<string>('GMAIL_APP_PASSWORD') || this.config.get<string>('SMTP_PASS') || this.defaultGmailPass).trim();
    const gmailPass = rawPass.replace(/\s+/g, '');

    if (gmailUser && (gmailUser.includes('@gmail.com') || this.config.get<string>('GMAIL_USER'))) {
      if (gmailPass) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });
        return;
      }
    }

    const smtpHost = this.config.get<string>('SMTP_HOST');
    const smtpPort = parseInt(this.config.get<string>('SMTP_PORT', '587'), 10);

    if (smtpHost && gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  async sendVerificationEmail(
    to: string,
    token: string,
    firstName?: string,
  ): Promise<EmailDispatchResult> {
    const webUrl = (this.config.get<string>('WEB_URL') || 'https://codearena-web-eg2p.onrender.com').replace(/\/$/, '');
    const verificationUrl = `${webUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const greeting = firstName ? `Hi ${firstName},` : 'Hello,';

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
      ${greeting} Please confirm your email address to activate your student account and access the competitive arena.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${verificationUrl}" style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#6366f1);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">
        Verify Email Address &rarr;
      </a>
    </div>
    <p style="font-size:12px;color:#64748b;text-align:center;word-break:break-all;">
      If the button does not work, copy and paste this link into your browser:<br>
      <a href="${verificationUrl}" style="color:#38bdf8;">${verificationUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
    <p style="font-size:11px;color:#64748b;text-align:center;margin:0;">
      This link expires in 24 hours. If you did not create a CodeArena account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
    `;

    return this.dispatch(to, 'Verify your CodeArena student account', html, `Please verify your email: ${verificationUrl}`);
  }

  async sendPasswordResetEmail(
    to: string,
    token: string,
    firstName?: string,
  ): Promise<EmailDispatchResult> {
    const webUrl = (this.config.get<string>('WEB_URL') || 'https://codearena-web-eg2p.onrender.com').replace(/\/$/, '');
    const resetUrl = `${webUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const greeting = firstName ? `Hi ${firstName},` : 'Hello,';

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

    return this.dispatch(to, 'Reset your CodeArena account password', html, `Reset your password at: ${resetUrl}`);
  }

  private async dispatch(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<EmailDispatchResult> {
    if (!this.transporter) {
      this.logger.warn(`Email provider not configured. Skipping live delivery to ${to}.`);
      return {
        success: false,
        delivered: false,
        error: 'Email provider not configured (set GMAIL_USER/GMAIL_APP_PASSWORD or SMTP credentials in environment)',
      };
    }

    const effectiveUser = this.config.get<string>('GMAIL_USER') || this.config.get<string>('SMTP_USER') || this.defaultGmailUser;
    const from = this.config.get<string>('SMTP_FROM') || `CodeArena <${effectiveUser}>`;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: to.toLowerCase().trim(),
        subject,
        html,
        text,
      });

      this.logger.log(`Dispatched email to ${to}: MessageID ${info.messageId}`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return {
        success: false,
        delivered: false,
        error: err.message || 'SMTP delivery failure',
      };
    }
  }
}
