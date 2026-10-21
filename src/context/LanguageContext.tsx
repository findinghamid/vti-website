"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface LanguageOption {
  code: "EN" | "UR" | "AR" | "ES" | "ZH";
  label: string;
  nativeLabel: string;
  googleCode: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: "EN",
    label: "English (EN)",
    nativeLabel: "English",
    googleCode: "en",
    dir: "ltr",
  },
  {
    code: "UR",
    label: "اردو - Urdu (UR)",
    nativeLabel: "اردو",
    googleCode: "ur",
    dir: "rtl",
  },
  {
    code: "AR",
    label: "العربية - Arabic (AR)",
    nativeLabel: "العربية",
    googleCode: "ar",
    dir: "rtl",
  },
  {
    code: "ES",
    label: "Español (ES)",
    nativeLabel: "Español",
    googleCode: "es",
    dir: "ltr",
  },
  {
    code: "ZH",
    label: "中文 - Mandarin (ZH)",
    nativeLabel: "中文",
    googleCode: "zh-CN",
    dir: "ltr",
  },
];

interface LanguageContextType {
  currentLang: LanguageOption["code"];
  currentOption: LanguageOption;
  isRtl: boolean;
  changeLanguage: (code: LanguageOption["code"]) => void;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "EN",
  currentOption: LANGUAGES[0],
  isRtl: false,
  changeLanguage: () => {},
  languages: LANGUAGES,
});

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LanguageOption["code"]>("EN");

  // Helper to read cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Helper to set cookie (must not encode slash so Google Translate can read /en/ur)
  const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const hostname = window.location.hostname;
    // Set for current path & root
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    if (hostname && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
      document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=.${hostname};`;
      const parts = hostname.split(".");
      if (parts.length > 1) {
        const rootDomain = "." + parts.slice(-2).join(".");
        document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=${rootDomain};`;
      }
    }
  };

  // Helper to delete cookie
  const deleteCookie = (name: string) => {
    if (typeof document === "undefined") return;
    const hostname = window.location.hostname;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    if (hostname && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      const parts = hostname.split(".");
      if (parts.length > 1) {
        const rootDomain = "." + parts.slice(-2).join(".");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
      }
    }
  };

  // Initialize and load Google Translate script once
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Determine initial language from storage or googtrans cookie
    const saved = localStorage.getItem("vti_selected_lang") as LanguageOption["code"] | null;
    const googtransCookie = getCookie("googtrans");

    let initialCode: LanguageOption["code"] = "EN";
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      initialCode = saved;
    } else if (googtransCookie) {
      const match = LANGUAGES.find((l) => googtransCookie.endsWith("/" + l.googleCode));
      if (match) initialCode = match.code;
    }

    setCurrentLang(initialCode);

    const opt = LANGUAGES.find((l) => l.code === initialCode) || LANGUAGES[0];
    document.documentElement.lang = opt.googleCode;
    document.documentElement.dir = opt.dir;

    // Create hidden translate container if missing
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      document.body.appendChild(div);
    }

    // Define Google Translate Callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ur,ar,es,zh-CN",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Inject Script if not present using HTTPS
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const changeLanguage = useCallback((code: LanguageOption["code"]) => {
    const selected = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
    setCurrentLang(selected.code);
    localStorage.setItem("vti_selected_lang", selected.code);

    // Apply document direction and language
    document.documentElement.lang = selected.googleCode;
    document.documentElement.dir = selected.dir;

    if (selected.code === "EN") {
      deleteCookie("googtrans");
      setCookie("googtrans", "/en/en");
      window.location.reload();
      return;
    }

    setCookie("googtrans", `/en/${selected.googleCode}`);

    // Attempt to trigger Google Translate dropdown directly if present in DOM
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = selected.googleCode;
      combo.dispatchEvent(new Event("change"));
    } else {
      // Reload page to apply translation cookie across the entire DOM
      window.location.reload();
    }
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentOption,
        isRtl: currentOption.dir === "rtl",
        changeLanguage,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
