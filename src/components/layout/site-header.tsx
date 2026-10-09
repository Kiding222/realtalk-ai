"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-provider";

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="border-b border-[#e7e9e4] bg-[#fbfaf7]/90">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="RealTalk">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#202722] text-lg font-bold text-white">R</span>
          <span className="text-[15px] font-bold tracking-tight">RealTalk <span className="font-medium text-[#77817a]">AI</span></span>
        </Link>
        <nav aria-label="nav" className="flex items-center gap-4 text-sm font-medium text-[#52635a] sm:gap-6">
          <div className="flex items-center rounded-lg border border-[#e2e6e1] p-0.5 text-[11px] font-semibold" role="group" aria-label={t("lang.label")}>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`min-h-7 rounded-md px-2 transition-colors ${lang === "en" ? "bg-[#202722] text-white" : "text-[#77817a] hover:text-[#176b52]"}`}
            >
              {t("lang.en")}
            </button>
            <button
              type="button"
              onClick={() => setLang("zh")}
              aria-pressed={lang === "zh"}
              className={`min-h-7 rounded-md px-2 transition-colors ${lang === "zh" ? "bg-[#202722] text-white" : "text-[#77817a] hover:text-[#176b52]"}`}
            >
              {t("lang.zh")}
            </button>
          </div>
          <Link className="hidden transition-colors hover:text-[#176b52] sm:inline" href="/scenarios">{t("nav.scenarios")}</Link>
          <Link className="transition-colors hover:text-[#176b52]" href="/scenarios">{t("nav.start")} <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
