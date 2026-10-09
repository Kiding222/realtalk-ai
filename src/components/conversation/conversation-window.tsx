"use client";

import { useEffect, useRef } from "react";
import { MessageBubble, type ConversationMessage } from "@/components/conversation/message-bubble";
import { useLanguage } from "@/lib/i18n/language-provider";

export function ConversationWindow({
  messages,
  aiLabel,
  isTyping,
}: {
  messages: ConversationMessage[];
  aiLabel: string;
  isTyping: boolean;
}) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest messages in view by scrolling only this inner container.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#eceeeb] px-4 py-3 sm:px-6">
        <p className="text-xs font-medium text-[#4e5952]">{t("conversation.windowTitle")}</p>
        <p className="flex items-center gap-2 text-[10px] text-[#929a94]"><span className="size-1.5 rounded-full bg-[#6a9a77]" /> {t("conversation.aiRoleplay")}</p>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {messages.map((message) => <MessageBubble key={message.id} message={message} aiLabel={aiLabel} />)}
          {isTyping && (
            <div className="flex items-end gap-2.5" role="status" aria-label="typing">
              <span className="flex size-8 items-center justify-center rounded-full border border-[#e5e9e5] bg-white text-xs text-[#58715f]">✳</span>
              <div className="rounded-2xl rounded-bl-md border border-[#e9ebe8] bg-white px-4 py-3">
                <span className="flex items-center gap-1.5"><i className="size-1.5 animate-pulse rounded-full bg-[#7c8980]" /><i className="size-1.5 animate-pulse rounded-full bg-[#7c8980] [animation-delay:150ms]" /><i className="size-1.5 animate-pulse rounded-full bg-[#7c8980] [animation-delay:300ms]" /></span>
                <span className="ml-2 text-[10px] text-[#87918a]">{t("conversation.thinking")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
