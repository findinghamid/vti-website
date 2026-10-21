import React from "react";
import { Check } from "lucide-react";

interface LearningOutcomesProps {
  outcomes: string[];
}

export function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section
      aria-labelledby="what-you-will-learn-heading"
      className="bg-[#F8F8FA] dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xs"
    >
      <h2
        id="what-you-will-learn-heading"
        className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading mb-6 tracking-tight"
      >
        What You&apos;ll Master in this Course
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm text-[#57595F] dark:text-slate-300">
        {outcomes.map((outcome, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="rounded-full bg-[#09BD3C]/10 border border-[#09BD3C]/20 p-1 text-[#09BD3C] shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="leading-relaxed font-medium">{outcome}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
