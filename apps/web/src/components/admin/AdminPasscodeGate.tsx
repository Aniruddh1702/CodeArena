"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Terminal } from "lucide-react";
import { Button, Input, Label } from "@codearena/ui";

interface AdminPasscodeGateProps {
  passcode: string;
  setPasscode: (value: string) => void;
  passcodeError: string;
  verifying: boolean;
  onVerify: (e?: React.FormEvent) => void;
}

export function AdminPasscodeGate({
  passcode,
  setPasscode,
  passcodeError,
  verifying,
  onVerify,
}: AdminPasscodeGateProps) {
  const [showPasscode, setShowPasscode] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Subtle atmospheric gradient orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand identity badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <div className="w-full h-full bg-[#0b0f1a] rounded-[14px] flex items-center justify-center text-white">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Code<span className="text-indigo-400">Arena</span> Console
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Authorized administrative access gateway. Enter your master operator passcode to continue.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c101d]/90 backdrop-blur-xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>operator_auth_v2.0</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-medium">
              Protected
            </span>
          </div>

          <form onSubmit={onVerify} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="admin-passcode"
                className="text-xs font-medium text-slate-300 flex items-center justify-between"
              >
                <span>Operator Passcode</span>
                <span className="text-[10px] text-slate-500 font-mono">CONFIDENTIAL</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="admin-passcode"
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter administrator passcode"
                  required
                  autoFocus
                  disabled={verifying}
                  className="pl-9 pr-10 h-11 text-sm bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={verifying || !passcode.trim()}
              className="w-full h-11 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 text-white shadow-lg shadow-indigo-500/25 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Unlock Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Identity: Unauthenticated</span>
            <span className="text-slate-400">CodeArena Security Core</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          CodeArena Developer Operations • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
