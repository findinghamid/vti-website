"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetail } from "@/server/services/order.service";

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/v1/orders");
        const data = await res.json();
        if (data.success && data.data?.orders) {
          setOrders(data.data.orders);
        }
      } catch (e) {
        console.error("Failed fetching purchase history", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="pb-6 border-b border-[#EAEBED] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            Order & Purchase History
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Review your past course enrollment transactions, receipts, and billing invoices.
          </p>
        </div>

        <Link href="/courses">
          <Button
            variant="outline"
            className="font-bold text-xs gap-1.5 border-[#EAEBED] text-[#161821] hover:bg-[#F3F4F8] rounded-xl h-10 px-4"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Orders List or Empty State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#EAEBED] bg-white p-6 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-[#F3F4F8] rounded w-1/3" />
              <div className="h-10 bg-[#F3F4F8] rounded w-full" />
              <div className="h-4 bg-[#F3F4F8] rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-[#EAEBED] bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#161821]">No purchases yet</h2>
            <p className="text-xs text-[#55585B] max-w-sm mx-auto">
              You haven&apos;t purchased any courses yet. Once you complete checkout, your receipts and order invoices will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/courses">
              <Button className="font-bold text-xs h-10 px-6 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl shadow-xs">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#EAEBED] bg-white overflow-hidden shadow-xs hover:border-[#FF5B35]/40 transition"
            >
              {/* Order Meta Header Strip */}
              <div className="bg-[#FAF9F6] px-6 py-4 border-b border-[#EAEBED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[#8A8C90] block text-[10px] font-bold uppercase tracking-wider">
                      DATE
                    </span>
                    <span className="font-bold text-[#161821]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#8A8C90] block text-[10px] font-bold uppercase tracking-wider">
                      TOTAL AMOUNT
                    </span>
                    <span className="font-black text-[#161821]">{order.formattedTotal}</span>
                  </div>

                  <div>
                    <span className="text-[#8A8C90] block text-[10px] font-bold uppercase tracking-wider">
                      ORDER NO.
                    </span>
                    <span className="font-mono font-bold text-[#FF5B35]">{order.orderNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      order.status === "COMPLETED"
                        ? "bg-[#E8F8EE] text-[#09BD3C] border border-[#09BD3C]/20"
                        : order.status === "PENDING"
                        ? "bg-[#FFF6DF] text-[#8C6200] border border-[#FBEAC3]"
                        : "bg-[#FFF2F2] text-[#FF4A55] border border-[#FF4A55]/20"
                    }`}
                  >
                    {order.status}
                  </span>

                  <Link href={`/checkout/success?orderId=${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold gap-1 border-[#EAEBED] rounded-lg hover:bg-white text-[#161821]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF5B35]" />
                      <span>Receipt</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items in this order */}
              <div className="p-6 divide-y divide-[#EAEBED] space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <Link
                        href={`/courses/${item.slug}`}
                        className="font-bold text-sm text-[#161821] hover:text-[#FF5B35] transition"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-[#55585B]">Lifetime Student Access Included</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm text-[#161821]">
                        {item.formattedPrice}
                      </span>
                      <Link href={`/courses/${item.slug}`}>
                        <Button
                          size="sm"
                          className="text-xs font-bold h-8 px-4 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-lg shadow-xs"
                        >
                          Go to Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
