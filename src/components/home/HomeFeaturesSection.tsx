import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck, Users, Award, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { SectionHeading, VtiButton } from "@/components/ui/vti";

const FEATURES = [
  {
    id: "feature-1",
    title: "100% Free Tuition",
    description:
      "Endowed Christian education with zero paywalls, zero subscription fees, and lifetime access to all video lectures, syllabi, and study notes.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 45 42"
        fill="none"
        className="stroke-current"
      >
        <path
          d="M43.4115 31.1607V5.30119C43.4115 2.73024 41.3362 0.823442 38.8162 1.03769H38.6892C34.2421 1.42333 27.4868 3.71577 23.7174 6.11533L23.3574 6.351C22.7433 6.73664 21.7268 6.73664 21.1127 6.351L20.5833 6.02963C16.8139 3.6515 10.0798 1.38048 5.63271 1.01626C3.11271 0.802017 1.05859 2.73023 1.05859 5.27977V31.1607C1.05859 33.2175 2.71036 35.1457 4.7433 35.4028L5.35742 35.4885C9.95271 36.1098 17.0468 38.4665 21.1127 40.7161L21.1974 40.759C21.7692 41.0803 22.6798 41.0803 23.2304 40.759C27.2962 38.488 34.4115 36.1098 39.028 35.4885L39.7268 35.4028C41.7598 35.1457 43.4115 33.2175 43.4115 31.1607Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M22.2324 7.05725V39.1942" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.2276 13.485H8.46289" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.8158 19.9128H8.46289" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    badge: "Kingdom Free",
    color: "from-blue-500/10 to-orange-500/10 text-[#FF5B35]",
    iconBg: "bg-[#FF5B35]/10 text-[#FF5B35] group-hover:bg-[#FF5B35] group-hover:text-white",
  },
  {
    id: "feature-2",
    title: "Historic Orthodoxy & Creeds",
    description:
      "Uncompromising submission to the infallible authority of Scripture, rooted in historic ecumenical creeds (Nicene, Apostles') and classic confessions.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    badge: "Confessional",
    color: "from-purple-500/10 to-pink-500/10 text-[#9A34EB]",
    iconBg: "bg-[#9A34EB]/10 text-[#9A34EB] group-hover:bg-[#9A34EB] group-hover:text-white",
  },
  {
    id: "feature-3",
    title: "Scholarly Exegesis & Languages",
    description:
      "Deep exegetical instruction incorporating Biblical Greek and Hebrew grammar, historical-grammatical hermeneutics, and primary church history sources.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
    badge: "Academic Rigor",
    color: "from-amber-500/10 to-orange-500/10 text-[#FFC221]",
    iconBg: "bg-[#FFC221]/15 text-[#FF8A00] group-hover:bg-[#FFC221] group-hover:text-white",
  },
  {
    id: "feature-4",
    title: "Verifiable Theological Credentials",
    description:
      "Receive cryptographically signed, tamper-proof Certificates of Completion upon passing faculty assessments, verifiable by churches and mission boards.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    badge: "Verifiable",
    color: "from-emerald-500/10 to-teal-500/10 text-[#09BD3C]",
    iconBg: "bg-[#09BD3C]/10 text-[#09BD3C] group-hover:bg-[#09BD3C] group-hover:text-white",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#EAEBED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHeading
            subtitle="Why Study With VTI"
            title="Biblically Grounded. Academically Rigorous. 100% Free."
            align="center"
          />
          <p className="mt-3 text-sm sm:text-base text-[#57595F]">
            Designed to equip pastors, missionaries, church leaders, and believers worldwide with sound doctrine without financial barriers.
          </p>
        </div>

        {/* 4 Cards Grid (From index-11.html ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-col justify-between p-8 rounded-3xl bg-[#F8F8FA] border border-[#EAEBED] shadow-xs hover:shadow-xl hover:border-[#FF5B35]/30 hover:bg-white transition-all duration-300 transform hover:-translate-y-2"
            >
              <div>
                {/* Feature Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 mb-6 ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>

                {/* Badge */}
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#FF5B35] mb-2">
                  {feature.badge}
                </span>

                {/* Title */}
                <h4 className="text-lg font-bold text-[#161821] font-heading mb-3 group-hover:text-[#FF5B35] transition duration-200">
                  {feature.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-[#57595F] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Decorative indicator */}
              <div className="mt-6 pt-4 border-t border-[#EAEBED] flex items-center justify-between text-xs font-bold text-[#FF5B35]">
                <span>Explore Workflow</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
