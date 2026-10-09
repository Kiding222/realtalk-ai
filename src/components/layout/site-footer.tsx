"use client";

import { useLanguage } from "@/lib/i18n/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#e7e9e4]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-[#77817b] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>{t("footer.tagline")}</span>
        <span>{t("footer.sub")}</span>
      </div>
    </footer>
  );
}
