import { getActiveAccount, getUserScopedKey, getAllAccounts } from "./auth-session";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "CONTEST_SCHEDULED" | "CONTEST_1HOUR_ALERT" | "CONTEST_STARTING" | "CONTEST_LIVE" | "GENERAL";
  contestId?: string;
  contestTitle?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const STORAGE_KEY = "codearena_notifications";
const NOTIFIED_TIMERS_KEY = "codearena_notified_timers";

export function getNotificationsStorageKey(userId?: string): string {
  if (typeof window === "undefined") return STORAGE_KEY;
  const id = userId || getActiveAccount()?.id;
  if (!id) return STORAGE_KEY;
  return getUserScopedKey(id, "notifications");
}

export function getNotifications(userId?: string): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const active = userId ? { id: userId } : getActiveAccount();
    if (!active?.id) {
      return [];
    }
    const key = getUserScopedKey(active.id, "notifications");
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    console.error("Failed to read notifications:", e);
    return [];
  }
}

export function saveNotification(
  notif: Omit<AppNotification, "id" | "timestamp" | "read">,
  targetUserId?: string
): AppNotification {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  if (typeof window === "undefined") return newNotif;

  try {
    if (targetUserId === "ALL") {
      const accounts = getAllAccounts();
      accounts.forEach((acc) => {
        const key = getUserScopedKey(acc.id, "notifications");
        const list = getNotifications(acc.id);
        list.unshift(newNotif);
        if (list.length > 50) list.length = 50;
        localStorage.setItem(key, JSON.stringify(list));
      });
      window.dispatchEvent(new CustomEvent("codearena_notifications_updated", { detail: newNotif }));
    } else {
      const targetId = targetUserId || getActiveAccount()?.id;
      if (targetId) {
        const key = getUserScopedKey(targetId, "notifications");
        const list = getNotifications(targetId);
        list.unshift(newNotif);
        if (list.length > 50) list.length = 50;
        localStorage.setItem(key, JSON.stringify(list));
      }
      window.dispatchEvent(new CustomEvent("codearena_notifications_updated", { detail: newNotif }));
    }

    // Send Browser OS Notification if permission granted
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(newNotif.title, {
        body: newNotif.message,
        icon: "/favicon.ico",
      });
    }
  } catch (e) {
    console.error("Failed to save notification:", e);
  }

  return newNotif;
}

export function markNotificationAsRead(id: string, userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const targetId = userId || getActiveAccount()?.id;
    if (!targetId) return;
    const key = getUserScopedKey(targetId, "notifications");
    const list = getNotifications(targetId);
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("codearena_notifications_updated", { detail: { id, read: true } }));
    }
  } catch (e) {
    console.error("Failed to mark notification read:", e);
  }
}

export function markAllNotificationsAsRead(userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const targetId = userId || getActiveAccount()?.id;
    if (!targetId) return;
    const key = getUserScopedKey(targetId, "notifications");
    const list = getNotifications(targetId);
    list.forEach((n) => (n.read = true));
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("codearena_notifications_updated"));
  } catch (e) {
    console.error("Failed to mark all notifications read:", e);
  }
}

export function clearNotifications(userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const targetId = userId || getActiveAccount()?.id;
    if (!targetId) return;
    const key = getUserScopedKey(targetId, "notifications");
    localStorage.setItem(key, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("codearena_notifications_updated"));
  } catch (e) {
    console.error("Failed to clear notifications:", e);
  }
}

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const perm = await Notification.requestPermission();
    return perm === "granted";
  }
  return false;
}

// Background checker for 1-hour contest reminders
export function checkContest1HourReminders(contests: any[]): void {
  if (typeof window === "undefined") return;

  try {
    const notifiedMapRaw = localStorage.getItem(NOTIFIED_TIMERS_KEY);
    const notifiedMap: Record<string, boolean> = notifiedMapRaw ? JSON.parse(notifiedMapRaw) : {};
    const now = Date.now();

    contests.forEach((contest) => {
      if (contest.status !== "UPCOMING") return;

      const startTime = new Date(contest.startTime).getTime();
      const diffMinutes = (startTime - now) / (1000 * 60);

      // Check if contest is scheduled within 60 minutes (1 hour)
      const key1Hour = `${contest.id}_1hour`;
      if (diffMinutes > 0 && diffMinutes <= 60 && !notifiedMap[key1Hour]) {
        notifiedMap[key1Hour] = true;
        saveNotification({
          title: `⏰ Contest Alert: 1 Hour Remaining!`,
          message: `'${contest.title}' is scheduled to start in ${Math.round(diffMinutes)} minutes. Get your IDE ready! Check your Gmail for contest link.`,
          type: "CONTEST_1HOUR_ALERT",
          contestId: contest.id,
          contestTitle: contest.title,
          actionUrl: `/contests/${contest.id}`,
        }, "ALL");

        // Dispatch 1-Hour Reminder Gmail/Email to all registered participants and students
        try {
          import("./email-service").then(({ dispatchContestEmail }) => {
            import("./auth-session").then(({ getAllAccounts }) => {
              const accounts = getAllAccounts();
              const recipientMap = new Map<string, string>();

              // Default participant pool
              const defaultStudents = [
                { email: "alex.chen@gmail.com", name: "Alex Chen" },
                { email: "priya.patel@gmail.com", name: "Priya Patel" },
                { email: "rahul.sharma@gmail.com", name: "Rahul Sharma" },
                { email: "student@codearena.dev", name: "Student Participant" },
              ];
              defaultStudents.forEach((s) => recipientMap.set(s.email, s.name));

              accounts.forEach((a) => {
                if (a.email && a.email.includes("@")) {
                  recipientMap.set(a.email, a.name || a.username);
                }
              });

              if (Array.isArray(contest.registeredUsers)) {
                contest.registeredUsers.forEach((email: string) => {
                  if (email && email.includes("@") && !recipientMap.has(email)) {
                    recipientMap.set(email, email.split("@")[0]);
                  }
                });
              }

              const recipients = Array.from(recipientMap.entries()).map(([email, name]) => ({ email, name }));
              dispatchContestEmail("CONTEST_1HOUR_REMINDER", contest, recipients);
            });
          });
        } catch (mailErr) {
          console.error("Failed to dispatch 1-hour reminder emails:", mailErr);
        }
      }

      // Check if contest is starting now (within 5 minutes)
      const keyStarting = `${contest.id}_starting`;
      if (diffMinutes > 0 && diffMinutes <= 5 && !notifiedMap[keyStarting]) {
        notifiedMap[keyStarting] = true;
        saveNotification({
          title: `🚀 Contest Starting Soon: 5 Mins!`,
          message: `'${contest.title}' begins in 5 minutes! Enter the arena now.`,
          type: "CONTEST_STARTING",
          contestId: contest.id,
          contestTitle: contest.title,
          actionUrl: `/contests/${contest.id}`,
        }, "ALL");
      }
    });

    localStorage.setItem(NOTIFIED_TIMERS_KEY, JSON.stringify(notifiedMap));
  } catch (e) {
    console.error("Failed checking contest reminders:", e);
  }
}
