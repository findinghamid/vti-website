"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  History,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ClientQuiz,
  ClientQuizQuestion,
  QuizAttemptResult,
} from "@/server/services/assessment.service";

interface QuizPlayerViewProps {
  lessonId: string;
  lessonTitle: string;
  onQuizCompleted?: (scorePct: number, passed: boolean) => void;
  onProceedNext?: () => void;
}

export function QuizPlayerView({
  lessonId,
  lessonTitle,
  onQuizCompleted,
  onProceedNext,
}: QuizPlayerViewProps) {
  const [quiz, setQuiz] = useState<ClientQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<QuizAttemptResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [lessonId]);

  const fetchQuiz = async () => {
    setLoading(true);
    setResult(null);
    setIsReviewMode(false);
    setSelectedAnswers({});
    setCurrentIdx(0);

    try {
      const res = await fetch(`/api/v1/learning/quizzes/${lessonId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setQuiz(data.data);
      }
    } catch (e) {
      console.error("Failed fetching quiz", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const res = await fetch(`/api/v1/learning/quizzes/${lessonId}/attempts`);
      const data = await res.json();
      if (data.success && data.data?.attempts) {
        setPastAttempts(data.data.attempts);
      }
    } catch {
      // ignore
    }
  };

  const handleSelectOption = (question: ClientQuizQuestion, optionId: string) => {
    if (result) return; // Locked after submitting

    setSelectedAnswers((prev) => {
      const current = prev[question.id] || [];

      if (question.type === "MULTIPLE_CHOICE") {
        if (current.includes(optionId)) {
          return { ...prev, [question.id]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [question.id]: [...current, optionId] };
        }
      } else {
        // Single choice or True/False
        return { ...prev, [question.id]: [optionId] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);

    const submissions = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: selectedAnswers[q.id] || [],
    }));

    try {
      const res = await fetch(`/api/v1/learning/quizzes/${lessonId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: submissions }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        setIsReviewMode(true);
        fetchAttempts();
        if (onQuizCompleted) {
          onQuizCompleted(data.data.scorePct, data.data.passed);
        }
      }
    } catch (e) {
      console.error("Failed submitting quiz attempt", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setIsReviewMode(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Loading quiz assessment...</p>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-sm font-semibold">No questions configured for this quiz.</p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[k]?.length > 0
  ).length;
  const progressPct = Math.round(((currentIdx + 1) / quiz.questions.length) * 100);

  // 1. Result View (Score Summary & Review Mode)
  if (result && isReviewMode) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6 text-slate-100">
        {/* Pass/Fail Banner */}
        <div
          className={`rounded-2xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6 ${
            result.passed
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
              : "bg-amber-950/40 border-amber-800/80 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                result.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {result.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">{result.scorePct}%</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    result.passed ? "bg-emerald-500/30 text-emerald-300" : "bg-amber-500/30 text-amber-300"
                  }`}
                >
                  {result.passed ? "Passed" : "Needs Review"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {result.passed
                  ? `Outstanding! You answered ${result.correctCount} of ${result.totalQuestions} questions correctly. Passing score: ${result.passScorePct}%. This lecture is completed!`
                  : `You answered ${result.correctCount} of ${result.totalQuestions} questions correctly. Passing threshold is ${result.passScorePct}%. Review the feedback below and retake the quiz.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetake}
              className="text-xs font-bold border-slate-700 hover:bg-slate-800 text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </Button>
            {result.passed && onProceedNext && (
              <Button
                size="sm"
                onClick={onProceedNext}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <span>Next Lecture</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Review Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Question Feedback & Explanations</span>
            </h3>
            <span className="text-xs text-slate-400">
              {result.correctCount} / {result.totalQuestions} Correct
            </span>
          </div>

          {result.feedback.map((fb, idx) => (
            <div
              key={fb.questionId}
              className={`p-5 rounded-2xl border transition ${
                fb.isCorrect
                  ? "bg-slate-900/80 border-slate-800"
                  : "bg-rose-950/20 border-rose-900/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">Q{idx + 1}.</span>
                  <p className="text-sm font-semibold text-white leading-relaxed">{fb.prompt}</p>
                </div>
                {fb.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900 shrink-0">
                    <XCircle className="w-3 h-3" />
                    Incorrect
                  </span>
                )}
              </div>

              {/* Options Breakdown */}
              <div className="space-y-2 mt-4">
                {quiz.questions[idx]?.options.map((opt) => {
                  const isUserSelected = fb.selectedOptionIds.includes(opt.id);
                  const isAnswerCorrect = fb.correctOptionIds.includes(opt.id);

                  let borderClass = "border-slate-800 bg-slate-950/40 text-slate-400";
                  if (isAnswerCorrect) {
                    borderClass = "border-emerald-700 bg-emerald-950/40 text-emerald-200 font-medium";
                  } else if (isUserSelected && !isAnswerCorrect) {
                    borderClass = "border-rose-700 bg-rose-950/40 text-rose-200 font-medium";
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${borderClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            isAnswerCorrect
                              ? "bg-emerald-500 border-emerald-400 text-white"
                              : isUserSelected
                              ? "bg-rose-500 border-rose-400 text-white"
                              : "border-slate-700"
                          }`}
                        >
                          {isAnswerCorrect ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : isUserSelected ? (
                            <span className="text-[9px] font-bold">×</span>
                          ) : null}
                        </div>
                        <span>{opt.text}</span>
                      </div>
                      {isUserSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-2 shrink-0">
                          (Your Choice)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Technical Explanation */}
              {fb.explanation && (
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <span className="font-bold text-indigo-400 block mb-1">Architectural Rationale:</span>
                  <p className="leading-relaxed">{fb.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Active Quiz Taking View
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Knowledge Check Quiz
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white truncate">{lessonTitle}</h2>
        </div>

        <div className="flex items-center gap-3">
          {pastAttempts.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="View attempt history"
            >
              <History className="w-3.5 h-3.5" />
              <span>{pastAttempts.length} Past Attempts</span>
            </button>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            Pass: {quiz.passScorePct}%
          </span>
        </div>
      </div>

      {/* History Drawer if toggled */}
      {showHistory && pastAttempts.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-300 pb-2 border-b border-slate-800">
            <span>Past Attempt History</span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-slate-500 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="divide-y divide-slate-800 max-h-40 overflow-y-auto">
            {pastAttempts.map((att, i) => (
              <div key={att.id || i} className="py-2 flex items-center justify-between">
                <span className="text-slate-400">{new Date(att.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{att.scorePct}%</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      att.passed ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                    }`}
                  >
                    {att.passed ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress & Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Question <strong className="text-white">{currentIdx + 1}</strong> of {quiz.questions.length}
          </span>
          <span>
            {answeredCount} of {quiz.questions.length} Answered
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
        <div>
          <div className="inline-block mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
              {currentQ.type === "MULTIPLE_CHOICE"
                ? "Multiple Select (Choose all that apply)"
                : currentQ.type === "TRUE_FALSE"
                ? "True or False"
                : "Single Choice"}
            </span>
          </div>
          <h3 className="text-base font-bold text-white leading-relaxed">{currentQ.prompt}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = (selectedAnswers[currentQ.id] || []).includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(currentQ, opt.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-950/60 border-orange-500 text-white"
                    : "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${
                      currentQ.type === "MULTIPLE_CHOICE" ? "rounded-md" : "rounded-full"
                    } ${
                      isSelected
                        ? "bg-orange-600 border-orange-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          className="text-xs border-slate-800 hover:bg-slate-900 text-slate-300 h-9 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-2">
          {currentIdx < quiz.questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIdx((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
              className="text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white h-9 flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={submitting || answeredCount === 0}
              onClick={handleSubmit}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Quiz</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
