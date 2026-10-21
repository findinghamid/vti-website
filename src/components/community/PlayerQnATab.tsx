"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  ArrowLeft,
  Send,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuestionSummary,
  QuestionDetail,
} from "@/server/services/community.service";

interface PlayerQnATabProps {
  courseId: string;
  courseTitle: string;
}

export function PlayerQnATab({ courseId, courseTitle }: PlayerQnATabProps) {
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "my" | "unanswered">("all");

  // Active expanded thread state
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<QuestionDetail | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);

  // Form states
  const [showAskForm, setShowAskForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const [answerInput, setAnswerInput] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [courseId, filter]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set("search", search.trim());
      if (filter !== "all") q.set("filter", filter);

      const res = await fetch(`/api/v1/courses/${courseId}/questions?${q.toString()}`);
      const data = await res.json();
      if (data.success && data.data?.questions) {
        setQuestions(data.data.questions);
      }
    } catch (e) {
      console.error("Failed fetching questions", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleOpenThread = async (questionId: string) => {
    setActiveQuestionId(questionId);
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/v1/learning/questions/${questionId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setActiveThread(data.data);
      }
    } catch (e) {
      console.error("Failed loading question thread", e);
    } finally {
      setLoadingThread(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setSubmittingQuestion(true);
    try {
      const res = await fetch(`/api/v1/courses/${courseId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          body: newBody.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setNewTitle("");
        setNewBody("");
        setShowAskForm(false);
        fetchQuestions();
        handleOpenThread(data.data.id);
      }
    } catch (e) {
      console.error("Failed creating question", e);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || !activeQuestionId) return;

    setSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/v1/learning/questions/${activeQuestionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: answerInput.trim() }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnswerInput("");
        if (activeThread) {
          setActiveThread({
            ...activeThread,
            isAnswered: true,
            answers: [...activeThread.answers, data.data],
          });
        }
        // Update item in list
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === activeQuestionId
              ? { ...q, answersCount: q.answersCount + 1, isAnswered: true }
              : q
          )
        );
      }
    } catch (e) {
      console.error("Failed posting answer", e);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleToggleResolve = async () => {
    if (!activeQuestionId || !activeThread) return;

    try {
      const res = await fetch(`/api/v1/learning/questions/${activeQuestionId}/resolve`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        const nextState = data.data.isAnswered;
        setActiveThread({ ...activeThread, isAnswered: nextState });
        setQuestions((prev) =>
          prev.map((q) => (q.id === activeQuestionId ? { ...q, isAnswered: nextState } : q))
        );
      }
    } catch (e) {
      console.error("Failed toggling resolve state", e);
    }
  };

  // 1. Thread Detail View
  if (activeQuestionId && activeThread) {
    return (
      <div className="space-y-6 text-slate-100">
        {/* Back navigation & Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={() => {
              setActiveQuestionId(null);
              setActiveThread(null);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Course Questions</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleResolve}
            className={`text-xs h-8 gap-1.5 font-semibold ${
              activeThread.isAnswered
                ? "border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{activeThread.isAnswered ? "Resolved" : "Mark as Resolved"}</span>
          </Button>
        </div>

        {/* Main Question Post */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center text-xs font-bold text-indigo-200">
                {activeThread.userName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{activeThread.userName}</p>
                <p className="text-[10px] text-slate-400">
                  {new Date(activeThread.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {activeThread.isAnswered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-white">{activeThread.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {activeThread.body}
          </p>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Responses ({activeThread.answers.length})
          </h3>

          {activeThread.answers.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              No replies yet. Be the first to reply!
            </div>
          ) : (
            activeThread.answers.map((ans) => (
              <div
                key={ans.id}
                className={`p-4 rounded-xl border transition ${
                  ans.isInstructor
                    ? "bg-indigo-950/30 border-indigo-800/80"
                    : "bg-slate-900/40 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        ans.isInstructor
                          ? "bg-orange-600 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {ans.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{ans.userName}</span>
                        {ans.isInstructor && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-indigo-900 text-indigo-200 px-1.5 py-0.2 rounded border border-indigo-700">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Instructor
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ans.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-9">
                  {ans.body}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Reply Box */}
        <form onSubmit={handlePostAnswer} className="space-y-3 pt-2">
          <textarea
            rows={3}
            placeholder="Write your answer or follow-up question here..."
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submittingAnswer || !answerInput.trim()}
              size="sm"
              className="text-xs font-bold h-8 px-4 bg-orange-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
            >
              {submittingAnswer ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Post Answer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // 2. Questions List View
  return (
    <div className="space-y-6 text-slate-100">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all course discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </form>

        <Button
          size="sm"
          onClick={() => setShowAskForm(!showAskForm)}
          className="text-xs font-bold h-9 bg-orange-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask a Question</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            filter === "all"
              ? "bg-orange-600 text-white"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => setFilter("my")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            filter === "my"
              ? "bg-orange-600 text-white"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          My Questions
        </button>
        <button
          onClick={() => setFilter("unanswered")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
            filter === "unanswered"
              ? "bg-orange-600 text-white"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Unanswered
        </button>
      </div>

      {/* Ask Question Expandable Form */}
      {showAskForm && (
        <form
          onSubmit={handleCreateQuestion}
          className="p-5 rounded-2xl border border-indigo-900/60 bg-slate-900/90 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white">Ask a New Question</h3>
            <button
              type="button"
              onClick={() => setShowAskForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Title or Summary</label>
            <input
              type="text"
              placeholder="e.g. Why does Prisma require connection pooling in serverless?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">
              Details & Context (min 10 chars)
            </label>
            <textarea
              rows={4}
              placeholder="Describe your question, error logs, or code context..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAskForm(false)}
              className="text-xs border-slate-800 hover:bg-slate-800 text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingQuestion || newTitle.length < 5 || newBody.length < 10}
              size="sm"
              className="text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white px-4"
            >
              {submittingQuestion ? "Publishing..." : "Publish Question"}
            </Button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-500">Loading discussions...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-300">No questions found</p>
            <p className="text-[11px] text-slate-500">
              Be the first student to ask a question in this course!
            </p>
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              onClick={() => handleOpenThread(q.id)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{q.title}</h3>
                <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px] font-bold">{q.answersCount}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{q.body}</p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-300">{q.userName}</span>
                  <span>•</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>

                {q.isAnswered ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-medium">Awaiting reply</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
