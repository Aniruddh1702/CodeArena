"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  PlusCircle,
  FileUp,
  Users,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  badge?: number | string;
  action?: () => void;
  section: "core" | "authoring" | "governance";
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  allQuestionsCount: number;
  contestsCount: number;
  usersCount: number;
  adminProfile: {
    name: string;
    email: string;
    title: string;
    avatar: string;
    role?: string;
  };
  onLock: () => void;
  onRefreshContests?: () => void;
  onRefreshUsers?: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  allQuestionsCount,
  contestsCount,
  usersCount,
  adminProfile,
  onLock,
  onRefreshContests,
  onRefreshUsers,
}: AdminSidebarProps) {
  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      shortLabel: "Overview",
      icon: LayoutDashboard,
      section: "core",
    },
    {
      id: "questions",
      label: "Problem Bank",
      shortLabel: "Problems",
      icon: BookOpen,
      badge: allQuestionsCount,
      section: "core",
    },
    {
      id: "contests",
      label: "Contests & Arena",
      shortLabel: "Contests",
      icon: Trophy,
      badge: contestsCount,
      action: onRefreshContests,
      section: "core",
    },
    {
      id: "create",
      label: "Create Problem",
      shortLabel: "Create",
      icon: PlusCircle,
      section: "authoring",
    },
    {
      id: "import",
      label: "Batch Import",
      shortLabel: "Import",
      icon: FileUp,
      section: "authoring",
    },
    {
      id: "users",
      label: "User Roster",
      shortLabel: "Users",
      icon: Users,
      badge: usersCount,
      action: onRefreshUsers,
      section: "governance",
    },
    {
      id: "system",
      label: "System Health",
      shortLabel: "Health",
      icon: Activity,
      section: "governance",
    },
    {
      id: "profile",
      label: "Operator Vault",
      shortLabel: "Settings",
      icon: Shield,
      section: "governance",
    },
  ];

  const renderSection = (section: "core" | "authoring" | "governance", title: string) => {
    const items = navItems.filter((item) => item.section === section);
    return (
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.action) item.action();
                if (mobileOpen) setMobileOpen(false);
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? "bg-indigo-600/15 text-white font-semibold shadow-sm border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </div>

              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30"
                          : "bg-white/[0.05] text-slate-400 border border-white/5"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-white/[0.07] select-none">
      {/* Brand Header */}
      <div className={`h-16 flex items-center px-4 border-b border-white/[0.06] justify-between ${collapsed ? "justify-center px-0" : ""}`}>
        <Link
          href="/admin"
          className="flex items-center gap-2.5 overflow-hidden"
          onClick={() => {
            setActiveTab("overview");
            if (mobileOpen) setMobileOpen(false);
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
            C
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                CodeArena
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Admin
                </span>
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                Platform Console 2026
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {renderSection("core", "Platform Core")}
        {renderSection("authoring", "Content Studio")}
        {renderSection("governance", "Governance & System")}

        {/* Public Website Shortcut */}
        {!collapsed && (
          <div className="pt-2 border-t border-white/[0.06]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Student View</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Live ↗</span>
            </Link>
          </div>
        )}
      </div>

      {/* Operator Footer & Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.06] space-y-2 bg-black/20">
        {!collapsed && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div
              onClick={() => {
                setActiveTab("profile");
                if (mobileOpen) setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-sm font-bold text-indigo-300 shrink-0">
                {adminProfile.avatar || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {adminProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  Super Admin
                </div>
              </div>
            </div>

            <button
              onClick={onLock}
              title="Lock Admin Console"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse / Expand Toggle Button (Desktop only) */}
        <div className="hidden lg:flex items-center justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <span className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
