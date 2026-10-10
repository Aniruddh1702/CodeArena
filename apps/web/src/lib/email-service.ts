import { getActiveAccount, getUserScopedKey, getAllAccounts } from "./auth-session";

export interface SentEmailRecord {
  id: string;
  recipient: string;
  recipientName?: string;
  subject: string;
  htmlBody: string;
  sentAt: string;
  contestId?: string;
  type: "CONTEST_SCHEDULED" | "CONTEST_1HOUR_REMINDER" | "CONTEST_LIVE";
  status: "DELIVERED" | "SENT";
}

const EMAIL_STORAGE_KEY = "codearena_sent_emails";

export function getSentEmails(recipientEmail?: string): SentEmailRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const active = getActiveAccount();
    const targetEmail = (recipientEmail || active?.email || "").toLowerCase().trim();
    if (!targetEmail) return [];

    // Check account-scoped sent emails first
    if (active?.id) {
      const userKey = getUserScopedKey(active.id, "sent_emails");
      const userRaw = localStorage.getItem(userKey);
      if (userRaw) {
        return JSON.parse(userRaw);
      }
    }

    // Otherwise filter global sent emails strictly for this student
    const raw = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (!raw) return [];
    const list: SentEmailRecord[] = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list.filter((e) => (e.recipient || "").toLowerCase().trim() === targetEmail);
    }
    return [];
  } catch (e) {
    console.error("Failed to load sent emails:", e);
    return [];
  }
}

export function saveSentEmail(
  record: Omit<SentEmailRecord, "id" | "sentAt" | "status">,
  targetUserId?: string
): SentEmailRecord {
  const newEmail: SentEmailRecord = {
    ...record,
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sentAt: new Date().toISOString(),
    status: "DELIVERED",
  };

  if (typeof window === "undefined") return newEmail;

  try {
    // 1. Save to global list
    const raw = localStorage.getItem(EMAIL_STORAGE_KEY);
    const list: SentEmailRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(newEmail);
    if (list.length > 100) list.length = 100;
    localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(list));

    // 2. Also save to user-scoped list if account can be identified
    const accounts = getAllAccounts();
    const recipientLower = (newEmail.recipient || "").toLowerCase().trim();
    const matchedAccount = targetUserId 
      ? accounts.find((a) => a.id === targetUserId)
      : accounts.find((a) => (a.email || "").toLowerCase().trim() === recipientLower);

    if (matchedAccount) {
      const userKey = getUserScopedKey(matchedAccount.id, "sent_emails");
      const userRaw = localStorage.getItem(userKey);
      const userList: SentEmailRecord[] = userRaw ? JSON.parse(userRaw) : [];
      userList.unshift(newEmail);
      if (userList.length > 50) userList.length = 50;
      localStorage.setItem(userKey, JSON.stringify(userList));
    }

    window.dispatchEvent(new CustomEvent("codearena_emails_updated", { detail: newEmail }));
  } catch (e) {
    console.error("Failed to save email record:", e);
  }

  return newEmail;
}

export function clearSentEmails(recipientEmail?: string): void {
  if (typeof window === "undefined") return;
  try {
    const active = getActiveAccount();
    const targetEmail = (recipientEmail || active?.email || "").toLowerCase().trim();

    if (active?.id) {
      const userKey = getUserScopedKey(active.id, "sent_emails");
      localStorage.setItem(userKey, JSON.stringify([]));
    }

    if (targetEmail) {
      const raw = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (raw) {
        const list: SentEmailRecord[] = JSON.parse(raw);
        const filtered = list.filter((e) => (e.recipient || "").toLowerCase().trim() !== targetEmail);
        localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } else {
      localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify([]));
    }

    window.dispatchEvent(new CustomEvent("codearena_emails_updated"));
  } catch (e) {
    console.error("Failed to clear sent emails:", e);
  }
}

export async function dispatchContestEmail(
  type: "CONTEST_SCHEDULED" | "CONTEST_1HOUR_REMINDER",
  contest: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    durationMinutes: number;
    problems?: any[];
  },
  recipients: Array<{ email: string; name?: string }>
): Promise<{ success: boolean; count: number }> {
  const startDate = new Date(contest.startTime);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const contestUrl = typeof window !== "undefined"
    ? `${window.location.origin}/contests/${contest.id}`
    : `http://localhost:3000/contests/${contest.id}`;

  const is1Hour = type === "CONTEST_1HOUR_REMINDER";
  const subject = is1Hour
    ? `⏰ [1-HOUR REMINDER] '${contest.title}' Begins in 60 Minutes!`
    : `🏆 [CONTEST SCHEDULED] You are registered for '${contest.title}'`;

  for (const user of recipients) {
    const userName = user.name || user.email.split("@")[0] || "Contestant";

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; color: #e6edf3; padding: 32px 16px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #30363d;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 1px solid #21262d; padding-bottom: 24px; margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; font-weight: 900; font-size: 20px; padding: 8px 16px; border-radius: 8px; margin-bottom: 12px;">
            ⚡ CodeArena
          </div>
          <h1 style="font-size: 24px; font-weight: 800; margin: 0; color: #f0f6fc;">
            ${is1Hour ? "⏰ 1-Hour Urgent Reminder" : "🏆 New Contest Scheduled"}
          </h1>
          <p style="color: #8b949e; font-size: 14px; margin-top: 6px;">
            ${is1Hour ? "Your scheduled algorithm battle is starting in exactly 1 hour!" : "Mark your calendar and get ready to climb the global leaderboard."}
          </p>
        </div>

        <!-- Contest Card -->
        <div style="background-color: #161b22; border: 1px solid ${is1Hour ? '#e3b341' : '#388bfd'}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: ${is1Hour ? '#3b2300' : '#0c2d6b'}; color: ${is1Hour ? '#f2cc60' : '#58a6ff'}; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; margin-bottom: 10px;">
            ${is1Hour ? "STARTS IN 60 MINS" : "OFFICIAL CONTEST"}
          </div>
          <h2 style="font-size: 20px; font-weight: 700; color: #f0f6fc; margin: 0 0 10px 0;">
            ${contest.title}
          </h2>
          <p style="color: #c9d1d9; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
            ${contest.description}
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #8b949e;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #f0f6fc;">📅 Date:</td>
              <td style="padding: 6px 0; text-align: right; color: #e6edf3;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #f0f6fc;">🕒 Start Time:</td>
              <td style="padding: 6px 0; text-align: right; color: #58a6ff; font-weight: 700;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #f0f6fc;">⏳ Duration:</td>
              <td style="padding: 6px 0; text-align: right; color: #e6edf3;">${contest.durationMinutes} Minutes</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #f0f6fc;">🧩 Challenges:</td>
              <td style="padding: 6px 0; text-align: right; color: #e6edf3;">${contest.problems?.length || 4} DSA Problems (Easy to Hard)</td>
            </tr>
          </table>
        </div>

        <!-- Checklist -->
        <div style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="font-size: 14px; font-weight: 700; color: #f0f6fc; margin: 0 0 8px 0;">
            📋 Pre-Contest Checklist for ${userName}:
          </h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #8b949e; line-height: 1.6;">
            <li>Ensure a stable internet connection and quiet coding space.</li>
            <li>Test your editor settings in the Practice Bank.</li>
            <li>Review algorithm cheat-sheets (Sliding Window, Binary Search, DP).</li>
            <li>Contest IDE supports JavaScript, TypeScript, Python, C++, and Java.</li>
          </ul>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${contestUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
            ${is1Hour ? "🚀 Open Contest Arena (Ready in 1 Hr) →" : "🏆 View Contest Details & Register →"}
          </a>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #21262d; padding-top: 16px; text-align: center; font-size: 11px; color: #8b949e;">
          <p style="margin: 0 0 6px 0;">
            This email was sent to <strong>${user.email}</strong> by CodeArena Contest Operations.
          </p>
          <p style="margin: 0;">
            CodeArena Platform • Real-time Algorithmic Competitions
          </p>
        </div>
      </div>
    `;

    // Save persistent sent email record
    saveSentEmail({
      recipient: user.email,
      recipientName: userName,
      subject,
      htmlBody,
      contestId: contest.id,
      type,
    });

    // Optional dispatch to API route
    try {
      if (typeof window !== "undefined") {
        fetch("/api/notifications/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: user.email,
            subject,
            htmlBody,
            type,
            contestId: contest.id,
          }),
        }).catch(() => null);
      }
    } catch (e) {
      // Ignore background network error
    }
  }

  return { success: true, count: recipients.length };
}
