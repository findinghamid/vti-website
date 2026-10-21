"use client";

import * as React from "react";
import Link from "next/link";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-card/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="default" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && !actionHref && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
