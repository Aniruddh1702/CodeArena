"use client";

import React from "react";
import {
  BookOpen,
  Trophy,
  Users,
  Activity,
  Plus,
  Calendar,
  FileUp,
  Shield,
  Download,
  Terminal,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "@codearena/ui";
import { AdminStatCard } from "./AdminStatCard";
import { ProblemDefinition } from "@/lib/problems-data";
import { Contest } from "@/lib/contests-data";

interface AdminOverviewTabProps {
  allQuestions: ProblemDefinition[];
  customSlugs: Set<string>;
  contestsList: Contest[];
  allUsersList: any[];
  auditLogs: Array<{ id: string; time: string; type: "system" | "question" | "contest" | "security"; message: string }>;
  adminProfile: {
    name: string;
    email: string;
    title: string;
    avatar: string;
    themeColor: string;
  };
  setActiveTab: (tab: string) => void;
  onResetFormAndCreate: () => void;
  onRunHealthDiagnostic: () => void;
  onExportJson: () => void;
  onOpenBroadcastModal: () => void;
  onRefreshContests: () => void;
  onRefreshUsers: () => void;
}

export function AdminOverviewTab({
  allQuestions,
  customSlugs,
  contestsList,
  allUsersList,
  auditLogs,
  adminProfile,
  setActiveTab,
  onResetFormAndCreate,
  onRunHealthDiagnostic,
  onExportJson,
  onOpenBroadcastModal,
  onRefreshContests,
  onRefreshUsers,
}: AdminOverviewTabProps) {
  const easyCount = allQuestions.filter((q) => q.difficulty === "EASY").length;
  const mediumCount = allQuestions.filter((q) => q.difficulty === "MEDIUM").length;
  const hardCount = allQuestions.filter((q) => q.difficulty === "HARD").length;

  const liveContests = contestsList.filter((c) => c.status === "LIVE").length;
  const upcomingContests = contestsList.filter((c) => c.status === "UPCOMING").length;

  const adminUsersCount = allUsersList.filter(
    (u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN"
  ).length;
  const studentUsersCount = allUsersList.length - adminUsersCount;

  // Compute total submissions recorded across contests
  const totalContestSubmissions = contestsList.reduce((acc, c) => {
    return acc + (c.registeredUsers?.length || 0);
  }, 0);

  // Top topics breakdown
  const topicCounts: Record<string, number> = {};
  allQuestions.forEach((q) => {
    q.topics?.forEach((t) => {
      const name = typeof t === "string" ? t : t.name;
      if (name) {
        topicCounts[name] = (topicCounts[name] || 0) + 1;
      }
    });
  });

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* 4 Core Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Problem Repository */}
        <AdminStatCard
          title="Problem Bank"
          value={allQuestions.length}
          subtitle="Algorithmic challenges live in IDE"
          icon={BookOpen}
          iconColor="indigo"
          badge={`${customSlugs.size} Custom`}
          onClick={() => setActiveTab("questions")}
          actionText="Inspect Problem Bank"
        >
          <div className="space-y-1.5 pt-2">
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
              <div
                style={{
                  width: `${allQuestions.length ? (easyCount / allQuestions.length) * 100 : 0}%`,
                }}
                className="bg-emerald-400 h-full"
                title="Easy"
              />
              <div
                style={{
                  width: `${allQuestions.length ? (mediumCount / allQuestions.length) * 100 : 0}%`,
                }}
                className="bg-amber-400 h-full"
                title="Medium"
              />
              <div
                style={{
                  width: `${allQuestions.length ? (hardCount / allQuestions.length) * 100 : 0}%`,
                }}
                className="bg-rose-400 h-full"
                title="Hard"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 font-medium">{easyCount} Easy</span>
              <span className="text-amber-400 font-medium">{mediumCount} Med</span>
              <span className="text-rose-400 font-medium">{hardCount} Hard</span>
            </div>
          </div>
        </AdminStatCard>

        {/* Card 2: Contests */}
        <AdminStatCard
          title="Contests & Arena"
          value={contestsList.length}
          subtitle="Tournament arenas scheduled"
          icon={Trophy}
          iconColor="amber"
          badge={liveContests > 0 ? `${liveContests} Live` : "Standby"}
          onClick={() => {
            setActiveTab("contests");
            onRefreshContests();
          }}
          actionText="Manage Contests"
        >
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                liveContests > 0
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-white/[0.04] text-slate-400 border border-white/5"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  liveContests > 0 ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              {liveContests} Live Tournaments
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {upcomingContests} Scheduled
            </span>
          </div>
        </AdminStatCard>

        {/* Card 3: User Roster */}
        <AdminStatCard
          title="Student Roster"
          value={allUsersList.length}
          subtitle="Learners and competitors registered"
          icon={Users}
          iconColor="cyan"
          badge={`${studentUsersCount} Students`}
          onClick={() => {
            setActiveTab("users");
            onRefreshUsers();
          }}
          actionText="View User Directory"
        >
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span className="font-mono text-[11px]">{adminUsersCount} Administrators</span>
            <span className="font-mono text-[11px] text-cyan-400">
              {studentUsersCount} Competitors
            </span>
          </div>
        </AdminStatCard>

        {/* Card 4: System Health */}
        <AdminStatCard
          title="Sandbox Diagnostics"
          value="Operational"
          subtitle="Quad-engine isolation active"
          icon={Activity}
          iconColor="emerald"
          badge="4 Runners Ready"
          onClick={() => setActiveTab("system")}
          actionText="View System Gauges"
        >
          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-mono text-[11px]">
            <span>V8 • Python • g++ • Java21</span>
          </div>
        </AdminStatCard>
      </div>

      {/* Quick Action Dock */}
      <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-white">Platform Actions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onResetFormAndCreate}
            className="h-8 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Problem</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveTab("contests");
              onRefreshContests();
            }}
            className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Schedule Contest</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveTab("import")}
            className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <FileUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import JSON</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenBroadcastModal}
            className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <span>📢</span>
            <span>Broadcast Alert</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onRunHealthDiagnostic}
            className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ping Kernel</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onExportJson}
            className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Backup</span>
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Question Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Topics & Contest Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Topics Breakdown */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Curriculum & Topic Distribution</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Top problem categories indexed in the interactive IDE
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("questions")}
                className="text-xs text-indigo-400 hover:text-indigo-300 h-8 px-2"
              >
                View All →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sortedTopics.map(([topic, count]) => (
                <div
                  key={topic}
                  onClick={() => setActiveTab("questions")}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/15 cursor-pointer transition-all space-y-1"
                >
                  <div className="text-[11px] text-slate-400 truncate">{topic}</div>
                  <div className="text-base font-bold text-white font-mono flex items-center justify-between">
                    <span>{count}</span>
                    <span className="text-[10px] text-indigo-400 font-normal">problems</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Contest Preview */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Tournaments & Battles</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-coder competitive arena status
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveTab("contests");
                  onRefreshContests();
                }}
                className="text-xs text-amber-400 hover:text-amber-300 h-8 px-2"
              >
                Manage →
              </Button>
            </div>

            {contestsList.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No scheduled contests yet.</p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("contests")}
                  className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-xl"
                >
                  Schedule First Contest
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {contestsList.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {c.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.2 rounded-full font-bold uppercase ${
                            c.status === "LIVE"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : c.status === "UPCOMING"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-white/[0.05] text-slate-400 border border-white/10"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>{c.durationMinutes} min</span>
                        <span>•</span>
                        <span>{c.problems?.length || 0} problems</span>
                        <span>•</span>
                        <span>{c.participantsCount || c.registeredUsers?.length || 0} enrolled</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveTab("contests");
                        onRefreshContests();
                      }}
                      className="h-8 px-3 text-xs bg-white/[0.03] border-white/10 text-slate-300 hover:text-white rounded-xl shrink-0"
                    >
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Real Activity & System Environment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity Log */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Platform Activity Log</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recent operational and security events
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live</span>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 5).map((log) => {
                const typeColors = {
                  security: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                  system: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  question: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                  contest: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                };
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
                          typeColors[log.type] || typeColors.system
                        }`}
                      >
                        {log.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{log.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node.js Sandbox Environment Card */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Runtime Environment</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Healthy
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Node Engine</span>
                <span className="text-white font-medium">Node.js v20.x LTS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Sandbox Isolation</span>
                <span className="text-emerald-400 font-medium">Active (Isolated VM)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Database Layer</span>
                <span className="text-white font-medium">PostgreSQL & In-Memory Store</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Supported Compilers</span>
                <span className="text-slate-300">V8, Py3, GCC, Java21</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
