"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Video,
  FileText,
  HelpCircle,
  Download,
  Bookmark,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Share2,
  Menu,
  X,
  Award,
  Code2,
  Star,
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { PlayerContext, PlayerLesson, StudentNoteRecord } from "@/server/services/learning.service";
import { Button } from "@/components/ui/button";
import { QuizPlayerView } from "./QuizPlayerView";
import { CodingExercisePlayerView } from "./CodingExercisePlayerView";
import { PlayerQnATab } from "@/components/community/PlayerQnATab";
import { CourseReviewModal } from "@/components/reviews/CourseReviewModal";

interface CoursePlayerClientProps {
  initialContext: PlayerContext;
}

export function CoursePlayerClient({ initialContext }: CoursePlayerClientProps) {
  const router = useRouter();
  const [context, setContext] = useState<PlayerContext>(initialContext);
  const { course, sections, currentLesson, nextLesson, prevLesson, progress } = context;

  // Video playback states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(currentLesson.lastPositionSec || 0);
  const [duration, setDuration] = useState(currentLesson.durationSec || 0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "qna" | "notes" | "resources">("overview");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [claimingCert, setClaimingCert] = useState(false);

  const handleClaimCertificate = async () => {
    setClaimingCert(true);
    try {
      const res = await fetch("/api/v1/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (data.success && data.data?.certificate) {
        router.push(`/verify/${data.data.certificate.certificateNo}`);
      }
    } catch (e) {
      console.error("Failed claiming certificate", e);
    } finally {
      setClaimingCert(false);
    }
  };

  // Notes state
  const [notes, setNotes] = useState<StudentNoteRecord[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  // Lesson completion state
  const [isCompleted, setIsCompleted] = useState(currentLesson.isCompleted);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const acc: Record<string, boolean> = {};
    sections.forEach((s) => {
      acc[s.id] = s.lessons.some((l) => l.id === currentLesson.id);
    });
    return acc;
  });

  // Resume playback position on initial mount / lesson change
  useEffect(() => {
    setIsCompleted(currentLesson.isCompleted);
    if (videoRef.current && currentLesson.lastPositionSec > 0) {
      videoRef.current.currentTime = currentLesson.lastPositionSec;
      setCurrentTime(currentLesson.lastPositionSec);
    }
    fetchNotes(currentLesson.id);
  }, [currentLesson.id]);

  // Sync playback position periodically (every 5 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        const pos = Math.floor(videoRef.current.currentTime);
        fetch("/api/v1/learning/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: currentLesson.id,
            positionSec: pos,
            markComplete: false,
          }),
        }).catch(() => {});
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentLesson.id]);

  const fetchNotes = async (lessonId: string) => {
    setNotesLoading(true);
    try {
      const res = await fetch(`/api/v1/learning/notes?lessonId=${lessonId}`);
      const data = await res.json();
      if (data.success && data.data?.notes) {
        setNotes(data.data.notes);
      }
    } catch {
      // ignore
    } finally {
      setNotesLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Auto complete when reaching 90%
      if (!isCompleted && duration > 0 && cur / duration >= 0.9) {
        handleToggleComplete(true);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || currentLesson.durationSec);
      if (currentLesson.lastPositionSec > 0) {
        videoRef.current.currentTime = currentLesson.lastPositionSec;
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const next = speeds[nextIdx];
    setPlaybackSpeed(next);
    if (videoRef.current) {
      videoRef.current.playbackRate = next;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const handleToggleComplete = async (forceState?: boolean) => {
    const targetState = forceState !== undefined ? forceState : !isCompleted;
    setIsCompleted(targetState);

    try {
      const res = await fetch("/api/v1/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          positionSec: Math.floor(currentTime),
          markComplete: targetState,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setContext((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            progressPct: data.data.progressPct,
          },
          sections: prev.sections.map((sec) => ({
            ...sec,
            lessons: sec.lessons.map((les) =>
              les.id === currentLesson.id ? { ...les, isCompleted: targetState } : les
            ),
          })),
        }));
      }
    } catch (e) {
      console.error("Failed toggling lesson progress", e);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const snapTime = Math.floor(currentTime);
    try {
      const res = await fetch("/api/v1/learning/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          timestampSec: snapTime,
          content: noteInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setNotes((prev) => [...prev, data.data].sort((a, b) => a.timestampSec - b.timestampSec));
        setNoteInput("");
        setIsCreatingNote(false);
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    await fetch(`/api/v1/learning/notes/${noteId}`, { method: "DELETE" }).catch(() => {});
  };

  const jumpToTimestamp = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      setCurrentTime(sec);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const formatSec = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/learn/${course.slug}/lecture/${lessonId}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/student/learning"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-slate-800 shrink-0 hidden sm:block" />
          <h1 className="font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Your Progress:</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPct}%` }}
              />
            </div>
            <span className="font-bold text-emerald-400">{progress.progressPct}%</span>
          </div>

          {/* Join WhatsApp Study Group Action */}
          <a
            href={`https://chat.whatsapp.com/invite/${course.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold transition"
            title="Join Course WhatsApp Study Group"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Group</span>
          </a>

          {/* Leave a Rating Action */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Leave a Rating</span>
          </button>

          {/* Toggle Sidebar Trigger */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Course Content</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Canvas & Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Player Stage & Bottom Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Main Media Stage */}
          {currentLesson.type === "QUIZ" ? (
            <div className="w-full bg-slate-950 p-4 border-b border-slate-800">
              <QuizPlayerView
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                onQuizCompleted={(score, passed) => {
                  if (passed) {
                    handleToggleComplete(true);
                  }
                }}
                onProceedNext={() => {
                  if (nextLesson) navigateToLesson(nextLesson.id);
                }}
              />
            </div>
          ) : currentLesson.type === "ASSIGNMENT" ? (
            <div className="w-full h-[640px] bg-slate-950 border-b border-slate-800">
              <CodingExercisePlayerView
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                onExerciseCompleted={(passed) => {
                  if (passed) {
                    handleToggleComplete(true);
                  }
                }}
                onProceedNext={() => {
                  if (nextLesson) navigateToLesson(nextLesson.id);
                }}
              />
            </div>
          ) : (
            <div className="relative aspect-video max-h-[65vh] w-full bg-black flex items-center justify-center overflow-hidden shrink-0 group">
              {currentLesson.type === "VIDEO" && currentLesson.mediaUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentLesson.mediaUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    onEnded={() => {
                      setIsPlaying(false);
                      handleToggleComplete(true);
                    }}
                    className="w-full h-full object-contain cursor-pointer"
                    playsInline
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Seek Track */}
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />

                    <div className="flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="hover:text-indigo-400 transition cursor-pointer">
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button onClick={() => handleSkip(-10)} title="Rewind 10s" className="hover:text-indigo-400 transition cursor-pointer">
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button onClick={() => handleSkip(10)} title="Forward 10s" className="hover:text-indigo-400 transition cursor-pointer">
                          <RotateCw className="w-4 h-4" />
                        </button>

                        <button onClick={toggleMute} className="hover:text-indigo-400 transition cursor-pointer">
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="font-mono text-[11px] text-slate-300">
                          {formatSec(currentTime)} / {formatSec(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={cycleSpeed}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold cursor-pointer"
                        >
                          {playbackSpeed}x
                        </button>

                        <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition cursor-pointer">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
                  <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                  <p className="text-xs text-slate-400">
                    Written Technical Guide • Estimated {Math.max(1, Math.round(currentLesson.durationSec / 60))} min read
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Certificate Completion Celebration Banner */}
          {progress.progressPct === 100 && (
            <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-b border-amber-600/40 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>100% Course Completed!</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Congratulations! Your course deposit has been automatically queued for 100% refund, and your official verified Certificate of Completion is ready.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleClaimCertificate}
                disabled={claimingCert}
                size="sm"
                className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shrink-0 shadow-lg cursor-pointer"
              >
                {claimingCert ? "Generating Certificate..." : "Claim Certificate"}
              </Button>
            </div>
          )}

          {/* Player Sub-Bar: Lesson Navigation & Completion Toggle */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={isCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleComplete()}
                className={`text-xs font-semibold gap-1.5 h-9 cursor-pointer ${
                  isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-slate-700 text-slate-300"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? "Completed" : "Mark as Complete"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToLesson(prevLesson.id)}
                  className="text-xs border-slate-700 text-slate-300 hover:text-white h-9"
                >
                  Previous
                </Button>
              )}
              {nextLesson && (
                <Button
                  size="sm"
                  onClick={() => navigateToLesson(nextLesson.id)}
                  className="text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white h-9 flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Tabs: Overview, Notes, Resources */}
          <div className="p-6 max-w-4xl w-full">
            {/* Tab Buttons */}
            <div className="flex items-center gap-6 border-b border-slate-800 text-sm font-semibold mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 border-b-2 transition cursor-pointer ${
                  activeTab === "overview"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("qna")}
                className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "qna"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Q&A Discussions</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "notes"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Notes</span>
                {notes.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {notes.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "resources"
                    ? "border-orange-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Resources</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {currentLesson.resources.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                  {currentLesson.contentBody ||
                    `In this lecture, we explore the core implementation details of ${currentLesson.title}. Review the attached resources or take timestamped notes to retain key learnings.`}
                </div>
              </div>
            )}

            {/* Tab 2: Q&A Discussions */}
            {activeTab === "qna" && (
              <PlayerQnATab courseId={course.id} courseTitle={course.title} />
            )}

            {/* Tab 2: Interactive Notes */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                {/* Note creation input */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      Create note at <span className="text-indigo-400 font-mono">{formatSec(currentTime)}</span>
                    </span>
                  </div>

                  <form onSubmit={handleCreateNote} className="space-y-3">
                    <textarea
                      rows={2}
                      placeholder="Type your lecture notes here... (clicking timestamp later seeks the video)"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!noteInput.trim()}
                        size="sm"
                        className="text-xs font-bold h-8 px-4 bg-orange-600 hover:bg-indigo-700 text-white"
                      >
                        Save Note
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No notes created for this lecture yet.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <button
                            onClick={() => jumpToTimestamp(note.timestampSec)}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-400 hover:underline bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900 cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-indigo-400" />
                            <span>{note.formattedTimestamp}</span>
                          </button>
                          <p className="text-xs text-slate-300 whitespace-pre-line pt-1">{note.content}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Downloadable Resources */}
            {activeTab === "resources" && (
              <div className="space-y-3">
                {currentLesson.resources.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No downloadable resources for this lecture.
                  </p>
                ) : (
                  currentLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-bold text-xs text-white">{res.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {res.fileType} • {(res.fileSize / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>

                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-400 hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Collapsible Curriculum Drawer */}
        {isSidebarOpen && (
          <aside className="w-80 md:w-96 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">Course Content</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
              {sections.map((section, secIdx) => {
                const isExpanded = expandedSections[section.id] ?? false;
                const completedInSec = section.lessons.filter((l) => l.isCompleted).length;

                return (
                  <div key={section.id}>
                    <button
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          [section.id]: !isExpanded,
                        }))
                      }
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-800/60 transition text-left cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-white">
                          Section {secIdx + 1}: {section.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {completedInSec}/{section.lessons.length} • {section.formattedDuration}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-950/60 divide-y divide-slate-800/50">
                        {section.lessons.map((lesson) => {
                          const isActive = lesson.id === currentLesson.id;

                          return (
                            <div
                              key={lesson.id}
                              className={`p-3.5 flex items-start gap-3 transition cursor-pointer ${
                                isActive ? "bg-indigo-950/50 border-l-2 border-orange-500" : "hover:bg-slate-900"
                              }`}
                              onClick={() => navigateToLesson(lesson.id)}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (lesson.id === currentLesson.id) {
                                    handleToggleComplete();
                                  }
                                }}
                                className="mt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                              >
                                {lesson.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs line-clamp-2 ${
                                    isActive ? "font-bold text-white" : "font-medium text-slate-300"
                                  }`}
                                >
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                  {lesson.type === "VIDEO" ? (
                                    <Video className="w-3 h-3" />
                                  ) : lesson.type === "ARTICLE" ? (
                                    <FileText className="w-3 h-3" />
                                  ) : lesson.type === "ASSIGNMENT" ? (
                                    <Code2 className="w-3 h-3 text-indigo-400" />
                                  ) : (
                                    <HelpCircle className="w-3 h-3 text-amber-400" />
                                  )}
                                  <span>{lesson.formattedDuration}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* 3. Student Review Modal */}
      <CourseReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        courseId={course.id}
        courseTitle={course.title}
      />
    </div>
  );
}
