import React from "react";
import Image from "next/image";
import { Star, Quote, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/vti";

const TESTIMONIALS = [
  {
    id: "test-1",
    name: "Rev. Thomas Cranmer",
    role: "Senior Pastor @ Grace Fellowship",
    avatar: "/assets/img/avatars/scholar-dr-junaid.jpg",
    headline: "Unmatched Theological Precision!",
    content:
      "The Systematic Theology modules provided our elder board with remarkable clarity and doctrinal grounding. The fact that this caliber of orthodox seminary education is 100% free is a historic blessing.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Hannah Edwards",
    role: "Missionary & Bible Teacher @ CrossGlobal",
    avatar: "/assets/img/avatars/student-1.jpg",
    headline: "Invaluable on the Mission Field",
    content:
      "While planting churches abroad, having self-paced access to Biblical Hermeneutics and Koine Greek has revolutionized our discipleship curriculum. Reliable, faithful, and Christ-centered.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Marcus Hodge",
    role: "Seminary Candidate & Ministry Director",
    avatar: "/assets/img/avatars/student-2.jpg",
    headline: "Rigorous Exegetical Depth",
    content:
      "VTI bridges academic excellence and practical ministry shepherd care. The module evaluations and verifiable completion certificates proved my theological readiness to our presbytery board.",
    rating: 5,
  },
  {
    id: "test-4",
    name: "Rev. Dr. Samuel Davies",
    role: "Director of Church Multiplication",
    avatar: "/assets/img/avatars/student-3.jpg",
    headline: "Equipping Leaders Globally",
    content:
      "We recommend VTI to all our lay leaders and church planting apprentices. The uncompromising submission to Scripture and rich historical theology make it an indispensable kingdom resource.",
    rating: 5,
  },
];

export function HomeTestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-[#EAEBED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHeading
            subtitle="Student & Ministry Testimonials"
            title="What Pastors & Scholars Say About VTI"
            align="center"
          />
          <p className="mt-3 text-sm sm:text-base text-[#57595F]">
            Join over 10,000+ pastors, missionaries, and believers worldwide growing in sound biblical doctrine.
          </p>
        </div>

        {/* Testimonials Grid (index-11.html ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="group relative flex flex-col justify-between p-7 rounded-3xl bg-white border border-[#EAEBED] shadow-sm hover:shadow-xl hover:border-[#FF5B35]/30 transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <div>
                {/* Header: Quote Icon & Star Ratings */}
                <div className="flex items-center justify-between mb-5">
                  <div className="relative w-8 h-7 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/assets/img/testimonial/home-6/queto.png"
                      alt="Quote"
                      width={32}
                      height={28}
                      style={{ width: "auto", height: "auto" }}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[#FFC221]">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFC221]" />
                    ))}
                  </div>
                </div>

                {/* Headline */}
                <h4 className="text-base font-bold text-[#161821] font-heading mb-2.5 line-clamp-1">
                  {test.headline}
                </h4>

                {/* Quote Content */}
                <p className="text-xs sm:text-sm text-[#57595F] leading-relaxed line-clamp-4">
                  &ldquo;{test.content}&rdquo;
                </p>
              </div>

              {/* User Bio Footer */}
              <div className="mt-6 pt-4 border-t border-[#EAEBED] flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-[#EAEBED] shrink-0">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs sm:text-sm font-bold text-[#161821] truncate">
                    {test.name}
                  </h5>
                  <p className="text-[11px] text-[#57595F] truncate">
                    {test.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
