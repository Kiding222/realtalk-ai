"use client";

import type { Scenario } from "@/data/scenarios";
import { useLanguage } from "@/lib/i18n/language-provider";

export function CharacterCard({ scenario }: { scenario: Scenario }) {
  const { t } = useLanguage();
  const title = t(`scenarioData.${scenario.slug}CharTitle`);
  const role = t(`scenarioData.${scenario.slug}CharRole`);
  const goal = t(`scenarioData.${scenario.slug}CharGoal`);
  const aiRole = t(`scenarioData.${scenario.slug}Ai`);

  return (
    <aside className="hidden rounded-2xl border border-[#e6e8e4] bg-white p-5 lg:block">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-[#88928b]">{t("character.partner")}</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1f5f1] text-lg text-[#4f7059]">{scenario.icon}</span>
        <div><h2 className="text-sm font-semibold text-[#27312a]">{title}</h2><p className="mt-1 text-xs text-[#7e8981]">{aiRole}</p></div>
      </div>
      <dl className="mt-5 space-y-4 border-t border-[#eef0ed] pt-4">
        <div><dt className="text-[10px] font-medium text-[#959d97]">{t("character.role")}</dt><dd className="mt-1 text-xs leading-5 text-[#4f5a52]">{role}</dd></div>
        <div><dt className="text-[10px] font-medium text-[#959d97]">{t("character.goal")}</dt><dd className="mt-1 text-xs leading-5 text-[#4f5a52]">{goal}</dd></div>
      </dl>
      <div className="mt-5 rounded-xl bg-[#f7f8f6] p-3.5">
        <p className="text-[9px] font-semibold tracking-[0.12em] text-[#919a93]">{t("character.reminder")}</p>
        <p className="mt-2 text-xs leading-5 text-[#69746c]">{t("character.reminderText")}</p>
      </div>
    </aside>
  );
}
