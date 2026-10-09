"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllAccounts,
  getActiveAccount,
  switchAccount,
  logoutAccount,
  logoutAll,
  UserAccount,
  getUserStats,
} from "@/lib/auth-session";
import { Button } from "@codearena/ui";

export function AccountSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeAccount, setActiveAccountState] = useState<UserAccount | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAccounts = () => {
    const list = getAllAccounts();
    const active = getActiveAccount();
    setAccounts(list);
    setActiveAccountState(active);
  };

  useEffect(() => {
    loadAccounts();

    const handleAccountChange = () => {
      loadAccounts();
    };

    window.addEventListener("codearena_account_changed", handleAccountChange);
    return () => {
      window.removeEventListener("codearena_account_changed", handleAccountChange);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSwitch = (accountId: string) => {
    const switched = switchAccount(accountId);
    setOpen(false);
    if (switched) {
      // Force page reload so all states, server components, and client components re-sync with the switched account
      window.location.reload();
    }
  };

  const handleLogoutCurrent = (accountId: string) => {
    logoutAccount(accountId);
    setOpen(false);
    const remaining = getAllAccounts();
    if (remaining.length > 0) {
      window.location.reload();
    } else {
      router.push("/login");
    }
  };

  const handleLogoutAll = () => {
    logoutAll();
    setOpen(false);
    router.push("/login");
  };

  const handleAddAccount = () => {
    setOpen(false);
    router.push("/login?addAccount=true");
  };

  if (!activeAccount) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push("/login")}
        className="text-xs h-9 px-4 rounded-xl border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-600 hover:text-white font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
      >
        <span>⚡</span> Sign In
      </Button>
    );
  }

  // Resolve authentic login name
  const resolveDisplayName = (acc: UserAccount): string => {
    if (acc.name && acc.name !== "CodeArena Student" && acc.name.trim() !== "") {
      return acc.name.trim();
    }
    if (acc.username && acc.username !== "student" && acc.username.trim() !== "") {
      return acc.username.trim();
    }
    if (typeof window !== "undefined") {
      try {
        const rawProf = localStorage.getItem("userProfile");
        if (rawProf) {
          const p = JSON.parse(rawProf);
          if (p.name && p.name !== "CodeArena Student" && p.name.trim() !== "") return p.name.trim();
          if (p.username && p.username.trim() !== "") return p.username.trim();
        }
      } catch {}
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
          if (fullName) return fullName;
          if (u.username) return u.username;
        }
      } catch {}
    }
    return acc.name || acc.username || "Coder";
  };

  const displayName = resolveDisplayName(activeAccount);
  const activeStats = getUserStats(activeAccount.id);
  const initial = (displayName || "U")[0]?.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 2026 3D Holographic Account Trigger Button */}
      <div className="flex items-center rounded-2xl bg-gradient-to-r from-[#0c102a]/95 via-[#130f30]/90 to-[#0c102a]/95 border border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all group backdrop-blur-xl p-1 pr-3">
        {/* Holographic 3D Avatar Capsule */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/profile');
          }}
          className="relative h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform cursor-pointer shrink-0"
          title="Open Full Profile (Click avatar)"
        >
          <div className="w-full h-full rounded-[10px] bg-[#090d20] flex items-center justify-center text-white font-black text-xs">
            {initial}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#090d20] shadow-[0_0_6px_#34d399]" />
        </button>

        {/* Name & Live Elo Telemetry */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 pl-2 text-left"
          title="Switch accounts or view profile"
        >
          <div className="text-left leading-tight">
            <div className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
              <span className="truncate max-w-[130px]">{displayName}</span>
              {accounts.length > 1 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/25 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                  +{accounts.length - 1}
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-slate-300/80 flex items-center gap-1.5 mt-0.5">
              <span className="text-indigo-400 font-bold">{activeStats.dsaRating} pts</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">{activeStats.problemsSolved} solved</span>
            </div>
          </div>
          <span className={`text-slate-400 text-xs ml-1 transition-transform duration-200 group-hover:text-white ${open ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-84 rounded-3xl bg-[#090d20]/95 backdrop-blur-2xl border border-indigo-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Prominent Profile Access Card */}
          <div className="p-3.5 border-b border-white/10 bg-gradient-to-r from-indigo-950/60 via-[#0d122b] to-purple-950/60">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-indigo-500/30 hover:border-indigo-400 hover:bg-white/[0.08] transition-all group text-left shadow-lg"
              title="Open full profile, heatmap, badges, and submissions"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-[#090d20] flex items-center justify-center text-white font-black text-sm">
                    {initial}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors truncate">
                      {displayName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    @{activeAccount.username} • <span className="text-indigo-400 font-bold">{activeStats.dsaRating} rating</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                <span>Profile</span>
                <span>&rarr;</span>
              </div>
            </button>
          </div>

          {/* Accounts Subtitle Header */}
          <div className="px-4 py-2 border-b border-border/40 bg-secondary/20 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase tracking-wider">
              Connected Accounts ({accounts.length})
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Real-time Sync
            </span>
          </div>

          {/* Accounts List */}
          <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
            {accounts.map((acc) => {
              const isActive = acc.id === activeAccount.id;
              const accStats = getUserStats(acc.id);
              const accInitial = (acc.name || acc.username || "U")[0]?.toUpperCase();

              return (
                <div
                  key={acc.id}
                  className={`p-2.5 rounded-xl transition-all border ${
                    isActive
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "hover:bg-secondary/60 border-transparent hover:border-border/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div 
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                      onClick={() => {
                        if (isActive) {
                          setOpen(false);
                          router.push('/profile');
                        } else {
                          handleSwitch(acc.id);
                        }
                      }}
                      title={isActive ? "Open profile" : "Switch to this account"}
                    >
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                          isActive
                            ? "bg-gradient-to-br from-primary to-purple-600 text-primary-foreground"
                            : "bg-secondary text-foreground border border-border"
                        }`}
                      >
                        {accInitial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-foreground truncate">
                            {acc.name || acc.username}
                          </p>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {acc.email}
                        </p>
                        <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                          Rating: <span className="text-foreground font-semibold">{accStats.dsaRating}</span> • Solved: <span className="text-foreground font-semibold">{accStats.problemsSolved}</span>
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setOpen(false);
                          router.push('/profile');
                        }}
                        className="h-7 px-2 text-[11px] font-semibold text-primary hover:text-primary hover:bg-primary/10 transition-all shrink-0"
                      >
                        Profile &rarr;
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSwitch(acc.id)}
                        className="h-7 px-2.5 text-[11px] font-semibold border-primary/40 hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
                      >
                        Switch
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Links */}
          <div className="p-2 border-t border-border/60 bg-secondary/20 space-y-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors text-left"
            >
              <span>👤</span>
              <span>Open My Profile & Achievements</span>
            </button>

            {(activeAccount?.role === "SUPER_ADMIN" || activeAccount?.role === "ADMIN") && (
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/admin");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <span>🛡️</span>
                <span>Admin Command Center</span>
              </button>
            )}

            <button
              onClick={handleAddAccount}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors text-left"
            >
              <span>➕</span>
              <span>Add Another Account</span>
            </button>

            <button
              onClick={() => handleLogoutCurrent(activeAccount.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors text-left"
            >
              <span>🚪</span>
              <span>Sign out of {activeAccount.name || activeAccount.username}</span>
            </button>

            {accounts.length > 1 && (
              <button
                onClick={handleLogoutAll}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <span>⚠️</span>
                <span>Sign out of all {accounts.length} accounts</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
