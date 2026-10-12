"use client";

import { useEffect } from "react";
import { syncContestsWithServer } from "@/lib/contests-data";
import { syncProblemsWithServer } from "@/lib/problems-data";

const CHANNEL_NAME = "codearena_realtime_sync_channel";

const SYNCED_EVENTS = [
  "codearena_contests_updated",
  "codearena_problems_updated",
  "codearena_contest_submission",
  "codearena_contest_submissions_updated",
  "codearena_account_changed",
  "codearena_notifications_updated",
  "codearena_emails_updated",
  "codearena_order_updated",
  "codearena_leaderboard_updated",
];

export function RealtimeSyncBridge() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(CHANNEL_NAME);
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment:", e);
    }

    // 1. Handle incoming cross-tab messages
    if (channel) {
      channel.onmessage = (event: MessageEvent) => {
        const { eventName, detail, storagePayload } = event.data || {};
        if (!eventName) return;

        // Sync local storage mirror if provided
        if (storagePayload && storagePayload.key && storagePayload.value) {
          try {
            localStorage.setItem(storagePayload.key, storagePayload.value);
          } catch (e) {}
        }

        // Trigger local handlers
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { ...(detail || {}), _fromRemoteTab: true },
          })
        );

        // Specific reactions for heavy syncs
        if (eventName === "codearena_contests_updated") {
          syncContestsWithServer().catch(() => {});
        } else if (eventName === "codearena_problems_updated") {
          syncProblemsWithServer().catch(() => {});
        }
      };
    }

    // 2. Intercept and forward local events to the cross-tab channel
    const eventHandlers: Record<string, (e: Event) => void> = {};

    SYNCED_EVENTS.forEach((eventName) => {
      const handler = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?._fromRemoteTab) {
          return; // Prevent echo loops
        }

        if (channel) {
          try {
            channel.postMessage({
              eventName,
              detail: customEvent.detail || null,
              timestamp: Date.now(),
            });
          } catch (err) {
            console.warn("Failed to broadcast realtime event:", err);
          }
        }
      };

      eventHandlers[eventName] = handler;
      window.addEventListener(eventName, handler);
    });

    // 3. Fallback background sync across separate browser sessions (every 6 seconds)
    const syncInterval = setInterval(() => {
      syncContestsWithServer().catch(() => {});
      syncProblemsWithServer().catch(() => {});
    }, 6000);

    return () => {
      SYNCED_EVENTS.forEach((eventName) => {
        const handler = eventHandlers[eventName];
        if (handler) {
          window.removeEventListener(eventName, handler);
        }
      });
      clearInterval(syncInterval);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  return null;
}
