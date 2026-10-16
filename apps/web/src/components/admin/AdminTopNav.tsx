"use client";

import React from "react";
import {
  Menu,
  Shield,
  Download,
  Plus,
  Lock,
  ExternalLink,
  Activity,
} from "lucide-react";
import { Button } from "@codearena/ui";

interface AdminTopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileSidebar: () => void;
  onLock: () => void;
  onExportJson: () => void;
  onResetFormAndCreate: () => void;
  totalProblemsCount: number;
  adminName: string;
  adminAvatar: string;
}

export function AdminTopNav({
  activeTab,
  setActiveTab,
  onOpenMobileSidebar,
  onLock,
  onExportJson,
  onResetFormAndCreate,
  totalProblemsCount,
  adminName,
  adminAvatar,
}: AdminTopNavProps) {
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: "Overview",
      subtitle: "Platform health, metric breakdown, and operational status",
    },
    questions: {
      title: "Problem Bank",
      subtitle: "Author, organize, filter, and calibrate algorithmic challenges",
    },
    contests: {
      title: "Contests & Arena",
      subtitle: "Multi-coder tournaments, live runner clocks, and auto-judging",
    },
    create: {
      title: "Problem Studio",
      subtitle: "Author bespoke challenges across V8, Python 3, C++, and Java 21",
    },
    import: {
      title: "Batch Import",
      subtitle: "Staged bulk parser for LeetCode-style JSON and problem documents",
    },
    users: {
      title: "User Roster",
      subtitle: "Student access governance, role elevation, and rating records",
    },
    system: {
      title: "System Diagnostics",
      subtitle: "Runtime sandbox metrics, memory overhead, and kernel latency",
    },
    profile: {
      title: "Operator Vault",
      subtitle: "Security credentials, session governance, and visual preferences",
    },
  };

  const current = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.07] bg-[#0b0f19]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Admin</span>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-white truncate">{current.title}</span>
        </div>
      </div>

      {/* Right: Actions, Status Pill & Operator Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Real-time Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium">Operational</span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400">{totalProblemsCount} Problems</span>
        </div>

        {/* Quick Action: New Problem */}
        <Button
          size="sm"
          onClick={onResetFormAndCreate}
          className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-1.5 shadow-sm shadow-indigo-500/20 border border-indigo-500/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Problem</span>
        </Button>

        {/* Quick Action: Export Backup */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportJson}
          className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border-white/10 rounded-xl gap-1.5 transition-all hidden md:flex"
          title="Download complete JSON problem backup"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </Button>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-px bg-white/[0.08]" />

        {/* Operator Badge */}
        <button
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          title="Operator Vault & Settings"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-300">
            {adminAvatar || "A"}
          </div>
          <span className="hidden xl:inline text-xs font-medium text-slate-200">
            {adminName.split(" ")[0]}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            ROOT
          </span>
        </button>

        {/* Quick Lock Session Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLock}
          className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          title="Lock Admin Session"
        >
          <Lock className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
