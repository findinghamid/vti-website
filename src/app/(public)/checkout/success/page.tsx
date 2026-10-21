"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  BookOpen,
  Printer,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Calendar,
  Sparkles,
  Play,
} from "lucide-react";
import { VtiButton } from "@/components/ui/vti";
import { OrderDetail } from "@/server/services/order.service";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/v1/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        }
      } catch (e) {
        console.error("Failed fetching order receipt", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* 1. VTI Breadcrumb Area */}
      <section className="relative py-14 bg-[#161821] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Breadcrumb Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-[#09BD3C]">Order Confirmation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
              Enrollment Confirmed!
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-md">
              Your order has been authorized and your learning sandboxes are unlocked.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Order Confirmation Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Callout Box */}
          <div className="text-center space-y-4 pb-8 border-b border-[#EAEBED]">
            <div className="w-20 h-20 rounded-3xl bg-[#09BD3C]/15 text-[#09BD3C] mx-auto flex items-center justify-center animate-in zoom-in-90 duration-300 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#09BD3C] bg-[#09BD3C]/10 px-3 py-1 rounded-full border border-[#09BD3C]/20">
                Payment Authorized
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#161821] pt-2">
                Thank You for Enrolling!
              </h2>
              <p className="text-xs sm:text-sm text-[#57595F] max-w-md mx-auto leading-relaxed">
                Your courses have been unlocked with lifetime access. You can start your video curriculum and coding sandboxes right now.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <VtiButton href="/student/learning" variant="primary" size="md" showArrow>
                Go to My Learning Hub
              </VtiButton>

              <button
                onClick={handlePrint}
                className="h-11 px-5 rounded-2xl border border-[#EAEBED] bg-white hover:bg-slate-50 text-[#161821] text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#FF5B35]" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>

          {/* Order Receipt Details Card */}
          {order && (
            <div className="mt-8 rounded-3xl border border-[#EAEBED] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EAEBED] text-xs text-[#57595F]">
                <div>
                  <span className="font-extrabold text-[#161821] block text-base font-heading">
                    Order #{order.orderNumber}
                  </span>
                  <span className="flex items-center gap-1.5 mt-0.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5B35]" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {order.payment && (
                  <div className="sm:text-right">
                    <span className="font-bold text-[#161821] flex items-center gap-1.5 sm:justify-end">
                      <CreditCard className="w-4 h-4 text-[#FF5B35]" />
                      <span>Authorized via {order.payment.provider}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#57595F] truncate block mt-0.5">
                      Ref: {order.payment.providerRefId}
                    </span>
                  </div>
                )}
              </div>

              {/* Courses Unlocked */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-[#161821] font-heading uppercase tracking-wider">
                  Enrolled Courses
                </h3>
                <div className="divide-y divide-[#EAEBED] rounded-2xl border border-[#EAEBED] overflow-hidden">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          {item.thumbnailUrl ? (
                            <Image src={item.thumbnailUrl} alt={item.title} fill sizes="64px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#FF5B35]/20 flex items-center justify-center text-[10px] text-[#FF5B35] font-bold">
                              VTI
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/courses/${item.slug}`}
                            className="font-bold text-sm text-[#161821] hover:text-[#FF5B35] transition line-clamp-1 font-heading"
                          >
                            {item.title}
                          </Link>
                          {item.instructorName && (
                            <p className="text-xs text-[#57595F]">Mentor: {item.instructorName}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <span className="font-extrabold text-sm text-[#161821]">
                          {item.formattedPrice}
                        </span>
                        <Link href={`/courses/${item.slug}`}>
                          <button className="h-8 px-3.5 rounded-xl bg-[#FF5B35]/10 hover:bg-[#FF5B35] hover:text-white text-[#FF5B35] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start Course</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-4 border-t border-[#EAEBED] flex justify-end">
                <div className="w-full sm:w-72 space-y-2 text-xs font-medium text-[#57595F]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#161821]">{order.formattedSubtotal}</span>
                  </div>

                  {order.discountMinor > 0 && (
                    <div className="flex justify-between text-[#09BD3C] font-semibold">
                      <span>Voucher / Discounts:</span>
                      <span>-{order.formattedDiscount}</span>
                    </div>
                  )}

                  {order.taxMinor > 0 && (
                    <div className="flex justify-between">
                      <span>Estimated Tax:</span>
                      <span>{order.formattedTax}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-2 border-t border-[#EAEBED] font-black text-sm text-[#161821]">
                    <span>Total Paid:</span>
                    <span className="text-xl text-[#FF5B35] font-heading">{order.formattedTotal}</span>
                  </div>
                </div>
              </div>

              {/* Guarantee Note */}
              <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-center gap-2 text-xs text-[#57595F]">
                <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
                <span>Protected by our 30-Day Money-Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white py-20 text-center text-xs font-bold text-[#57595F]">Loading Order Receipt...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
