"use client";

import { useLanguage } from "@/lib/i18n/language-provider";

export type ConversationMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

export function MessageBubble({ message, aiLabel }: { message: ConversationMessage; aiLabel: string }) {
  const { t } = useLanguage();
  const isUser = message.role === "user";
  const youLabel = t("hero.you");

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <span className="mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e5e9e5] bg-white text-xs text-[#58715f]">✳</span>}
      <div className={`flex max-w-[min(85%,38rem)] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <span className="mb-1.5 px-1 text-[9px] font-semibold tracking-[0.12em] text-[#939b95]">{isUser ? youLabel : aiLabel.toUpperCase()}</span>
        <p className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "rounded-br-md bg-[#202722] text-white" : "rounded-bl-md border border-[#e9ebe8] bg-white text-[#333c36]"}`}>
          {message.content}
        </p>
      </div>
      {isUser && <span className="mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9eeea] text-[10px] font-semibold text-[#52675a]">{youLabel}</span>}
    </div>
  );
}
