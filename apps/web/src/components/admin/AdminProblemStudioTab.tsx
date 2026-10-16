"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Code2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Settings2,
  HelpCircle,
} from "lucide-react";
import { Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent } from "@codearena/ui";

const AVAILABLE_TOPICS = [
  "Arrays",
  "Strings",
  "Dynamic Programming",
  "Graphs",
  "Binary Search",
  "Linked List",
  "Trees",
  "Stack",
  "Hash Table",
  "Math",
  "Greedy",
  "Two Pointers",
  "Backtracking",
  "Sliding Window",
  "Bit Manipulation",
  "Recursion",
];

interface AdminProblemStudioTabProps {
  editingSlug: string | null;
  formData: {
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    topics: string[];
    customTopicInput: string;
    methodName: string;
    description: string;
    constraintsText: string;
    codeJs: string;
    codePy: string;
    codeCpp: string;
    codeJava: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  testCases: Array<{
    input: string;
    output: string;
    argsStr: string;
    expectedStr: string;
    isPublic: boolean;
  }>;
  setTestCases: React.Dispatch<React.SetStateAction<any>>;
  formFeedback: { type: "success" | "error"; message: string; slug?: string } | null;
  onTitleChange: (val: string) => void;
  onToggleTopic: (topic: string) => void;
  onAddCustomTopic: () => void;
  onSaveQuestion: (e: React.FormEvent) => void;
  onResetForm: () => void;
}

export function AdminProblemStudioTab({
  editingSlug,
  formData,
  setFormData,
  testCases,
  setTestCases,
  formFeedback,
  onTitleChange,
  onToggleTopic,
  onAddCustomTopic,
  onSaveQuestion,
  onResetForm,
}: AdminProblemStudioTabProps) {
  const [activeCodeLang, setActiveCodeLang] = useState<"js" | "py" | "cpp" | "java">("js");

  const handleAddTestCase = () => {
    setTestCases((prev: any) => [
      ...prev,
      {
        input: `Test Case ${prev.length + 1}`,
        output: "null",
        argsStr: "[]",
        expectedStr: "null",
        isPublic: true,
      },
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length <= 1) return;
    setTestCases((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleUpdateTestCase = (index: number, field: string, value: any) => {
    setTestCases((prev: any) =>
      prev.map((tc: any, i: number) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                editingSlug
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              }`}
            >
              {editingSlug ? "Editing Mode" : "Creation Mode"}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {editingSlug ? `/${editingSlug}` : "New Challenge"}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            {editingSlug ? `Edit Challenge: ${formData.title || editingSlug}` : "Problem Authoring Studio"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure challenge metadata, starter templates, and verified test cases
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onResetForm}
            className="h-8 text-xs bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </Button>

          <Button
            type="button"
            onClick={onSaveQuestion}
            className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingSlug ? "Update Challenge" : "Publish Challenge"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {formFeedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            formFeedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/25 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {formFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{formFeedback.message}</span>
          </div>
          {formFeedback.slug && (
            <a
              href={`/problems/${formFeedback.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-emerald-400 hover:underline shrink-0"
            >
              Test in IDE →
            </a>
          )}
        </div>
      )}

      {/* Main Authoring Form */}
      <form onSubmit={onSaveQuestion} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">1. Basic Metadata</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">
                Problem Title <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Valid Parentheses"
                required
                className="h-9 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">
                URL Identifier (Slug)
              </Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, slug: e.target.value }))}
                placeholder="valid-parentheses"
                className="h-9 text-xs font-mono bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Difficulty Tier</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["EASY", "MEDIUM", "HARD"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, difficulty: diff }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.difficulty === diff
                        ? diff === "EASY"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : diff === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/[0.05]"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">
                Solution Method Identifier
              </Label>
              <Input
                value={formData.methodName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, methodName: e.target.value }))}
                placeholder="e.g. isValid"
                className="h-9 text-xs font-mono bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Topics Multi-Select */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Category Topics</span>
              <span className="text-[11px] text-slate-500 font-normal">Select all that apply</span>
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TOPICS.map((topic) => {
                const isSelected = formData.topics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onToggleTopic(topic)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      isSelected
                        ? "bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 font-semibold"
                        : "bg-white/[0.03] text-slate-400 border border-white/5 hover:text-white"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Custom Topic Input */}
            <div className="flex items-center gap-2 max-w-sm pt-1">
              <Input
                value={formData.customTopicInput}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, customTopicInput: e.target.value }))
                }
                placeholder="Add custom topic..."
                className="h-8 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAddCustomTopic}
                className="h-8 text-xs bg-white/[0.03] border-white/10 text-slate-300 rounded-xl"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Section 2: Problem Statement & Constraints */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Tag className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">2. Problem Statement & Constraints</h3>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">Description (Markdown)</Label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a clear, detailed algorithmic explanation and requirements..."
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-300">
              Algorithmic Constraints (One per line)
            </Label>
            <textarea
              rows={3}
              value={formData.constraintsText}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, constraintsText: e.target.value }))
              }
              placeholder="1 <= nums.length <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Section 3: Multi-Language Starter Code */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">3. Multi-Language Starter Templates</h3>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
              {[
                { id: "js", label: "JavaScript (V8)" },
                { id: "py", label: "Python 3" },
                { id: "cpp", label: "C++ (g++)" },
                { id: "java", label: "Java 21" },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setActiveCodeLang(lang.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeCodeLang === lang.id
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeCodeLang === "js" && (
              <textarea
                rows={7}
                value={formData.codeJs}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, codeJs: e.target.value }))}
                className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            )}
            {activeCodeLang === "py" && (
              <textarea
                rows={7}
                value={formData.codePy}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, codePy: e.target.value }))}
                className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            )}
            {activeCodeLang === "cpp" && (
              <textarea
                rows={7}
                value={formData.codeCpp}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, codeCpp: e.target.value }))}
                className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            )}
            {activeCodeLang === "java" && (
              <textarea
                rows={7}
                value={formData.codeJava}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, codeJava: e.target.value }))}
                className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Section 4: Public & Hidden Test Cases */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">4. Test Cases Verification Suite</h3>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTestCase}
              className="h-8 text-xs bg-white/[0.03] border-white/10 text-slate-300 rounded-xl gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Test Case</span>
            </Button>
          </div>

          <div className="space-y-3">
            {testCases.map((tc, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      Test Case #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateTestCase(index, "isPublic", !tc.isPublic)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border transition-colors ${
                        tc.isPublic
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {tc.isPublic ? "PUBLIC (VISIBLE)" : "HIDDEN (GRADING)"}
                    </button>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(index)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-400">
                      Arguments Array (JSON format)
                    </Label>
                    <Input
                      value={tc.argsStr}
                      onChange={(e) => handleUpdateTestCase(index, "argsStr", e.target.value)}
                      placeholder='e.g. [[2, 7, 11, 15], 9]'
                      className="h-8 text-xs font-mono bg-black/40 border-white/10 text-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-400">
                      Expected Return Value (JSON format)
                    </Label>
                    <Input
                      value={tc.expectedStr}
                      onChange={(e) => handleUpdateTestCase(index, "expectedStr", e.target.value)}
                      placeholder="e.g. [0, 1] or true"
                      className="h-8 text-xs font-mono bg-black/40 border-white/10 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-400">
                      Input Display Description
                    </Label>
                    <Input
                      value={tc.input}
                      onChange={(e) => handleUpdateTestCase(index, "input", e.target.value)}
                      placeholder="e.g. nums = [2,7,11,15], target = 9"
                      className="h-8 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-slate-400">
                      Output Display Description
                    </Label>
                    <Input
                      value={tc.output}
                      onChange={(e) => handleUpdateTestCase(index, "output", e.target.value)}
                      placeholder="e.g. [0, 1]"
                      className="h-8 text-xs bg-white/[0.03] border-white/10 text-white rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onResetForm}
            className="h-10 text-xs bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl"
          >
            Cancel & Reset
          </Button>

          <Button
            type="submit"
            className="h-10 px-6 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{editingSlug ? "Save Changes" : "Publish Challenge"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
