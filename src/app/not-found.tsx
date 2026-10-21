import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VtiLogo } from "@/components/ui/vti";

export const metadata = {
  title: "404 - Page Not Found | Virtual Theological Institute (VTI)",
  description: "Sorry, the page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161821] flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <VtiLogo theme="light" size="md" />
          </Link>
        </div>

        {/* Error Graphic */}
        <div className="relative w-72 sm:w-80 h-48 sm:h-56 mx-auto">
          <Image
            src="/assets/img/error/error.png"
            alt="404 Page Not Found"
            fill
            sizes="(max-width: 640px) 288px, 320px"
            priority
            className="object-contain"
          />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#061D42] px-3.5 py-1 rounded-full bg-[#061D42]/10 border border-[#061D42]/20">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#061D42] tracking-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] max-w-md mx-auto leading-relaxed">
            The page you are looking for may have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs gap-2 cursor-pointer">
              <Home className="w-4 h-4 text-[#C08C52]" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              variant="outline"
              className="border-[#EAEBED] bg-white text-[#061D42] hover:bg-[#F3F4F8] font-bold text-xs h-11 px-6 rounded-xl gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C08C52]" />
              <span>Browse Theological Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
