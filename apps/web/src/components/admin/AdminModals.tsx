"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  Send,
  Users,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Filter,
  Flame,
  Award,
} from "lucide-react";
import { Button, Input, Label } from "@codearena/ui";
import { Contest, ContestSubmission } from "@/lib/contests-data";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcastTitle: string;
  setBroadcastTitle: (val: string) => void;
  broadcastMessage: string;
  setBroadcastMessage: (val: string) => void;
  broadcastFeedback: string | null;
  onBroadcast: () => void;
}

export function BroadcastModal({
  isOpen,
  onClose,
  broadcastTitle,
  setBroadcastTitle,
  broadcastMessage,
  setBroadcastMessage,
  broadcastFeedback,
  onBroadcast,
}: BroadcastModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0c101d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden space-y-4">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Broadcast Announcement</h3>
              <p className="text-xs text-slate-400">
                Dispatches a notification to all active students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 space-y-4">
          {broadcastFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{broadcastFeedback}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">Announcement Title</Label>
            <Input
              placeholder="e.g. Weekly Contest starting in 15 minutes"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">Message Content</Label>
            <textarea
              rows={4}
              placeholder="Type your message details here..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs border-white/10 text-slate-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onBroadcast}
            disabled={!broadcastTitle.trim() || !broadcastMessage.trim()}
            className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Broadcast</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CodeViewerModalProps {
  submission: ContestSubmission | null;
  onClose: () => void;
  codeCopied: boolean;
  onCopyCode: () => void;
}

export function CodeViewerModal({
  submission,
  onClose,
  codeCopied,
  onCopyCode,
}: CodeViewerModalProps) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#0c101d] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{submission.problemTitle}</h3>
                <span
                  className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase border ${
                    submission.status === "ACCEPTED"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {submission.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                By {submission.userName} ({submission.userEmail}) •{" "}
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Runtime specs bar */}
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Language:{" "}
              <strong className="text-amber-400 uppercase">
                {submission.language || "javascript"}
              </strong>
            </span>
            <span>
              Runtime:{" "}
              <strong className="text-emerald-400">{submission.runtime || "N/A"}</strong>
            </span>
            <span>
              Memory:{" "}
              <strong className="text-cyan-400">{submission.memory || "N/A"}</strong>
            </span>
          </div>

          <Button
            size="sm"
            onClick={onCopyCode}
            className="h-7 text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/10 rounded-lg gap-1.5"
          >
            {codeCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </Button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/50 font-mono text-xs leading-relaxed">
          {submission.code ? (
            <pre className="text-emerald-300 font-mono whitespace-pre-wrap select-text">
              {submission.code}
            </pre>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono">
              No code recorded for this submission.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Submission ID: {submission.id}</span>
          <Button
            size="sm"
            onClick={onClose}
            className="h-7 text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SubmitWholeContestModalProps {
  contest: Contest | null;
  onClose: () => void;
  submittingContestId: string | null;
  onConfirm: (contestId: string) => void;
}

export function SubmitWholeContestModal({
  contest,
  onClose,
  submittingContestId,
  onConfirm,
}: SubmitWholeContestModalProps) {
  if (!contest) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0c101d] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Finalize & Submit Whole Contest</h3>
            <p className="text-xs text-slate-400 mt-0.5">{contest.title}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1.5 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Grading Finalization Notice</span>
          </div>
          <p className="text-[11px] text-slate-300">
            This will calculate final scores and auto-submit for all enrolled students. Solved problems will lock in points, unattempted problems receive 0 points, and the contest status will transition to <strong>ENDED</strong>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block">Enrolled</span>
            <span className="text-sm font-bold text-white">
              {Math.max(contest.participantsCount, (contest.registeredUsers || []).length)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block">Problems</span>
            <span className="text-sm font-bold text-cyan-400">
              {contest.problems?.length || 0}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block">Status</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">
              {contest.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submittingContestId === contest.id}
            className="h-8 text-xs border-white/10 text-slate-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => onConfirm(contest.id)}
            disabled={submittingContestId === contest.id}
            className="h-8 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm gap-2"
          >
            {submittingContestId === contest.id ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Confirm & Grade All</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SubmissionsInspectorModalProps {
  contest: Contest | null;
  onClose: () => void;
  submissions: ContestSubmission[];
  inspectorViewTab: "roster" | "submissions";
  setInspectorViewTab: (t: "roster" | "submissions") => void;
  submissionFilterStatus: "ALL" | "ACCEPTED" | "WRONG_ANSWER";
  setSubmissionFilterStatus: (s: "ALL" | "ACCEPTED" | "WRONG_ANSWER") => void;
  submissionSearchQuery: string;
  setSubmissionSearchQuery: (q: string) => void;
  onOpenCodeViewer: (sub: ContestSubmission) => void;
  onSubmitWholeContest: (contest: Contest) => void;
  onSubmitSingleStudent: (contestId: string, email: string) => void;
  submittingContestId: string | null;
  submittingStudentEmail: string | null;
}

export function SubmissionsInspectorModal({
  contest,
  onClose,
  submissions,
  inspectorViewTab,
  setInspectorViewTab,
  submissionFilterStatus,
  setSubmissionFilterStatus,
  submissionSearchQuery,
  setSubmissionSearchQuery,
  onOpenCodeViewer,
  onSubmitWholeContest,
  onSubmitSingleStudent,
  submittingContestId,
  submittingStudentEmail,
}: SubmissionsInspectorModalProps) {
  if (!contest) return null;

  // Build enrolled roster
  const enrolledEmails = Array.from(
    new Set([
      ...(contest.registeredUsers || []),
      ...submissions.map((s) => s.userEmail.toLowerCase()),
    ])
  );

  const submittedUsersSet = new Set((contest.submittedUsers || []).map((e) => e.toLowerCase()));
  const totalContestProblems = contest.problems?.length || 0;

  const rosterData = enrolledEmails.map((email) => {
    const userSubs = submissions.filter((s) => s.userEmail.toLowerCase() === email.toLowerCase());
    const solvedSlugs = new Set(
      userSubs.filter((s) => s.status === "ACCEPTED").map((s) => s.problemSlug)
    );
    const score = userSubs
      .filter((s) => s.status === "ACCEPTED")
      .reduce((acc, s) => acc + (s.score || 100), 0);
    const isSubmitted = submittedUsersSet.has(email.toLowerCase()) || contest.status === "ENDED";

    return {
      email,
      name: userSubs[0]?.userName || email.split("@")[0],
      solvedCount: solvedSlugs.size,
      totalSubmissions: userSubs.length,
      score,
      isSubmitted,
    };
  });

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilterStatus !== "ALL" && s.status !== submissionFilterStatus) return false;
    if (submissionSearchQuery.trim()) {
      const q = submissionSearchQuery.toLowerCase().trim();
      return (
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        (s.problemTitle || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c101d] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{contest.title}</h3>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold uppercase ${
                  contest.status === "LIVE"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/[0.05] text-slate-400 border border-white/10"
                }`}
              >
                {contest.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Submissions & Competitor Grading Inspector
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onSubmitWholeContest(contest)}
              disabled={submittingContestId === contest.id}
              className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm"
            >
              Grade Whole Contest
            </Button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setInspectorViewTab("roster")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                inspectorViewTab === "roster"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Student Roster ({rosterData.length})
            </button>
            <button
              onClick={() => setInspectorViewTab("submissions")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                inspectorViewTab === "submissions"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Submissions ({submissions.length})
            </button>
          </div>

          {inspectorViewTab === "submissions" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  value={submissionSearchQuery}
                  onChange={(e) => setSubmissionSearchQuery(e.target.value)}
                  placeholder="Search submissions..."
                  className="pl-8 h-7 text-xs bg-white/[0.03] border-white/10 text-white rounded-lg w-44"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono">
                {(["ALL", "ACCEPTED", "WRONG_ANSWER"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubmissionFilterStatus(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      submissionFilterStatus === st
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {st === "ALL" ? "All" : st === "ACCEPTED" ? "AC" : "WA"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {inspectorViewTab === "roster" ? (
            rosterData.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No students enrolled in this contest yet.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5">Student</th>
                    <th className="px-3 py-2.5">Progress</th>
                    <th className="px-3 py-2.5">Total Points</th>
                    <th className="px-3 py-2.5">Grading Status</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {rosterData.map((st, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{st.email}</div>
                      </td>
                      <td className="px-3 py-2.5 font-mono">
                        {st.solvedCount} / {totalContestProblems} Solved
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-amber-400">
                        {st.score} pts
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            st.isSubmitted
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {st.isSubmitted ? "SUBMITTED" : "IN PROGRESS"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {!st.isSubmitted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSubmitSingleStudent(contest.id, st.email)}
                            disabled={
                              submittingContestId === contest.id &&
                              submittingStudentEmail === st.email
                            }
                            className="h-7 text-xs bg-white/[0.03] text-slate-300 border-white/10 rounded-lg"
                          >
                            Force Grade
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No submissions recorded yet for this contest.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5">Problem</th>
                  <th className="px-3 py-2.5">Student</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Language</th>
                  <th className="px-3 py-2.5">Runtime</th>
                  <th className="px-3 py-2.5 text-right">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5 font-semibold text-white">
                      {sub.problemTitle}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300 font-mono text-[11px]">
                      {sub.userName}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          sub.status === "ACCEPTED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {sub.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] uppercase text-amber-400">
                      {sub.language || "JS"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400">
                      {sub.runtime || "0ms"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenCodeViewer(sub)}
                        className="h-7 text-xs bg-white/[0.03] text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10 rounded-lg gap-1"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
