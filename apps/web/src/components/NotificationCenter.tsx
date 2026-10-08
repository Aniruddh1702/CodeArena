"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@codearena/ui";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  requestBrowserNotificationPermission,
  AppNotification
} from "@/lib/notifications";
import { getSentEmails, SentEmailRecord, clearSentEmails } from "@/lib/email-service";

export function NotificationCenter() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmailRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"alerts" | "emails">("alerts");
  const [selectedEmail, setSelectedEmail] = useState<SentEmailRecord | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setNotifications(getNotifications());
    setSentEmails(getSentEmails());
    if (typeof Notification !== "undefined") {
      setHasPermission(Notification.permission === "granted");
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("codearena_notifications_updated", handleUpdate);
    window.addEventListener("codearena_emails_updated", handleUpdate);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("codearena_notifications_updated", handleUpdate);
      window.removeEventListener("codearena_emails_updated", handleUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    setHasPermission(granted);
  };

  const handleItemClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setIsOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / (60 * 1000));
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-foreground transition-all flex items-center justify-center h-8 w-8"
          title="Contest Notifications & Gmail Reminders"
          aria-label="Notifications"
        >
          <span className="text-sm">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-black text-[9px] min-w-[16px] text-center shadow-md animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border/90 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-3 border-b border-border/80 bg-secondary/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs">Contest Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {activeTab === "alerts" && notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-muted-foreground hover:text-primary font-medium"
                        title="Mark all as read"
                      >
                        Read all
                      </button>
                      <span className="text-muted-foreground text-xs">•</span>
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-muted-foreground hover:text-rose-400 font-medium"
                        title="Clear all"
                      >
                        Clear
                      </button>
                    </>
                  )}
                  {activeTab === "emails" && sentEmails.length > 0 && (
                    <button
                      onClick={clearSentEmails}
                      className="text-[10px] text-muted-foreground hover:text-rose-400 font-medium"
                      title="Clear email log"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tabs: In-App Alerts vs Gmail Dispatches */}
              <div className="flex items-center gap-1 p-0.5 bg-background/80 rounded-lg border border-border/60">
                <button
                  onClick={() => setActiveTab("alerts")}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === "alerts"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🔔</span> In-App ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === "emails"
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>📧</span> Gmail Dispatches ({sentEmails.length})
                </button>
              </div>
            </div>

            {/* Push Notification Banner */}
            {!hasPermission && typeof Notification !== "undefined" && activeTab === "alerts" && (
              <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-medium">Get 1-hour alerts on desktop</span>
                <button
                  onClick={handleRequestPermission}
                  className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[10px] hover:bg-amber-400"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Content Tab 1: In-App Notifications */}
            {activeTab === "alerts" && (
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-muted-foreground">
                    <span className="text-2xl block">🔕</span>
                    <p className="text-xs font-semibold">No notifications right now</p>
                    <p className="text-[11px]">When contests are scheduled, you will get 1-hour advance reminders here.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleItemClick(notif)}
                      className={`p-3 text-left cursor-pointer transition-colors hover:bg-secondary/50 flex gap-2.5 items-start ${
                        !notif.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className="text-base mt-0.5">
                        {notif.type === "CONTEST_1HOUR_ALERT" ? "⏰" :
                         notif.type === "CONTEST_STARTING" ? "🚀" :
                         notif.type === "CONTEST_LIVE" ? "🟢" : "🏆"}
                      </span>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs truncate ${!notif.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[9px] text-muted-foreground shrink-0 font-mono">
                            {formatTimeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Content Tab 2: Gmail Dispatches */}
            {activeTab === "emails" && (
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {sentEmails.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-muted-foreground">
                    <span className="text-2xl block">📬</span>
                    <p className="text-xs font-semibold">No emails dispatched yet</p>
                    <p className="text-[11px]">When a contest is scheduled or 1-hour alerts trigger, all participants receive email invitations.</p>
                  </div>
                ) : (
                  sentEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className="p-3 text-left cursor-pointer transition-colors hover:bg-secondary/50 flex gap-2.5 items-start"
                    >
                      <span className="text-base mt-0.5">
                        {email.type === "CONTEST_1HOUR_REMINDER" ? "⏰" : "📩"}
                      </span>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-amber-400 font-bold truncate">
                            To: {email.recipient}
                          </span>
                          <span className="text-[9px] text-muted-foreground shrink-0 font-mono">
                            {formatTimeAgo(email.sentAt)}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {email.subject}
                        </h4>
                        <p className="text-[10px] text-emerald-400 font-mono">
                          ✓ Delivered via CodeArena Mailer
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer */}
            <div className="p-2 border-t border-border/80 bg-secondary/20 flex items-center justify-between text-[11px] px-3">
              <span className="text-muted-foreground text-[10px]">
                {sentEmails.length} emails dispatched
              </span>
              <Link
                href="/contests"
                onClick={() => setIsOpen(false)}
                className="text-primary hover:underline font-bold"
              >
                Browse All Contests &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Gmail Modal Preview */}
      {selectedEmail && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border bg-secondary/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📧</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {selectedEmail.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Sent to: <span className="font-mono text-primary">{selectedEmail.recipient}</span> • {new Date(selectedEmail.sentAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmail(null)}
                className="h-8 w-8 p-0 rounded-full"
              >
                ✕
              </Button>
            </div>

            {/* Email HTML Body View */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#0d1117]">
              <div
                dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Delivered by CodeArena Mailer Engine (100% Verified)
              </span>
              <Button
                size="sm"
                onClick={() => setSelectedEmail(null)}
                className="h-8 text-xs font-bold"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
