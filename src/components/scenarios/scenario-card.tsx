"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import type { Scenario } from "@/data/scenarios";
import { useLanguage } from "@/lib/i18n/language-provider";

const difficultyStyles = {
  Easy: "border-[#e5e9e4] bg-[#f7f8f6] text-[#68736b]",
  Medium: "border-[#e7e8df] bg-[#f8f8f3] text-[#74745d]",
  Hard: "border-[#e9e5e3] bg-[#faf6f5] text-[#866f68]",
};

const categoryKeyBySlug: Record<string, string> = {
  airport: "travel",
  restaurant: "everyday",
  workplace: "career",
};

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const { t } = useLanguage();
  const title = t(`scenarioData.${scenario.slug}Title`);
  const description = t(`scenarioData.${scenario.slug}Desc`);
  const aiRole = t(`scenarioData.${scenario.slug}Ai`);
  const category = t(`scenarioCard.${categoryKeyBySlug[scenario.slug] ?? "travel"}`);
  const difficultyLabel = t(`scenarioCard.${scenario.difficulty.toLowerCase()}`);

  return (
    <article className="group flex min-h-[330px] flex-col rounded-2xl border border-[#e6e8e4] bg-white p-5 transition-colors hover:border-[#cad6cc] sm:p-6">
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl border border-[#e8ebe7] bg-[#f7f8f6] text-lg text-[#526d5b]" aria-hidden="true">{scenario.icon}</span>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${difficultyStyles[scenario.difficulty]}`}>{difficultyLabel}</span>
      </div>

      <p className="mt-6 text-[10px] font-semibold tracking-[0.15em] text-[#829087]">{category}</p>
      <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-[#202722]">{title}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[#77817a]">{description}</p>

      <div className="mt-5 rounded-xl border border-[#eceeea] bg-[#fafbf9] px-4 py-3">
        <p className="text-[9px] font-semibold tracking-[0.12em] text-[#929a94]">{t("scenarioCard.example")}</p>
        <p className="mt-2 text-xs leading-5 text-[#414a44]">“{scenario.example}”</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="text-[11px] text-[#89928c]">{t("scenarioCard.aiRole")} <span className="ml-1 font-medium text-[#56625a]">{aiRole}</span></p>
        <Link
          href={`/conversation/${scenario.slug}`}
          onClick={() => track("scenario_selected", { scenario: scenario.slug })}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#202722] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#37423b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b52]"
        >
          {t("scenarioCard.start")} <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}
