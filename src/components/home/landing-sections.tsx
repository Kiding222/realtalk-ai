"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative isolate overflow-hidden border-b border-[#e8e9e6]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_44%,rgba(211,226,218,0.48),transparent_34%)]" />
      <div className="mx-auto grid min-h-[650px] max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e2e6e1] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#57635c] shadow-sm">
            <span className="size-1.5 rounded-full bg-[#42856a]" /> {t("hero.badge")}
          </p>
          <h1 className="max-w-[680px] text-[clamp(2.7rem,6vw,4.75rem)] leading-[1.04] font-semibold tracking-[-0.065em] text-[#141816]">
            {t("hero.title")}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#69726c] sm:text-lg sm:leading-8">
            {t("hero.sub")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/scenarios" className="rounded-lg px-6">{t("hero.cta")} <span aria-hidden="true">↗</span></Button>
            <span className="text-xs text-[#828983]">{t("hero.note")}</span>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs text-[#727a74]">
            <span className="flex -space-x-1.5" aria-hidden="true">
              <i className="size-1.5 rounded-full bg-[#779b85]" /><i className="size-1.5 rounded-full bg-[#b6cbbd]" /><i className="size-1.5 rounded-full bg-[#d5e2d8]" />
            </span>
            {t("hero.built")}
          </div>
        </div>
        <ConversationPreview />
      </div>
    </section>
  );
}

function ConversationPreview() {
  const { t } = useLanguage();
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div aria-hidden="true" className="absolute -inset-7 rounded-[2rem] border border-white/80 bg-white/35" />
      <div className="relative rounded-2xl border border-[#e6e8e4] bg-white shadow-[0_30px_90px_-45px_rgba(26,45,34,0.32)]">
        <div className="flex items-center justify-between border-b border-[#eef0ed] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#f0f4f0] text-[#3d7659]">✈</span>
            <div><p className="text-xs font-semibold">{t("scenariosSection.airportTitle")}</p><p className="mt-0.5 text-[10px] text-[#929a94]">JFK · New York</p></div>
          </div>
          <span className="rounded-full border border-[#e8ece8] px-2.5 py-1 text-[9px] font-medium text-[#718078]">{t("hero.live")}</span>
        </div>
        <div className="space-y-5 px-5 py-7 sm:px-6">
          <Message role={t("hero.roleOfficer")} text="Good morning. What brings you to the United States?" />
          <Message role={t("hero.you")} text="I'm here to visit my cousin and explore the city." mine />
          <Message role={t("hero.roleOfficer")} text="How long are you planning to stay?" />
        </div>
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-[#e8ebe7] bg-[#fbfcfa] px-4 py-3.5 sm:mx-6">
          <span className="flex-1 text-xs text-[#a0a7a1]">{t("hero.typeHere")}</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#202722] text-xs text-white">↑</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#eef0ed] px-5 py-3 text-[10px] text-[#929a94] sm:px-6">
          <span>{t("hero.mode")}</span><span>01:24</span>
        </div>
      </div>
      <div className="absolute -right-3 -bottom-6 flex items-center gap-3 rounded-xl border border-[#e6e8e4] bg-white px-4 py-3 shadow-lg sm:-right-7">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#f0f4f0] text-xs text-[#3d7659]">✳</span>
        <div><p className="text-[9px] font-semibold tracking-wide text-[#929a94]">{t("hero.afterYou")}</p><p className="mt-0.5 text-[11px] font-medium text-[#37423b]">{t("hero.feedback")}</p></div>
      </div>
    </div>
  );
}

function Message({ role, text, mine = false }: { role: string; text: string; mine?: boolean }) {
  return <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
    <span className="mb-1.5 text-[9px] font-semibold tracking-[0.14em] text-[#9ba29c]">{role}</span>
    <p className={`max-w-[90%] rounded-xl px-4 py-3 text-xs leading-5 ${mine ? "rounded-tr-sm bg-[#202722] text-white" : "rounded-tl-sm bg-[#f3f5f2] text-[#38423c]"}`}>{text}</p>
  </div>;
}

export function ProblemSection() {
  const { t } = useLanguage();
  const problems = [
    { icon: "✈", title: t("problem.c1t"), detail: t("problem.c1d") },
    { icon: "◒", title: t("problem.c2t"), detail: t("problem.c2d") },
    { icon: "⌘", title: t("problem.c3t"), detail: t("problem.c3d") },
  ];
  return <section className="border-b border-[#e8e9e6] bg-white">
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div><Eyebrow>{t("problem.eyebrow")}</Eyebrow><h2 className="mt-5 max-w-md text-3xl leading-tight font-semibold tracking-[-0.05em] sm:text-4xl">{t("problem.title")}</h2></div>
        <p className="max-w-xl text-base leading-7 text-[#6f7872] sm:pt-8 sm:text-lg sm:leading-8">{t("problem.body")}</p>
      </div>
      <div className="mt-14 grid gap-3 md:grid-cols-3">
        {problems.map((item, index) => <article key={item.title} className="border-t border-[#e8e9e6] py-6 md:pr-7">
          <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-[#f4f6f3] text-sm text-[#50675a]">{item.icon}</span><span className="font-mono text-[10px] text-[#a0a7a1]">0{index + 1}</span></div>
          <h3 className="mt-6 text-base font-semibold tracking-tight">{item.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#78817b]">{item.detail}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

export function HowItWorksSection() {
  const { t } = useLanguage();
  const steps = [
    { number: "01", title: t("how.s1t"), detail: t("how.s1d") },
    { number: "02", title: t("how.s2t"), detail: t("how.s2d") },
    { number: "03", title: t("how.s3t"), detail: t("how.s3d") },
  ];
  return <section className="border-b border-[#e8e9e6]">
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
      <div className="max-w-xl"><Eyebrow>{t("how.eyebrow")}</Eyebrow><h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{t("how.title")}</h2></div>
      <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
        {steps.map((step) => <article key={step.number} className="border-t border-[#dfe3de] pt-5">
          <span className="font-mono text-xs text-[#66816f]">{step.number}</span><h3 className="mt-8 text-lg font-semibold tracking-tight">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#78817b]">{step.detail}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

export function ScenariosSection() {
  const { t } = useLanguage();
  const scenarios = [
    { number: "01", icon: "✈", title: t("scenariosSection.airportTitle"), detail: t("scenariosSection.airportDetail"), tag: t("scenarioCard.travel") },
    { number: "02", icon: "◒", title: t("scenariosSection.restaurantTitle"), detail: t("scenariosSection.restaurantDetail"), tag: t("scenarioCard.everyday") },
    { number: "03", icon: "⌘", title: t("scenariosSection.workplaceTitle"), detail: t("scenariosSection.workplaceDetail"), tag: t("scenarioCard.career") },
  ];
  return <section className="border-b border-[#e8e9e6] bg-white">
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Eyebrow>{t("scenariosSection.eyebrow")}</Eyebrow><h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{t("scenariosSection.title")}</h2></div><Button href="/scenarios" variant="secondary" className="self-start sm:self-auto">{t("scenariosSection.explore")} <span aria-hidden="true">→</span></Button></div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {scenarios.map((scenario) => <article key={scenario.number} className="group rounded-xl border border-[#e6e8e4] bg-[#fbfcfa] p-5 transition-colors hover:border-[#cbd6cd] sm:p-6">
          <div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-xl border border-[#e6e9e5] bg-white text-[#526d5b]">{scenario.icon}</span><span className="font-mono text-[10px] text-[#9ba29c]">{scenario.tag}</span></div>
          <h3 className="mt-9 text-base font-semibold tracking-tight">{scenario.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#78817b]">{scenario.detail}</p>
          <Button href="/scenarios" variant="quiet" className="mt-4 min-h-9 px-0 text-xs">{t("scenariosSection.practice")} <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></Button>
        </article>)}
      </div>
    </div>
  </section>;
}

export function PersonalStorySection() {
  const { t } = useLanguage();
  return <section className="border-b border-[#e8e9e6]">
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:px-8 sm:py-28 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
      <div><Eyebrow>{t("story.eyebrow")}</Eyebrow><h2 className="mt-5 max-w-sm text-3xl leading-tight font-semibold tracking-[-0.05em] sm:text-4xl">{t("story.title")}</h2></div>
      <div className="max-w-2xl border-l border-[#dce2dc] pl-6 sm:pl-9"><p className="text-lg leading-8 tracking-[-0.02em] text-[#444d47] sm:text-xl sm:leading-9">{t("story.body1")}</p><p className="mt-5 text-base leading-7 text-[#77817a]">{t("story.body2")}</p><div className="mt-9 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#e8eee9] text-xs font-semibold text-[#45614e]">J</span><div><p className="text-xs font-semibold">{t("story.founder")}</p><p className="mt-0.5 text-[11px] text-[#909891]">RealTalk AI</p></div></div></div>
    </div>
  </section>;
}

export function CallToActionSection() {
  const { t } = useLanguage();
  return <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-6xl rounded-2xl bg-[#202722] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
      <Eyebrow light>{t("cta.eyebrow")}</Eyebrow><h2 className="mx-auto mt-5 max-w-2xl text-3xl leading-tight font-semibold tracking-[-0.05em] sm:text-5xl">{t("cta.title")}</h2>
      <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#c0c8c2] sm:text-base">{t("cta.body")}</p>
      <Button href="/scenarios" className="mt-8 bg-white text-[#202722] hover:bg-[#edf0ed]">{t("cta.button")} <span aria-hidden="true">↗</span></Button>
    </div>
  </section>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[10px] font-semibold tracking-[0.16em] ${light ? "text-[#aebbb2]" : "text-[#748379]"}`}>{children}</p>;
}
