"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CharacterCard } from "@/components/conversation/character-card";
import { ChatInput } from "@/components/conversation/chat-input";
import { ConversationWindow } from "@/components/conversation/conversation-window";
import { HistoryDrawer } from "@/components/conversation/history-drawer";
import type { ConversationMessage } from "@/components/conversation/message-bubble";
import { conversationOpenings } from "@/data/conversation-presets";
import { makeSessionId, upsertSession, type StoredSession } from "@/lib/history/chat-history";
import { useLanguage } from "@/lib/i18n/language-provider";
import type { FeedbackResult } from "@/lib/ai/types";
import type { Scenario } from "@/data/scenarios";

export function ConversationExperience({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const { t } = useLanguage();
  const opening = conversationOpenings[scenario.slug] ?? "Hello. How can I help you today?";
  const aiLabel = t(`scenarioData.${scenario.slug}Ai`);

  const sessionIdRef = useRef(makeSessionId());
  const createdAtRef = useRef(Date.now());
  const [sessionId, setSessionId] = useState(sessionIdRef.current);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { id: "opening", role: "assistant", content: opening },
  ]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  // Persist the conversation locally once the user has said something.
  useEffect(() => {
    if (!messages.some((message) => message.role === "user")) return;
    upsertSession({
      id: sessionIdRef.current,
      slug: scenario.slug,
      messages,
      createdAt: createdAtRef.current,
      updatedAt: Date.now(),
    });
  }, [messages, scenario.slug]);

  function startNew() {
    sessionIdRef.current = makeSessionId();
    createdAtRef.current = Date.now();
    setSessionId(sessionIdRef.current);
    setMessages([{ id: "opening", role: "assistant", content: opening }]);
    setDraft("");
    setError("");
    setHistoryOpen(false);
  }

  function loadSession(session: StoredSession) {
    sessionIdRef.current = session.id;
    createdAtRef.current = session.createdAt;
    setSessionId(session.id);
    setMessages(session.messages);
    setError("");
    setHistoryOpen(false);
  }

  async function requestAI(history: ConversationMessage[]) {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenario.slug, character: scenario.aiRole, messages: history }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to get an AI response.");
      if (typeof result.response !== "string" || !result.response.trim()) throw new Error("The AI returned an empty response. Please try again.");
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", content: result.response }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reach the AI service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function sendMessage() {
    const content = draft.trim();
    if (!content || isLoading || isFinishing) return;

    const history: ConversationMessage[] = [...messages, { id: `user-${Date.now()}`, role: "user", content }];
    setMessages(history);
    setDraft("");
    track("message_sent", { scenario: scenario.slug });
    void requestAI(history);
  }

  async function finishPractice() {
    if (isLoading || isFinishing) return;
    if (!messages.some((message) => message.role === "user")) {
      setError(t("conversation.needOne"));
      return;
    }

    setIsFinishing(true);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenario.slug, character: scenario.aiRole, messages }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to create your feedback.");
      window.localStorage.setItem(
        `realtalk:feedback:${scenario.slug}`,
        JSON.stringify({ feedback: result.feedback as FeedbackResult, messages }),
      );
      track("practice_finished", {
        scenario: scenario.slug,
        message_count: messages.filter((message) => message.role === "user").length,
      });
      router.push(`/feedback/${scenario.slug}`);
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : "Unable to create your feedback. Please try again.");
      setIsFinishing(false);
    }
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
      <header className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e4e8e3] bg-white text-base text-[#526d5b]">{scenario.icon}</span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-[#202722] sm:text-lg">{t(`scenarioData.${scenario.slug}Title`)}</h1>
            <p className="mt-1 text-xs text-[#78827b]">{t("conversation.talkingWith")} <span className="font-medium text-[#4e5d52]">{aiLabel}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-[#8a938d] sm:block">{t("conversation.practiceTime")} <span className="font-medium text-[#5b665e]">{t("conversation.about3")}</span></p>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dfe4df] bg-white px-3.5 text-xs font-semibold text-[#4e5952] transition-colors hover:border-[#bdcabe] hover:bg-[#f9fbf9]"
          >
            <span aria-hidden="true">🕘</span> {t("conversation.history")}
          </button>
          <button type="button" onClick={finishPractice} disabled={isLoading || isFinishing} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dfe4df] bg-white px-3.5 text-xs font-semibold text-[#4e5952] transition-colors hover:border-[#bdcabe] hover:bg-[#f9fbf9] disabled:cursor-wait disabled:opacity-60">
            {isFinishing ? t("conversation.preparing") : t("conversation.finish")}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-label={`${scenario.title} conversation`} className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#e5e8e4] bg-[#fdfdfc] shadow-[0_12px_40px_-34px_rgba(25,45,32,0.35)]">
          <ConversationWindow messages={messages} aiLabel={aiLabel} isTyping={isLoading} />
          {error && <div className="mx-3 mb-2 flex shrink-0 items-start justify-between gap-3 rounded-xl border border-[#eadbd7] bg-[#fcf7f5] px-4 py-3 text-xs leading-5 text-[#80574f] sm:mx-5" role="alert">
            <span>{error}</span>
            {messages.at(-1)?.role === "user" && <button type="button" className="shrink-0 font-semibold underline" onClick={() => void requestAI(messages)} disabled={isLoading}>Retry response</button>}
          </div>}
          <ChatInput value={draft} onChange={setDraft} onSend={sendMessage} disabled={isLoading || isFinishing} />
        </section>
        <div className="flex min-h-0 flex-col gap-4">
          <CharacterCard scenario={scenario} />
          <div className="hidden rounded-2xl border border-[#e6e8e4] bg-[#f6f8f5] p-4 lg:block">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#87928a]">{t("conversation.yourGoal")}</p>
            <p className="mt-2 text-xs leading-5 text-[#69746c]">{t("conversation.goalText")}</p>
          </div>
        </div>
      </div>

      <HistoryDrawer
        slug={scenario.slug}
        open={historyOpen}
        currentSessionId={sessionId}
        onClose={() => setHistoryOpen(false)}
        onLoad={loadSession}
        onNew={startNew}
        onDeleteCurrent={startNew}
      />
    </main>
  );
}
