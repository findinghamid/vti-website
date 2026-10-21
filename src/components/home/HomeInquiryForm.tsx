"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Shield, Users, Sparkles } from "lucide-react";

export function HomeInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    track: "Systematic & Historical Theology",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-transparent via-[#F6F5EF]/60 to-[#F6F5EF]">
      {/* Subtle modern geometric background glow (Clean, professional, zero cartoon shapes) */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#C08C52]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#061D42]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#061D42]/10 text-[#061D42] border border-[#061D42]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>Academic & Ministry Advisory</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading text-[#061D42] leading-tight">
              Equipping Leaders <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C08C52] to-[#E5B574]">
                For Kingdom Ministry.
              </span>
            </h2>

            <div className="w-16 h-1 bg-[#C08C52] rounded-full" />

            <p className="text-base text-[#57595F] leading-relaxed max-w-md">
              Submit your details below and a faculty advisor will assist you with
              course pathways, academic schedules, ordination prep, or missionary training.
            </p>

            {/* Platform Credibility Chips */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#161821] bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#EAEBED] shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#061D42]/10 border border-[#061D42]/20 flex items-center justify-center text-[#061D42] shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#C08C52]" />
                </div>
                <span className="font-medium text-xs sm:text-sm">Confessionally orthodox curriculum taught by scholarly faculty</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#161821] bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#EAEBED] shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#061D42]/10 border border-[#061D42]/20 flex items-center justify-center text-[#061D42] shrink-0">
                  <Users className="w-4 h-4 text-[#C08C52]" />
                </div>
                <span className="font-medium text-xs sm:text-sm">100% Free Tuition endowed for believers and pastors worldwide</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#161821] bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#EAEBED] shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#061D42]/10 border border-[#061D42]/20 flex items-center justify-center text-[#061D42] shrink-0">
                  <Shield className="w-4 h-4 text-[#C08C52]" />
                </div>
                <span className="font-medium text-xs sm:text-sm">Verifiable digital Certificates of Completion upon course mastery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Enterprise Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#F6F5EF] border-[10px] sm:border-[16px] border-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-slate-300/40 relative">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#061D42]/10 border border-[#061D42]/30 text-[#061D42] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#C08C52]" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-[#061D42]">Inquiry Received!</h3>
                  <p className="text-[#57595F] text-sm max-w-md mx-auto">
                    Thank you, <span className="text-[#061D42] font-semibold">{formData.name}</span>.
                    An educational architect will contact you within 24 business hours at{" "}
                    <span className="text-[#061D42] font-semibold">{formData.email}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#061D42] hover:bg-[#0A2B5E] text-white transition duration-200 cursor-pointer shadow-md shadow-[#061D42]/20"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-12 px-4 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] placeholder:text-[#57595F]/70 text-sm focus:outline-none focus:border-[#061D42] focus:ring-2 focus:ring-[#061D42]/10 shadow-xs transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                        Work / Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-12 px-4 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] placeholder:text-[#57595F]/70 text-sm focus:outline-none focus:border-[#061D42] focus:ring-2 focus:ring-[#061D42]/10 shadow-xs transition duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-12 px-4 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] placeholder:text-[#57595F]/70 text-sm focus:outline-none focus:border-[#061D42] focus:ring-2 focus:ring-[#061D42]/10 shadow-xs transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                        Theological Field of Interest
                      </label>
                      <select
                        value={formData.track}
                        onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                        className="w-full h-12 px-4 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#061D42] focus:ring-2 focus:ring-[#061D42]/10 shadow-xs transition duration-200 cursor-pointer"
                      >
                        <option value="Systematic & Historical Theology">Systematic & Historical Theology</option>
                        <option value="Biblical Hermeneutics & Exegesis">Biblical Hermeneutics & Exegesis</option>
                        <option value="Biblical Languages (Greek & Hebrew)">Biblical Languages (Greek & Hebrew)</option>
                        <option value="Pastoral Ministry & Preaching">Pastoral Ministry & Preaching</option>
                        <option value="Christian Apologetics & Ethics">Christian Apologetics & Ethics</option>
                        <option value="Missions & Evangelism">Missions & Evangelism</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                      Your Ministry Background or Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your ministry context, study goals, or questions regarding our theological courses..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] placeholder:text-[#57595F]/70 text-sm focus:outline-none focus:border-[#061D42] focus:ring-2 focus:ring-[#061D42]/10 shadow-xs transition duration-200 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-13 rounded-2xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#061D42]/25 hover:shadow-[#061D42]/35 disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <span>Submitting Information...</span>
                      ) : (
                        <>
                          <span>Submit My Information</span>
                          <Send className="w-4 h-4 text-[#C08C52]" />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-xs text-[#57595F]">
                      We respect your privacy. No spam. You will only receive relevant educational guidance.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
