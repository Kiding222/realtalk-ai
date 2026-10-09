"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Scenario } from "@/data/scenarios";
import type { FeedbackResult } from "@/lib/ai/types";
import { useLanguage } from "@/lib/i18n/language-provider";

type StoredReport = { feedback: FeedbackResult };

export function FeedbackReport({ scenario }: { scenario: Scenario }) {
  const { t } = useLanguage();
  const storageKey = `realtalk:feedback:${scenario.slug}`;
  const scenarioTitle = t(`scenarioData.${scenario.slug}Title`);
  const [raw, setRaw] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRaw(window.localStorage.getItem(storageKey));
    } catch {
      setRaw("__missing__");
    }
  }, [storageKey]);

  if (raw === null) {
    return <div className="mx-auto max-w-4xl animate-pulse rounded-2xl border border-[#e6e8e4] bg-white p-12 text-center text-sm text-[#7b857e]">{t("feedback.loading")}</div>;
  }

  const report = raw && raw !== "__missing__" ? parseReport(raw) : null;

  if (!report) {
    return <section className="mx-auto max-w-xl rounded-2xl border border-[#e6e8e4] bg-white p-8 text-center sm:p-12">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#f1f5f1] text-lg text-[#526d5b]">✳</span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">{t("feedback.noneTitle")}</h1>
      <p className="mt-3 text-sm leading-6 text-[#748078]">{t("feedback.noneBody", { title: scenarioTitle })}</p>
      <Link href={`/conversation/${scenario.slug}`} className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#202722] px-5 text-sm font-semibold text-white hover:bg-[#37423b]">{t("feedback.continue")}</Link>
    </section>;
  }

  const overallScore = Math.round((report.grammar_score + report.naturalness_score) / 2);

  return (
    <section className="mx-auto max-w-4xl">
      <header className="flex flex-col justify-between gap-6 rounded-2xl border border-[#e4e8e3] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#748379]">{t("feedback.result")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#202722]">{scenarioTitle}</h1>
          <p className="mt-2 text-sm text-[#78827b]">{t("feedback.intro")}</p>
        </div>
        <div className="flex items-center gap-4 self-start rounded-xl bg-[#f5f7f4] px-5 py-4 sm:self-auto">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-[#a7bba9] bg-white text-lg font-semibold tracking-tight text-[#355c40]">{overallScore}</div>
          <div><p className="text-[10px] font-semibold tracking-[0.12em] text-[#849087]">{t("feedback.overall")}</p><p className="mt-1 text-xs text-[#68736b]">{t("feedback.outOf")}</p></div>
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ScoreCard label={t("feedback.grammar")} score={report.grammar_score} detail={t("feedback.grammarDetail")} />
        <ScoreCard label={t("feedback.naturalness")} score={report.naturalness_score} detail={t("feedback.naturalnessDetail")} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ListCard title={t("feedback.strengths")} eyebrow={t("feedback.strengthsEyebrow")} items={report.strengths} tone="green" />
        <ListCard title={t("feedback.improve")} eyebrow={t("feedback.improveEyebrow")} items={report.improvements} tone="neutral" />
      </div>

      <section className="mt-4 rounded-2xl border border-[#e6e8e4] bg-white p-6 sm:p-7">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[#748379]">{t("feedback.cultural")}</p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#28322b]">{t("feedback.culturalTitle")}</h2>
        {report.cultural_tips.length ? <ul className="mt-4 space-y-3">
          {report.cultural_tips.map((tip, index) => <li key={`${index}-${tip}`} className="flex gap-3 text-sm leading-6 text-[#606b63]"><span className="mt-0.5 text-[#66816f]">↗</span><span>{tip}</span></li>)}
        </ul> : <p className="mt-3 text-sm text-[#7b857e]">{t("feedback.noCultural")}</p>}
      </section>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={`/conversation/${scenario.slug}`} className="inline-flex min-h-11 items-center rounded-lg bg-[#202722] px-5 text-sm font-semibold text-white hover:bg-[#37423b]">{t("feedback.again")}</Link>
        <Link href="/scenarios" className="inline-flex min-h-11 items-center rounded-lg border border-[#dfe4df] bg-white px-5 text-sm font-semibold text-[#4e5952] hover:bg-[#f8faf8]">{t("feedback.chooseAnother")}</Link>
      </div>
    </section>
  );
}

function parseReport(raw: string): FeedbackResult | null {
  try {
    const parsed = JSON.parse(raw) as StoredReport;
    return isFeedbackResult(parsed.feedback) ? parsed.feedback : null;
  } catch {
    return null;
  }
}

function ScoreCard({ label, score, detail }: { label: string; score: number; detail: string }) {
  return <article className="flex items-center justify-between rounded-2xl border border-[#e6e8e4] bg-white p-5 sm:p-6">
    <div><p className="text-[10px] font-semibold tracking-[0.13em] text-[#88928b]">{label.toUpperCase()}</p><p className="mt-2 text-xs text-[#7b857e]">{detail}</p></div>
    <p className="ml-4 text-3xl font-semibold tracking-[-0.05em] text-[#303a33]">{score}<span className="ml-0.5 text-xs font-medium text-[#8b948d]">/100</span></p>
  </article>;
}

function ListCard({ title, eyebrow, items, tone }: { title: string; eyebrow: string; items: string[]; tone: "green" | "neutral" }) {
  const { t } = useLanguage();
  return <section className="rounded-2xl border border-[#e6e8e4] bg-white p-6 sm:p-7">
    <p className={`text-[10px] font-semibold tracking-[0.14em] ${tone === "green" ? "text-[#66816f]" : "text-[#87918a]"}`}>{eyebrow}</p>
    <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#28322b]">{title}</h2>
    {items.length ? <ul className="mt-4 space-y-3">
      {items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-[#606b63]"><span className={`mt-0.5 ${tone === "green" ? "text-[#66816f]" : "text-[#9a8d72]"}`}>{tone === "green" ? "✓" : "↗"}</span><span>{item}</span></li>)}
    </ul> : <p className="mt-4 text-sm text-[#7b857e]">{t("feedback.nothing")}</p>}
  </section>;
}

function isFeedbackResult(value: unknown): value is FeedbackResult {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.grammar_score === "number" && typeof record.naturalness_score === "number"
    && Array.isArray(record.strengths) && Array.isArray(record.improvements) && Array.isArray(record.cultural_tips);
}
