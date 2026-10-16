"use client";

import React from "react";
import {
  Trophy,
  Play,
  Square,
  Users,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button, Input, Label } from "@codearena/ui";
import { Contest, ContestProblem } from "@/lib/contests-data";
import { ProblemDefinition } from "@/lib/problems-data";

interface AdminContestsTabProps {
  contestsList: Contest[];
  allQuestions: ProblemDefinition[];
  contestFormData: {
    title: string;
    description: string;
    durationMinutes: number;
    startTimeOption: "now" | "15min" | "1hour" | "custom";
    customStartTime: string;
    selectedProblems: ContestProblem[];
    isRated: boolean;
  };
  setContestFormData: React.Dispatch<React.SetStateAction<any>>;
  editingContestId: string | null;
  contestProblemSearch: string;
  setContestProblemSearch: (s: string) => void;
  contestProblemDiffFilter: string;
  setContestProblemDiffFilter: (d: string) => void;
  contestFeedback: { type: "success" | "error"; message: string } | null;
  onAutoPickContestProblems: () => void;
  onToggleProblemInContest: (prob: ProblemDefinition) => void;
  onUpdateContestProblemPoints: (slug: string, points: number) => void;
  onCreateContest: (forceStartNow?: boolean) => void;
  onEditContest: (c: Contest) => void;
  onCancelEditContest: () => void;
  onStartContestNow: (id: string) => void;
  onEndContestNow: (id: string) => void;
  onDeleteContestItem: (id: string) => void;
  onOpenSubmissionsInspector: (c: Contest) => void;
  onOpenBroadcastModal: () => void;
}

export function AdminContestsTab({
  contestsList,
  allQuestions,
  contestFormData,
  setContestFormData,
  editingContestId,
  contestProblemSearch,
  setContestProblemSearch,
  contestProblemDiffFilter,
  setContestProblemDiffFilter,
  contestFeedback,
  onAutoPickContestProblems,
  onToggleProblemInContest,
  onUpdateContestProblemPoints,
  onCreateContest,
  onEditContest,
  onCancelEditContest,
  onStartContestNow,
  onEndContestNow,
  onDeleteContestItem,
  onOpenSubmissionsInspector,
  onOpenBroadcastModal,
}: AdminContestsTabProps) {
  // Filter questions for the contest problem picker
  const filteredPickerQuestions = allQuestions.filter((q) => {
    if (contestProblemDiffFilter !== "ALL" && q.difficulty !== contestProblemDiffFilter) {
      return false;
    }
    if (contestProblemSearch.trim()) {
      const query = contestProblemSearch.toLowerCase().trim();
      return (
        q.title.toLowerCase().includes(query) ||
        q.slug.toLowerCase().includes(query) ||
        q.topics.some((t) => (typeof t === "string" ? t : t.name).toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Tournament Orchestration & Contests</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Schedule competitive programming tournaments, trigger live clocks, and inspect submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenBroadcastModal}
            className="h-8 text-xs bg-white/[0.03] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <span>📢</span>
            <span>Broadcast Alert</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              const el = document.getElementById("contest-builder-card");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-8 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Contest</span>
          </Button>
        </div>
      </div>

      {/* Feedback Alert */}
      {contestFeedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
            contestFeedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/25 text-rose-300"
          }`}
        >
          {contestFeedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{contestFeedback.message}</span>
        </div>
      )}

      {/* Active Contests Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            All Arenas & Tournaments ({contestsList.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Real-time Clock Synchronized</span>
        </div>

        {contestsList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-2">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No Contests Found</p>
            <p className="text-xs text-slate-400">
              Create a new tournament below to schedule the next challenge.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contestsList.map((contest) => {
              const isLive = contest.status === "LIVE";
              const isUpcoming = contest.status === "UPCOMING";

              return (
                <div
                  key={contest.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                    isLive
                      ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "bg-[#0c101d] border-white/[0.07]"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Title, Status, Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/contests/${contest.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-white hover:text-cyan-400 hover:underline transition-colors flex items-center gap-1.5"
                            title="Open Contest Arena in new tab"
                          >
                            <span>{contest.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">↗</span>
                          </a>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                              isLive
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : isUpcoming
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-white/[0.05] text-slate-400 border border-white/10"
                            }`}
                          >
                            {contest.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {contest.description}
                        </p>
                      </div>

                      {contest.isRated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                          RATED
                        </span>
                      )}
                    </div>

                    {/* Metadata: Duration, Start, Participants */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[10px] text-slate-500 block">Duration</span>
                        <span className="text-slate-200 font-semibold">{contest.durationMinutes}m</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[10px] text-slate-500 block">Enrolled</span>
                        <span className="text-slate-200 font-semibold">
                          {contest.participantsCount || contest.registeredUsers?.length || 0} coders
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-500 block">Start Slot</span>
                        <span className="text-slate-200 font-semibold truncate block">
                          {contest.startTime ? new Date(contest.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Scheduled"}
                        </span>
                      </div>
                    </div>

                    {/* Problems Preview */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Contest Problems ({contest.problems?.length || 0}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {contest.problems?.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg text-[10px] bg-white/[0.04] text-slate-300 border border-white/5 font-mono flex items-center gap-1"
                          >
                            <span className="text-slate-500 font-bold">Q{idx + 1}:</span>
                            <span className="truncate max-w-[120px]">{p.title}</span>
                            <span className="text-amber-400 font-semibold">({p.points}p)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isUpcoming && (
                        <Button
                          size="sm"
                          onClick={() => onStartContestNow(contest.id)}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg gap-1 shadow-sm"
                        >
                          <Play className="w-3 h-3" />
                          <span>Start Now</span>
                        </Button>
                      )}

                      {isLive && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onEndContestNow(contest.id)}
                          className="h-7 text-xs rounded-lg gap-1"
                        >
                          <Square className="w-3 h-3" />
                          <span>End Contest</span>
                        </Button>
                      )}

                      <a
                        href={`/contests/${contest.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg gap-1"
                          title="Open Contest Arena"
                        >
                          <span>👁️</span>
                          <span>Arena</span>
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenSubmissionsInspector(contest)}
                        className="h-7 text-xs bg-white/[0.03] text-slate-300 border-white/10 rounded-lg gap-1"
                      >
                        <Users className="w-3 h-3 text-cyan-400" />
                        <span>Submissions</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditContest(contest)}
                        title="Edit Contest"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteContestItem(contest.id)}
                        title="Delete Contest"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contest Builder Card */}
      <div id="contest-builder-card" className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{editingContestId ? "Edit Tournament" : "Schedule New Tournament"}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select challenge questions, assign points, and designate tournament timing
            </p>
          </div>

          {editingContestId && (
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelEditContest}
              className="h-7 text-xs bg-white/[0.03] text-slate-300 border-white/10 rounded-lg"
            >
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">Contest Title</Label>
            <Input
              value={contestFormData.title}
              onChange={(e) =>
                setContestFormData((prev: any) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. CodeArena Weekly Championship 43"
              className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">Duration (Minutes)</Label>
            <Input
              type="number"
              min={15}
              max={360}
              value={contestFormData.durationMinutes}
              onChange={(e) =>
                setContestFormData((prev: any) => ({
                  ...prev,
                  durationMinutes: Number(e.target.value) || 90,
                }))
              }
              className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Start Time Options */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-300">Start Time Schedule</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "now", label: "Immediate (Live Now)" },
              { id: "15min", label: "In 15 Minutes" },
              { id: "1hour", label: "In 1 Hour" },
              { id: "custom", label: "Custom Date/Time" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setContestFormData((prev: any) => ({
                    ...prev,
                    startTimeOption: opt.id as any,
                  }))
                }
                className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  contestFormData.startTimeOption === opt.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                    : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {contestFormData.startTimeOption === "custom" && (
            <div className="max-w-xs pt-1">
              <Input
                type="datetime-local"
                value={contestFormData.customStartTime}
                onChange={(e) =>
                  setContestFormData((prev: any) => ({
                    ...prev,
                    customStartTime: e.target.value,
                  }))
                }
                className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl font-mono"
              />
            </div>
          )}
        </div>

        {/* Problem Picker for Contest */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-300">
                Select Questions ({(contestFormData.selectedProblems || []).length} Chosen)
              </Label>
              <p className="text-[11px] text-slate-400">
                Pick challenges from the question bank to include in this contest
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAutoPickContestProblems}
              className="h-8 text-xs bg-white/[0.03] text-amber-300 border-amber-500/30 hover:bg-amber-500/10 rounded-xl gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Pick 4 Balanced</span>
            </Button>
          </div>

          {/* Search in picker */}
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <Input
              value={contestProblemSearch}
              onChange={(e) => setContestProblemSearch(e.target.value)}
              placeholder="Search problem bank..."
              className="h-8 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
            />
          </div>

          {/* Selected questions points configuration */}
          {(contestFormData.selectedProblems || []).length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Problem Weights:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(contestFormData.selectedProblems || []).map((prob) => (
                  <div
                    key={prob.problemSlug}
                    className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-medium text-slate-200 truncate">{prob.title}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Input
                        type="number"
                        value={prob.points}
                        onChange={(e) =>
                          onUpdateContestProblemPoints(prob.problemSlug, Number(e.target.value) || 100)
                        }
                        className="w-16 h-7 text-xs font-mono bg-white/[0.05] border-white/10 text-amber-300 rounded text-center"
                      />
                      <span className="text-[10px] text-slate-500">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem Checklist */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-white/[0.05] rounded-xl p-2 bg-black/20">
            {filteredPickerQuestions.slice(0, 30).map((q) => {
              const isSelected = (contestFormData.selectedProblems || []).some(
                (p) => p.problemSlug === q.slug
              );
              return (
                <div
                  key={q.slug}
                  onClick={() => onToggleProblemInContest(q)}
                  className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-500/15 border border-amber-500/30 text-white font-medium"
                      : "bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-slate-500">
                      {isSelected ? "✓" : "○"}
                    </span>
                    <span className="truncate">{q.title}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      q.difficulty === "EASY"
                        ? "text-emerald-400"
                        : q.difficulty === "MEDIUM"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          {editingContestId ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEditContest}
                className="h-9 px-4 text-xs font-medium bg-white/[0.03] text-slate-300 border-white/10 rounded-xl"
              >
                Cancel Edit
              </Button>
              <Button
                type="button"
                onClick={() => onCreateContest(false)}
                className="h-9 px-5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md"
              >
                Update Tournament
              </Button>
              <Button
                type="button"
                onClick={() => onCreateContest(true)}
                className="h-9 px-5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Save & Start Live Now</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onCreateContest(false)}
                className="h-9 px-4 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {contestFormData.startTimeOption === "now"
                    ? "Schedule for Later"
                    : "Schedule Tournament"}
                </span>
              </Button>

              <Button
                type="button"
                onClick={() => onCreateContest(true)}
                className="h-9 px-5 text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Live Contest Now!</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
