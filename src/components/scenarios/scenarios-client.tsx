"use client";

import { PageShell } from "@/components/layout/page-shell";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import { scenarios } from "@/data/scenarios";
import { useLanguage } from "@/lib/i18n/language-provider";

export function ScenariosClient() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <section aria-labelledby="scenarios-heading">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#748379]">{t("scenariosPage.eyebrow")}</p>
          <h1 id="scenarios-heading" className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.05em] text-[#171c19] sm:text-5xl">
            {t("scenariosPage.title")}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#748078] sm:text-base">
            {t("scenariosPage.sub")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {scenarios.map((scenario) => <ScenarioCard key={scenario.slug} scenario={scenario} />)}
        </div>

        <p className="mt-8 text-center text-xs text-[#8a938d]">{t("scenariosPage.more")}</p>
      </section>
    </PageShell>
  );
}
