"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Award,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CodingExerciseDefinition,
  CodingExecutionResult,
} from "@/server/services/assessment.service";

interface CodingExercisePlayerViewProps {
  lessonId: string;
  lessonTitle: string;
  onExerciseCompleted?: (passed: boolean) => void;
  onProceedNext?: () => void;
}

export function CodingExercisePlayerView({
  lessonId,
  lessonTitle,
  onExerciseCompleted,
  onProceedNext,
}: CodingExercisePlayerViewProps) {
  const [exercise, setExercise] = useState<CodingExerciseDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodingExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"tests" | "console">("tests");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchExercise();
  }, [lessonId]);

  const fetchExercise = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/v1/learning/coding/${lessonId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setExercise(data.data);
        setCode(data.data.starterCode);
      }
    } catch (e) {
      console.error("Failed fetching coding exercise", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleExecute = async () => {
    if (!exercise || running) return;
    setRunning(true);
    setActiveTab("tests");

    try {
      const res = await fetch(`/api/v1/learning/coding/${lessonId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: exercise.language,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        if (data.data.passed && onExerciseCompleted) {
          onExerciseCompleted(true);
        }
      }
    } catch (e) {
      console.error("Failed executing coding exercise", e);
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    if (exercise) {
      setCode(exercise.starterCode);
      setResult(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Loading interactive coding exercise...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-sm font-semibold">Coding exercise not available.</p>
      </div>
    );
  }

  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-950 text-slate-100 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
      {/* 1. Left Column: Problem Instructions */}
      <div className="w-full lg:w-5/12 flex flex-col h-full overflow-y-auto p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
              Interactive Coding Challenge
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {exercise.language} ES2024
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{exercise.title}</h2>
        </div>

        {/* Instructions Body */}
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {exercise.instructions}
        </div>

        {/* Visible Test Case Specifications */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Visible Test Cases
          </h4>
          <div className="space-y-2">
            {exercise.testCases
              .filter((tc) => !tc.isHidden)
              .map((tc, idx) => (
                <div
                  key={tc.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-1.5"
                >
                  <p className="font-semibold text-white">
                    Case {idx + 1}: {tc.description}
                  </p>
                  <div className="font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500">Expected: </span>
                    <span className="text-emerald-400">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 2. Right Column: Code Editor & Execution Console */}
      <div className="w-full lg:w-7/12 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Editor Toolbar */}
        <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>solution.{exercise.language === "javascript" ? "js" : "ts"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white p-1 rounded transition text-xs flex items-center gap-1 cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-white p-1 rounded transition text-xs flex items-center gap-1 cursor-pointer"
              title="Reset to starter boilerplate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Reset</span>
            </button>
          </div>
        </div>

        {/* Code Input Area with Line Numbers */}
        <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
          {/* Line Numbers */}
          <div className="w-10 bg-slate-950/80 select-none py-3 text-right pr-2 text-slate-600 border-r border-slate-800/60 shrink-0 leading-6">
            {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea Code Input */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 h-full bg-slate-950 p-3 text-slate-100 resize-none focus:outline-none leading-6 font-mono text-xs selection:bg-indigo-900/60"
          />
        </div>

        {/* Lower Panel: Test Results & Console Output */}
        <div className="h-56 border-t border-slate-800 bg-slate-900 flex flex-col shrink-0">
          {/* Tab Selector & Controls */}
          <div className="h-9 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("tests")}
                className={`h-full flex items-center gap-1.5 border-b-2 cursor-pointer transition ${
                  activeTab === "tests"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Test Results</span>
                {result && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      result.passed
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-rose-950 text-rose-400"
                    }`}
                  >
                    {result.passedTests}/{result.totalTests}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("console")}
                className={`h-full flex items-center gap-1.5 border-b-2 cursor-pointer transition ${
                  activeTab === "console"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Logs</span>
                {result && result.logs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {result.logs.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={running}
                onClick={handleExecute}
                className="h-7 text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white px-3 flex items-center gap-1.5"
              >
                {running ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Running Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Solution</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
            {activeTab === "tests" && (
              <div className="space-y-2">
                {!result ? (
                  <div className="text-slate-500 text-center py-8">
                    Click <strong>Run Solution</strong> to execute tests in the secure sandbox.
                  </div>
                ) : (
                  <>
                    {/* Status Header */}
                    <div
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        result.passed
                          ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                          : "bg-rose-950/40 border-rose-800/80 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-bold">
                          {result.passed
                            ? "All Test Cases Passed! 🎉"
                            : `${result.passedTests} of ${result.totalTests} tests passed.`}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans">
                        Executed in {result.executionTimeMs}ms
                      </span>
                    </div>

                    {/* Test Cases List */}
                    <div className="space-y-1.5 pt-1">
                      {result.testResults.map((tr, i) => (
                        <div
                          key={tr.id || i}
                          className={`p-2 rounded border flex items-start justify-between gap-2 ${
                            tr.passed
                              ? "bg-slate-950/60 border-slate-800 text-slate-300"
                              : "bg-rose-950/20 border-rose-900/60 text-rose-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {tr.passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                            <span className="font-sans text-[11px] font-medium">
                              {tr.description}
                              {tr.isHidden && (
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 ml-1.5 font-mono">
                                  (Hidden Evaluation)
                                </span>
                              )}
                            </span>
                          </div>

                          {!tr.passed && tr.error && (
                            <span className="text-[10px] text-rose-400 truncate max-w-xs font-mono">
                              {tr.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Next Lecture prompt on pass */}
                    {result.passed && onProceedNext && (
                      <div className="pt-2 flex justify-end">
                        <Button
                          size="sm"
                          onClick={onProceedNext}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                        >
                          <span>Proceed to Next Lecture</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "console" && (
              <div className="space-y-1">
                {!result || result.logs.length === 0 ? (
                  <div className="text-slate-500 text-center py-8">
                    No console logs captured during execution.
                  </div>
                ) : (
                  result.logs.map((log, idx) => (
                    <div key={idx} className="text-slate-300 font-mono text-[11px] leading-5">
                      <span className="text-slate-600 select-none mr-2">&gt;</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
