"use client";

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useLanguage } from "@/lib/i18n/language-provider";

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasDisabledRef = useRef(false);

  // Put the cursor back in the box once the AI reply finishes and typing is allowed again.
  useEffect(() => {
    if (wasDisabledRef.current && !disabled) {
      inputRef.current?.focus();
    }
    wasDisabledRef.current = disabled;
  }, [disabled]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSend();
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <form onSubmit={submit} className="shrink-0 border-t border-[#eceeeb] bg-white p-3 sm:px-5 sm:py-4">
      <div className="mx-auto flex max-w-2xl items-end gap-3 rounded-xl border border-[#e2e6e1] bg-[#fbfcfa] p-2 pl-4 transition-colors focus-within:border-[#a9bdad]">
        <label className="sr-only" htmlFor="chat-answer">{t("chatInput.placeholder")}</label>
        <textarea
          ref={inputRef}
          id="chat-answer"
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chatInput.placeholder")}
          disabled={disabled}
          className="max-h-32 min-h-9 flex-1 resize-y bg-transparent py-2 text-sm leading-5 text-[#28332c] outline-none placeholder:text-[#9aa29c] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg bg-[#202722] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#37423b] disabled:cursor-not-allowed disabled:bg-[#d8ddd8]"
        >
          {t("chatInput.send")} <span aria-hidden="true">↑</span>
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-2xl text-[10px] text-[#9aa29c]">{t("chatInput.hint")}</p>
    </form>
  );
}
