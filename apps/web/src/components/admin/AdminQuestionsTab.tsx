"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  RotateCcw,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  GripVertical,
  SlidersHorizontal,
  X,
  BookOpen,
} from "lucide-react";
import { Button, Input } from "@codearena/ui";
import { ProblemDefinition } from "@/lib/problems-data";

interface AdminQuestionsTabProps {
  allQuestions: ProblemDefinition[];
  filteredQuestions: ProblemDefinition[];
  customSlugs: Set<string>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (diff: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  orderFeedback: string | null;
  isCustomOrderActive: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDropRow: (e: React.DragEvent, targetIndex: number) => void;
  onDragEnd: () => void;
  onMoveQuestion: (slug: string, direction: "UP" | "DOWN") => void;
  onSortByDifficulty: () => void;
  onResetToDefaultOrder: () => void;
  onEditQuestion: (problem: ProblemDefinition) => void;
  onDeleteQuestion: (slug: string) => void;
  onResetFormAndCreate: () => void;
}

export function AdminQuestionsTab({
  allQuestions,
  filteredQuestions,
  customSlugs,
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  typeFilter,
  setTypeFilter,
  draggedIndex,
  dragOverIndex,
  orderFeedback,
  isCustomOrderActive,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDropRow,
  onDragEnd,
  onMoveQuestion,
  onSortByDifficulty,
  onResetToDefaultOrder,
  onEditQuestion,
  onDeleteQuestion,
  onResetFormAndCreate,
}: AdminQuestionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Top Action & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug, or topic..."
              className="pl-9 pr-8 h-9 text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onSortByDifficulty}
              className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
              title="Sort all questions strictly: Easy → Medium → Hard"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sort by Diff</span>
            </Button>

            {isCustomOrderActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={onResetToDefaultOrder}
                className="h-8 text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
                title="Reset to default sequence"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Order</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={onResetFormAndCreate}
              className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Question</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.05] text-xs">
          {/* Difficulty Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Difficulty:</span>
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  difficultyFilter === diff
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {diff === "ALL" ? "All" : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Type:</span>
            {[
              { id: "ALL", label: "All" },
              { id: "BUILT_IN", label: "Built-in" },
              { id: "CUSTOM", label: `Custom (${customSlugs.size})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === t.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Feedback Alert */}
      {orderFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{orderFeedback}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Order Saved</span>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0c101d] overflow-hidden shadow-xl">
        <div className="p-3.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Problem List</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px]">
              Showing {filteredQuestions.length} of {allQuestions.length} challenges
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            Drag ⠿ to reorder or use ↑ ↓ buttons
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No questions match your filter</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, difficulty, or custom type filters.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setDifficultyFilter("ALL");
                setTypeFilter("ALL");
              }}
              className="h-8 text-xs bg-white/[0.03] border-white/10 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-3 w-10 text-center">#</th>
                  <th className="px-4 py-3">Title & Slug</th>
                  <th className="px-4 py-3 hidden md:table-cell">Topics</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredQuestions.map((q, idx) => {
                  const isCustom = customSlugs.has(q.slug);
                  const isDraggingThis = draggedIndex === idx;
                  const isOverThis = dragOverIndex === idx;

                  const diffBadge = {
                    EASY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    HARD: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  }[q.difficulty] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

                  return (
                    <tr
                      key={q.slug}
                      draggable
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDragOver={(e) => onDragOver(e, idx)}
                      onDragLeave={onDragLeave}
                      onDrop={(e) => onDropRow(e, idx)}
                      onDragEnd={onDragEnd}
                      className={`hover:bg-white/[0.02] transition-colors group ${
                        isDraggingThis ? "opacity-30 bg-indigo-500/10" : ""
                      } ${isOverThis ? "border-t-2 border-indigo-500" : ""}`}
                    >
                      {/* Drag Handle & Index */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing text-slate-500 group-hover:text-slate-300">
                          <GripVertical className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          <span className="font-mono text-[10px] text-slate-500">{idx + 1}</span>
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="px-4 py-3 min-w-[200px]">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {q.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            /{q.slug}
                          </div>
                        </div>
                      </td>

                      {/* Topics */}
                      <td className="px-4 py-3 hidden md:table-cell max-w-[240px]">
                        <div className="flex flex-wrap gap-1">
                          {q.topics?.slice(0, 3).map((t, tIdx) => {
                            const name = typeof t === "string" ? t : t.name;
                            return (
                              <span
                                key={tIdx}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-slate-400 border border-white/5 font-mono"
                              >
                                {name}
                              </span>
                            );
                          })}
                          {(q.topics?.length || 0) > 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-slate-500 border border-white/5 font-mono">
                              +{q.topics!.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${diffBadge}`}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {isCustom ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                            Custom
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-slate-400 border border-white/5 font-mono">
                            Built-in
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Move Up / Down */}
                          <button
                            onClick={() => onMoveQuestion(q.slug, "UP")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onMoveQuestion(q.slug, "DOWN")}
                            disabled={idx === filteredQuestions.length - 1}
                            title="Move Down"
                            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Problem */}
                          <button
                            onClick={() => onEditQuestion(q)}
                            title="Edit Problem"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Preview in IDE */}
                          <Link
                            href={`/problems/${q.slug}`}
                            target="_blank"
                            title="Open in Student IDE"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteQuestion(q.slug)}
                            title="Delete Problem"
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
