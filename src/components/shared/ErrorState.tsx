"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-destructive/20 bg-destructive/5 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      )}
    </div>
  );
}
