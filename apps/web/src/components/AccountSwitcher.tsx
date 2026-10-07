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
        className="text-xs h-8"
      >
        Sign In
      </Button>
    );
  }

  const activeStats = getUserStats(activeAccount.id);
  const initial = (activeAccount.name || activeAccount.username || "U")[0]?.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Trigger Button */}
      <div className="flex items-center rounded-full bg-secondary/60 hover:bg-secondary border border-border/80 transition-all hover:border-primary/40 shadow-sm group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/profile');
          }}
          className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-black text-xs shadow-sm hover:scale-105 transition-transform ml-1 cursor-pointer"
          title="Open Full Profile (Click avatar)"
        >
          {initial}
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-left"
          title="Switch accounts or view profile"
        >
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
              <span>{activeAccount.name || activeAccount.username}</span>
              {accounts.length > 1 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary font-mono font-bold">
                  +{accounts.length - 1}
                </span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {activeStats.dsaRating} pts • {activeStats.problemsSolved} solved
            </div>
          </div>
          <span className="text-muted-foreground text-xs ml-0.5 transition-transform duration-200 group-hover:text-foreground">
            {open ? "▲" : "▼"}
          </span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Prominent Profile Access Card */}
          <div className="p-3 border-b border-border/60 bg-gradient-to-r from-primary/15 via-secondary/50 to-purple-600/15">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card border border-primary/40 hover:border-primary hover:shadow-lg transition-all group text-left shadow-sm"
              title="Open full profile, heatmap, badges, and submissions"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-black text-sm shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {activeAccount.name || activeAccount.username}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    @{activeAccount.username} • {activeStats.dsaRating} rating
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform shrink-0 ml-2">
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
