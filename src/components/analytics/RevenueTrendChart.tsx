"use client";

import React, { useState } from "react";
import { RevenueTimeSeriesPoint } from "@/server/services/instructor-analytics.service";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface RevenueTrendChartProps {
  data: RevenueTimeSeriesPoint[];
  currency?: string;
}

export function RevenueTrendChart({ data, currency = "USD" }: RevenueTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        No revenue data recorded for this period.
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenueMinor), 1000);
  const totalRevenueMinor = data.reduce((sum, d) => sum + d.revenueMinor, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.ordersCount, 0);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Compute SVG points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.revenueMinor / maxRevenue) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, index) => {
    if (index === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[index - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">30-Day Revenue Velocity</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily net earnings (70% instructor revenue split) across all active courses
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-muted-foreground">30d Total:</span>
            <span className="font-bold text-foreground">
              ${(totalRevenueMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-muted-foreground">Sales:</span>
            <span className="font-bold text-foreground">{totalOrders} orders</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartHeight * 0.5}
            x2={width - paddingX}
            y2={paddingY + chartHeight * 0.5}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            strokeOpacity="0.15"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#revenueGradient)" />

          {/* Trend line */}
          <path
            d={pathD}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive hit areas and dots */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={pt.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible larger hover target */}
                <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3}
                  className="transition-all duration-150"
                  fill={isHovered ? "#7c3aed" : "#a78bfa"}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-2 rounded-xl shadow-xl text-xs backdrop-blur-sm z-20 border border-slate-700 dark:border-slate-300"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${Math.max(8, (hoveredPoint.y / height) * 100 - 32)}%`,
            }}
          >
            <div className="font-semibold text-slate-300 dark:text-slate-600 text-[10px] uppercase tracking-wider">
              {new Date(hoveredPoint.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="font-black text-sm text-violet-300 dark:text-violet-700">
              ${(hoveredPoint.revenueMinor / 100).toFixed(2)}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {hoveredPoint.ordersCount} {hoveredPoint.ordersCount === 1 ? "order" : "orders"} • {hoveredPoint.newStudents} students
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3 px-2">
        <span>{data[0]?.date ? new Date(data[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
        <span className="font-medium text-xs">30-Day Timeline</span>
        <span>{data[data.length - 1]?.date ? new Date(data[data.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
      </div>
    </div>
  );
}
