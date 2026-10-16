"use client";

import React from "react";
import {
  FileUp,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Layers,
  Code2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@codearena/ui";
import { ProblemDefinition } from "@/lib/problems-data";

interface AdminImportTabProps {
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  importJsonText: string;
  setImportJsonText: (text: string) => void;
  parsedImportItems: ProblemDefinition[];
  importFeedback: { type: "success" | "error"; message: string } | null;
  loadedFileInfo: { name: string; size: string; format: string; valid: boolean } | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParseJson: (text: string) => void;
  onExecuteImport: () => void;
  onRemoveParsedItem: (idx: number) => void;
  onClearImportedFile: () => void;
  onDownloadTemplate: () => void;
}

export function AdminImportTab({
  isDragging,
  setIsDragging,
  importJsonText,
  setImportJsonText,
  parsedImportItems,
  importFeedback,
  loadedFileInfo,
  fileInputRef,
  onDrop,
  onFileInput,
  onParseJson,
  onExecuteImport,
  onRemoveParsedItem,
  onClearImportedFile,
  onDownloadTemplate,
}: AdminImportTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileUp className="w-5 h-5 text-cyan-400" />
            <span>Batch Problem Import & Ingestion</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage, validate, and bulk-publish algorithmic challenges from JSON, PDF, or Markdown files
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadTemplate}
          className="h-8 text-xs bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 rounded-xl gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download Template (.json)</span>
        </Button>
      </div>

      {/* Feedback Alert */}
      {importFeedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
            importFeedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/25 text-rose-300"
          }`}
        >
          {importFeedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{importFeedback.message}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-white/10 bg-[#0c101d] hover:border-white/20 hover:bg-[#0f1424]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.pdf,.txt,.md"
          onChange={onFileInput}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Drag and drop your problem document here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <span className="text-cyan-400 font-mono">.JSON</span>,{" "}
              <span className="text-cyan-400 font-mono">.PDF</span>, or{" "}
              <span className="text-cyan-400 font-mono">.MD</span> problem sheets (Max 10MB)
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-white/[0.04] border-white/10 text-slate-300 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Local File
          </Button>
        </div>
      </div>

      {/* Loaded File Info Badge */}
      {loadedFileInfo && (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">{loadedFileInfo.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">{loadedFileInfo.size}</span>
            <span className="text-slate-500">•</span>
            <span className="px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
              {loadedFileInfo.format}
            </span>
          </div>
          <button
            onClick={onClearImportedFile}
            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
            title="Clear File"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Raw JSON Code Textarea */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Direct JSON Editor / Parser
            </h3>
          </div>
          <Button
            size="sm"
            onClick={() => onParseJson(importJsonText)}
            disabled={!importJsonText.trim()}
            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm"
          >
            Verify & Parse Syntax
          </Button>
        </div>

        <textarea
          rows={6}
          value={importJsonText}
          onChange={(e) => setImportJsonText(e.target.value)}
          placeholder="Paste LeetCode or CodeArena formatted JSON array here..."
          className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Staged Problems Review List */}
      {parsedImportItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.07] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Staged Problems Queue ({parsedImportItems.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review problems before publishing directly to the live database
              </p>
            </div>

            <Button
              size="sm"
              onClick={onExecuteImport}
              className="h-9 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import & Publish All ({parsedImportItems.length})</span>
            </Button>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {parsedImportItems.map((item, idx) => {
              const diffBadge = {
                EASY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                HARD: "bg-rose-500/10 text-rose-400 border-rose-500/20",
              }[item.difficulty] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{item.title}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase border ${diffBadge}`}>
                        {item.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>/{item.slug}</span>
                      <span>•</span>
                      <span>
                        {item.publicTestCases?.length || 0} public / {item.hiddenTestCases?.length || 0} hidden tests
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveParsedItem(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove from Queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
