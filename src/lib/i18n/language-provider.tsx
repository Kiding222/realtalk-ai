"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import dictionaries, { LANG_STORAGE_KEY, type Lang } from "@/lib/i18n/dictionaries";

type TranslateVars = Record<string, string | number>;

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: TranslateVars) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getByPath(source: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
  return typeof value === "string" ? value : undefined;
}

function interpolate(text: string, vars?: TranslateVars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start from English on the server and first client render to avoid hydration mismatches.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let initial: Lang = "en";
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "en" || stored === "zh") {
        initial = stored;
      } else if (navigator.language.toLowerCase().startsWith("zh")) {
        initial = "zh";
      }
    } catch {
      initial = "en";
    }
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable; the in-memory language still works.
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((current) => {
      const next: Lang = current === "en" ? "zh" : "en";
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors.
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string, vars?: TranslateVars) => {
      const active = getByPath(dictionaries[lang], key) ?? getByPath(dictionaries.en, key) ?? key;
      return interpolate(active, vars);
    },
    [lang],
  );

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
