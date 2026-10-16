"use client";

import React, { useState } from "react";
import {
  Activity,
  Cpu,
  Database,
  Shield,
  Zap,
  CheckCircle2,
  Server,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@codearena/ui";

interface AdminSystemTabProps {
  auditLogs: Array<{ id: string; time: string; type: "system" | "question" | "contest" | "security"; message: string }>;
  onRunHealthDiagnostic: () => void;
}

export function AdminSystemTab({ auditLogs, onRunHealthDiagnostic }: AdminSystemTabProps) {
  const [logFilter, setLogFilter] = useState<"all" | "system" | "question" | "contest" | "security">("all");
  const [pinging, setPinging] = useState(false);

  const handlePing = () => {
    setPinging(true);
    onRunHealthDiagnostic();
    setTimeout(() => setPinging(false), 600);
  };

  const filteredLogs = auditLogs.filter((l) => (logFilter === "all" ? true : l.type === logFilter));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Quad-Engine Sandbox & System Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor isolated code execution micro-runners, memory limits, and audit logs
          </p>
        </div>

        <Button
          size="sm"
          onClick={handlePing}
          disabled={pinging}
          className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-1.5 shadow-sm"
        >
          <Zap className={`w-3.5 h-3.5 ${pinging ? "animate-spin" : ""}`} />
          <span>Ping Test Runners</span>
        </Button>
      </div>

      {/* 4 Engine Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "JavaScript Engine", engine: "V8 (Node.js 20.x)", latency: "0.14ms", status: "ONLINE", color: "indigo" },
          { name: "Python Runner", engine: "CPython 3.11.x", latency: "0.22ms", status: "ONLINE", color: "emerald" },
          { name: "C++ Compiler", engine: "GCC / G++ 13 (C++20)", latency: "0.08ms", status: "ONLINE", color: "cyan" },
          { name: "Java Virtual Machine", engine: "OpenJDK 21 LTS", latency: "0.35ms", status: "ONLINE", color: "amber" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{item.name}</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {item.status}
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="text-[11px] text-slate-400">{item.engine}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">Benchmark Latency</span>
                <span className="text-emerald-400 font-bold">{item.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hardware & Sandbox Resource Gauges */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Micro-Container Resource Bounds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <span className="text-slate-400">Memory Cgroup Limit</span>
            <div className="text-lg font-black text-white">512 MB</div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="w-[28%] h-full bg-cyan-400 rounded-full" />
            </div>
            <span className="text-[10px] text-slate-500">Allocated per user execution</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <span className="text-slate-400">Execution Timeout</span>
            <div className="text-lg font-black text-white">2,000 ms</div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="w-[15%] h-full bg-emerald-400 rounded-full" />
            </div>
            <span className="text-[10px] text-slate-500">Infinite loop kill threshold</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <span className="text-slate-400">Process Sandboxing</span>
            <div className="text-lg font-black text-emerald-400">Active</div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="w-full h-full bg-emerald-400 rounded-full" />
            </div>
            <span className="text-[10px] text-slate-500">Seccomp & unshare enabled</span>
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Diagnostic & Telemetry Logs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit events recorded by CodeArena administration
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(["all", "system", "question", "contest", "security"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLogFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all uppercase ${
                  logFilter === type
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            const badgeStyle = {
              security: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
              system: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
              question: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
              contest: "bg-amber-500/10 text-amber-300 border-amber-500/20",
            }[log.type] || "bg-slate-500/10 text-slate-300 border-slate-500/20";

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.2 rounded-full font-mono text-[9px] uppercase border font-bold ${badgeStyle}`}>
                    {log.type}
                  </span>
                  <span className="text-slate-200 truncate">{log.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
