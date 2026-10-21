"use client";

import React from "react";
import StoreProvider from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <QueryProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
