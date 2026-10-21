"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { VtiLogo } from "@/components/ui/vti";
import { LanguageSelector } from "@/components/common/LanguageSelector";

export function PublicFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-white border-t border-[#EAEBED] text-[#57595F] font-sans">
      {/* Main Institutional Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[70px] pb-[55px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Contact CTA */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5">
            <VtiLogo size="lg" />

            <p className="text-xs leading-relaxed text-[#57595F] max-w-sm">
              Virtual Theological Institute (VTI) delivers rigorous theological education,
              accredited academic pathways, and global research programs accessible anywhere.
            </p>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#061D42] hover:bg-[#0A2B5E] text-white text-xs font-bold pl-6 pr-2.5 py-2 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <span>Contact Us</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.71533 1L13 5.28471L8.71533 9.56941"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 5.28467H12.88"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Col 2: About VTI */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4 xl:pl-6">
            <h4 className="font-bold text-sm text-[#061D42] tracking-tight">About VTI</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  About Our Institute
                </Link>
              </li>
              <li>
                <Link
                  href="/about#mission-vision"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Mission, Vision & Objectives
                </Link>
              </li>
              <li>
                <Link
                  href="/statement-of-faith"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium text-[#061D42] font-semibold"
                >
                  Statement of Faith
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Leadership & Ministry Team
                </Link>
              </li>
              <li>
                <Link
                  href="/instructors"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Instructors Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Contact VTI
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Ministry Links */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-[#061D42] tracking-tight">Curriculum & Ministry</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Course Catalogue (All 7 Courses)
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/coming-soon"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-flex items-center gap-1.5 font-bold text-[#C08C52]"
                >
                  <span>Courses Coming Soon</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#C08C52]/15 rounded">
                    Roadmap
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/go-gospel"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-flex items-center gap-1 font-semibold text-[#061D42]"
                >
                  <span>Go Gospel Worship Ministry</span>
                  <span className="text-[9px] font-black uppercase text-[#C08C52] bg-[#C08C52]/15 px-1.5 py-0.2 rounded">
                    Music
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/verify"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#C08C52] transition-colors duration-150 inline-block font-medium"
                >
                  Terms & Student Honor Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Our Newsletter & Mobile Apps (index-6.html) */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-[#161821] tracking-tight">Our Newsletter</h4>

            <div className="space-y-1">
              <span className="text-[11px] text-[#57595F] block font-medium">Direct Admissions & Inquiries</span>
              <a
                href="mailto:admissions@vti-edu.org"
                className="text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition-colors"
              >
                admissions@vti-edu.org
              </a>
            </div>

            <div className="space-y-2">
              <a
                href="mailto:support@vti-edu.org"
                className="inline-flex items-center gap-2 text-xs text-[#57595F] hover:text-[#C08C52] transition-colors font-medium"
              >
                <span className="text-[#C08C52]">
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5C1 2.2 2.6 1 5 1H13C15.4 1 17 2.2 17 5V10.6C17 13.4 15.4 14.6 13 14.6H5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 5.40039L10.496 7.40015C9.672 8.05607 8.32 8.05607 7.496 7.40015L5 5.40039"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 11.4004H5.8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 8.19922H3.4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>support@vti-edu.org</span>
              </a>
            </div>

            {/* Quick newsletter subscription */}
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] text-xs font-bold border border-[#09BD3C]/20">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
                className="relative flex items-center"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-[#EAEBED] bg-white text-xs font-medium text-[#061D42] placeholder:text-[#57595F]/70 shadow-2xs focus:outline-none focus:border-[#061D42]"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-8 h-8 rounded-lg bg-[#061D42] hover:bg-[#0A2B5E] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                  title="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Academic Credential Assurance */}
            <div className="pt-2">
              <Link
                href="/verify"
                className="group flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAEBED] hover:border-[#C08C52]/40 transition duration-200"
              >
                <div className="w-8 h-8 rounded-xl bg-[#09BD3C]/15 text-[#09BD3C] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold text-[#061D42] group-hover:text-[#C08C52] transition leading-tight">
                    Tamper-Proof Certificates
                  </span>
                  <span className="text-[10px] text-[#57595F]">
                    Click to verify student credentials
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-[#1E1E2F]/10 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Icons with Clean Vector SVGs */}
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAEBED] hover:border-[#061D42] hover:bg-[#061D42] hover:text-white flex items-center justify-center text-[#57595F] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAEBED] hover:border-[#061D42] hover:bg-[#061D42] hover:text-white flex items-center justify-center text-[#57595F] transition-all"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAEBED] hover:border-[#061D42] hover:bg-[#061D42] hover:text-white flex items-center justify-center text-[#57595F] transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#EAEBED] hover:border-[#061D42] hover:bg-[#061D42] hover:text-white flex items-center justify-center text-[#57595F] transition-all"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-[#57595F] space-y-1">
              <div>
                © {new Date().getFullYear()}{" "}
                <Link href="/" className="font-bold text-[#161821] hover:text-[#C08C52] transition-colors">
                  Virtual Theological Institute (VTI)
                </Link>
                . All rights reserved.{" "}
                <a
                  href="https://vti-edu.org"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#FF5B35] hover:underline ml-1"
                >
                  vti-edu.org
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 text-[11px] text-[#8A8C90]">
                <Link href="/privacy" className="hover:text-[#C08C52] transition">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-[#C08C52] transition">Academic Honor Code</Link>
                <span>•</span>
                <Link href="/faq" className="hover:text-[#C08C52] transition">FAQ</Link>
              </div>
            </div>

            {/* Global Language Selector */}
            <LanguageSelector variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
