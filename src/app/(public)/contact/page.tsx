"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Student Admissions",
    detail: "admissions@vti-edu.org",
    sub: "Guidance on courses and learning pathways",
    action: "mailto:admissions@vti-edu.org",
    linkText: "Email Admissions",
  },
  {
    icon: Mail,
    title: "Faculty & Academics",
    detail: "faculty@vti-edu.org",
    sub: "Direct inquiries to faculty deans",
    action: "mailto:faculty@vti-edu.org",
    linkText: "Email Faculty",
  },
  {
    icon: Mail,
    title: "Learning Portal Support",
    detail: "support@vti-edu.org",
    sub: "Account, quiz, and certificate assistance",
    action: "mailto:support@vti-edu.org",
    linkText: "Contact Support",
  },
];

const FAQS = [
  {
    q: "Why are all courses at VTI 100% free?",
    a: "VTI is fully funded by non-profit kingdom endowments and Christian donors. We believe sound theological and biblical education should never be impeded by financial debt.",
  },
  {
    q: "Are the completion certificates accredited and verifiable?",
    a: "Every course completed with passing quiz scores generates an official Certificate of Completion with a unique cryptographic ID and public verification URL at vti-edu.org/verify.",
  },
  {
    q: "Can I study while serving in active church ministry?",
    a: "Yes! All courses are 100% self-paced and asynchronous, allowing pastors, elders, missionaries, and working believers to study on their own schedule.",
  },
  {
    q: "What is VTI's Statement of Faith?",
    a: "VTI affirms historic Christian orthodoxy (Apostles' and Nicene Creeds), the divine inerrancy of Scripture, the Trinity, salvation by grace through faith in Christ alone, and bodily resurrection.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Curriculum & Tracks");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Contact Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFC221]">Contact Us</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            We&apos;re Here to Help You Succeed
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Have questions about course syllabi, academic tracks, pastoral study groups, or credentials? Reach out to our admissions and theological faculty advisory teams.
          </p>
        </div>
      </section>

      {/* 3 Contact Channels Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_CHANNELS.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#EAEBED] p-8 shadow-xs hover:border-[#061D42]/40 hover:shadow-md transition text-center space-y-3 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#061D42]/10 text-[#061D42] flex items-center justify-center group-hover:bg-[#061D42] group-hover:text-[#C08C52] transition duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#161821]">{ch.title}</h3>
                <p className="text-sm font-black text-[#061D42]">{ch.detail}</p>
                <p className="text-xs text-[#8A8C90]">{ch.sub}</p>
                <div className="pt-2">
                  <a
                    href={ch.action}
                    className="inline-block text-xs font-bold text-[#161821] hover:text-[#C08C52] transition"
                  >
                    {ch.linkText} →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Section: Clean Message Form + FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAEBED] p-8 sm:p-12 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C08C52]">
                Direct Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061D42] tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#55585B]">
                Fill in the details below and an academic advisor will reply within 24 hours.
              </p>
            </div>

            {isSuccess && (
              <div className="p-4 rounded-xl bg-[#E8F8EE] border border-[#09BD3C]/30 text-[#09BD3C] text-xs font-bold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Your message has been received. We will be in touch shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#161821]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#061D42] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#161821]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#061D42] focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#161821]">Inquiry Subject / Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#061D42] focus:bg-white focus:outline-none transition"
                >
                  <option value="Course Curriculum & Syllabi">Course Curriculum & Syllabi</option>
                  <option value="Pastoral & Church Cohorts">Pastoral & Church Cohorts</option>
                  <option value="Certificates & Verification">Certificates & Verification Inquiries</option>
                  <option value="Learning Portal & Technical">Learning Portal & Technical Support</option>
                  <option value="Faculty & Academic Advising">Faculty & Academic Advising</option>
                  <option value="Other">Other Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#161821]">Your Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with your learning goals?"
                  className="w-full p-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#061D42] focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs h-11 px-8 rounded-xl shadow-xs gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#C08C52]" />
                  <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                </Button>
              </div>
            </form>
          </div>

          {/* FAQ Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C08C52]">
                Instant Answers
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#061D42] tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-[#55585B]">
                Quick answers to our most common questions about enrollment and certifications.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-[#161821]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8A8C90] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#C08C52]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-[#55585B] leading-relaxed border-t border-[#F8F9FA] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
