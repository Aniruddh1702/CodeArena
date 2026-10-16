"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor?: "indigo" | "emerald" | "amber" | "rose" | "cyan" | "purple";
  badge?: string;
  onClick?: () => void;
  actionText?: string;
  children?: React.ReactNode;
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "indigo",
  badge,
  onClick,
  actionText,
  children,
}: AdminStatCardProps) {
  const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
    indigo: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
    },
  };

  const current = colorStyles[iconColor] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/[0.07] bg-[#0c101d] p-5 flex flex-col justify-between transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-white/20 hover:bg-[#0f1424]" : ""
      }`}
    >
      <div className="space-y-3">
        {/* Header: Title, Icon, Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/5">
                {badge}
              </span>
            )}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${current.bg} ${current.border} ${current.text}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Value & Subtitle */}
        <div>
          <div className="text-3xl font-black tracking-tight text-white font-sans">
            {value}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </div>
        </div>

        {/* Custom content (e.g. breakdown bar) */}
        {children && <div className="pt-1">{children}</div>}
      </div>

      {/* Optional action footer */}
      {actionText && (
        <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-slate-400 group">
          <span className="group-hover:text-white transition-colors">{actionText}</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </div>
  );
}
