"use client";

import React from "react";
import {
  Shield,
  Key,
  Clock,
  Palette,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";
import { Button, Input, Label } from "@codearena/ui";

interface AdminVaultTabProps {
  adminProfile: {
    name: string;
    email: string;
    title: string;
    avatar: string;
    bio: string;
    securityLevel: string;
    themeColor: "purple" | "cyan" | "emerald" | "amber" | "rose" | "indigo";
    sessionTimeout: string;
  };
  setAdminProfile: React.Dispatch<React.SetStateAction<any>>;
  profileSuccessMsg: string | null;
  newPasscodeVal: string;
  setNewPasscodeVal: (val: string) => void;
  confirmPasscodeVal: string;
  setConfirmPasscodeVal: (val: string) => void;
  passcodeUpdateMsg: { type: "success" | "error"; text: string } | null;
  onSaveAdminProfile: (e: React.FormEvent) => void;
  onChangePasscode: (e: React.FormEvent) => void;
}

export function AdminVaultTab({
  adminProfile,
  setAdminProfile,
  profileSuccessMsg,
  newPasscodeVal,
  setNewPasscodeVal,
  confirmPasscodeVal,
  setConfirmPasscodeVal,
  passcodeUpdateMsg,
  onSaveAdminProfile,
  onChangePasscode,
}: AdminVaultTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Root Operator Vault & Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure master administrator credentials, session governance, and visual preferences
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
          ADMINISTRATOR ACCESS
        </span>
      </div>

      {/* Profile Success Alert */}
      {profileSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {/* Grid: Profile Details & Passcode Rotation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Operator Profile Information */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Operator Profile</h3>
          </div>

          <form onSubmit={onSaveAdminProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Operator Name</Label>
                <Input
                  value={adminProfile.name}
                  onChange={(e) =>
                    setAdminProfile((prev: any) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Operator Email</Label>
                <Input
                  value={adminProfile.email}
                  onChange={(e) =>
                    setAdminProfile((prev: any) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-9 text-xs font-mono bg-white/[0.03] border-white/10 text-white rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Official Title</Label>
              <Input
                value={adminProfile.title}
                onChange={(e) =>
                  setAdminProfile((prev: any) => ({ ...prev, title: e.target.value }))
                }
                className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Bio & Responsibilities</Label>
              <textarea
                rows={3}
                value={adminProfile.bio}
                onChange={(e) =>
                  setAdminProfile((prev: any) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="h-9 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Form 2: Master Passcode Rotation */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Rotate Master Passcode</h3>
            </div>

            {passcodeUpdateMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
                  passcodeUpdateMsg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                    : "bg-rose-500/10 border border-rose-500/25 text-rose-300"
                }`}
              >
                {passcodeUpdateMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{passcodeUpdateMsg.text}</span>
              </div>
            )}

            <form onSubmit={onChangePasscode} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">New Passcode</Label>
                <Input
                  type="password"
                  value={newPasscodeVal}
                  onChange={(e) => setNewPasscodeVal(e.target.value)}
                  placeholder="Min 6 characters"
                  className="h-9 text-xs font-mono bg-white/[0.03] border-white/10 text-white rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Confirm Passcode</Label>
                <Input
                  type="password"
                  value={confirmPasscodeVal}
                  onChange={(e) => setConfirmPasscodeVal(e.target.value)}
                  placeholder="Re-enter new passcode"
                  className="h-9 text-xs font-mono bg-white/[0.03] border-white/10 text-white rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className="h-9 px-5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-sm gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Passcode</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Session Auto-Lock Settings */}
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <Label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Inactivity Session Lock</span>
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "15 Min", val: "15m" },
                { label: "1 Hour", val: "1h" },
                { label: "8 Hours", val: "8h" },
                { label: "Never", val: "never" },
              ].map((t) => (
                <button
                  key={t.val}
                  type="button"
                  onClick={() => {
                    const updated = { ...adminProfile, sessionTimeout: t.val };
                    setAdminProfile(updated);
                    localStorage.setItem("codearena_admin_profile", JSON.stringify(updated));
                  }}
                  className={`p-2 rounded-xl text-xs font-mono border text-center transition-all ${
                    adminProfile.sessionTimeout === t.val
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                      : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Accent Presets */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Visual Accent Color</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { id: "indigo", name: "Cobalt Indigo", color: "#6366f1" },
            { id: "cyan", name: "Electric Cyan", color: "#06b6d4" },
            { id: "emerald", name: "Matrix Emerald", color: "#10b981" },
            { id: "amber", name: "Solar Amber", color: "#f59e0b" },
            { id: "rose", name: "Crimson Rose", color: "#f43f5e" },
            { id: "purple", name: "Nexus Violet", color: "#a855f7" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                const updated = { ...adminProfile, themeColor: t.id as any };
                setAdminProfile(updated);
                localStorage.setItem("codearena_admin_profile", JSON.stringify(updated));
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                adminProfile.themeColor === t.id
                  ? "border-indigo-500 bg-indigo-500/15 font-bold text-white"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-xs truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
