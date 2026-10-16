"use client";

import React from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  UserX,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { Button, Input } from "@codearena/ui";

interface AdminUsersTabProps {
  allUsersList: any[];
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  loadingUsers: boolean;
  userRoleFeedback: string | null;
  onToggleUserRole: (username: string, currentRole: string) => void;
  onToggleBanUser: (username: string, currentStatus?: string) => void;
  onDeleteSingleUser: (username: string) => void;
  onClearAllUsers: () => void;
  onRefreshUsers: () => void;
}

export function AdminUsersTab({
  allUsersList,
  userSearchQuery,
  setUserSearchQuery,
  loadingUsers,
  userRoleFeedback,
  onToggleUserRole,
  onToggleBanUser,
  onDeleteSingleUser,
  onClearAllUsers,
  onRefreshUsers,
}: AdminUsersTabProps) {
  const filteredUsers = allUsersList.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const query = userSearchQuery.toLowerCase().trim();
    return (
      u.username?.toLowerCase().includes(query) ||
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.org?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            placeholder="Search by username, name, email, or org..."
            className="pl-9 h-9 text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefreshUsers}
            disabled={loadingUsers}
            className="h-8 text-xs bg-white/[0.03] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onClearAllUsers}
            className="h-8 text-xs rounded-xl gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Students</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {userRoleFeedback && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{userRoleFeedback}</span>
        </div>
      )}

      {/* User Table */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0c101d] overflow-hidden shadow-xl">
        <div className="p-3.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white">
            User Accounts ({filteredUsers.length} of {allUsersList.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500">Live Access Directory</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No Users Found</p>
            <p className="text-xs text-slate-400">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">User & Handle</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 hidden md:table-cell">Organization</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Solved</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
                  const isBanned = user.status === "BANNED" || user.isBanned;

                  return (
                    <tr key={user.userId || user.username} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Handle */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
                            {(user.name || user.username || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-200 truncate">
                              {user.name || user.username}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 hidden sm:table-cell text-slate-400 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Org */}
                      <td className="px-4 py-3 hidden md:table-cell text-slate-300">
                        {user.org || "CodeArena Academy"}
                      </td>

                      {/* DSA Rating */}
                      <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                        {user.score || 1200}
                      </td>

                      {/* Problems Solved */}
                      <td className="px-4 py-3 hidden lg:table-cell font-mono text-slate-400">
                        {user.problemsSolved || 0}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onToggleUserRole(user.username, user.role)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border transition-colors ${
                            isAdmin
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25"
                              : "bg-white/[0.04] text-slate-400 border-white/5 hover:bg-white/[0.08]"
                          }`}
                          title="Click to toggle between Admin and Student"
                        >
                          {user.role}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            isBanned
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {isBanned ? "BANNED" : "ACTIVE"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onToggleBanUser(user.username, user.status)}
                            title={isBanned ? "Unban User" : "Ban User"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            {isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onDeleteSingleUser(user.username)}
                            title="Delete User"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
