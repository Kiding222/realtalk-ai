"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearSessionsBySlug,
  deleteSession,
  loadSessionsBySlug,
  type StoredSession,
} from "@/lib/history/chat-history";
import { useLanguage } from "@/lib/i18n/language-provider";

export function HistoryDrawer({
  slug,
  open,
  currentSessionId,
  onClose,
  onLoad,
  onNew,
  onDeleteCurrent,
}: {
  slug: string;
  open: boolean;
  currentSessionId: string;
  onClose: () => void;
  onLoad: (session: StoredSession) => void;
  onNew: () => void;
  onDeleteCurrent: () => void;
}) {
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState<StoredSession[]>([]);

  const reload = useCallback(() => {
    setSessions(loadSessionsBySlug(slug));
  }, [slug]);

  useEffect(() => {
    if (open) reload();
  }, [open, reload]);

  function handleDelete(id: string) {
    deleteSession(id);
    reload();
    if (id === currentSessionId) onDeleteCurrent();
  }

  function handleClear() {
    clearSessionsBySlug(slug);
    reload();
    onDeleteCurrent();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("history.title")}>
      <button type="button" aria-label="close" className="absolute inset-0 bg-[#141816]/30" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-[#e6e8e4] bg-[#fbfcfa] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e8ebe7] px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight text-[#202722]">{t("history.title")}</h2>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-[#77817a] hover:bg-[#eef2ee]" aria-label="close">✕</button>
        </div>

        <div className="border-b border-[#e8ebe7] px-5 py-3">
          <button
            type="button"
            onClick={onNew}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#202722] px-4 text-xs font-semibold text-white hover:bg-[#37423b]"
          >
            + {t("history.new")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {sessions.length === 0 ? (
            <p className="mt-10 text-center text-xs text-[#8a938d]">{t("history.empty")}</p>
          ) : (
            <ul className="space-y-2.5">
              {sessions.map((session) => {
                const userCount = session.messages.filter((message) => message.role === "user").length;
                const firstUser = session.messages.find((message) => message.role === "user");
                const previewSource = (firstUser ?? session.messages[0])?.content ?? "";
                const preview = previewSource.length > 44 ? `${previewSource.slice(0, 44)}…` : previewSource;
                const isCurrent = session.id === currentSessionId;
                return (
                  <li key={session.id} className="rounded-xl border border-[#e6e8e4] bg-white p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-[#929a94]">{formatTime(session.updatedAt, lang)}</span>
                      {isCurrent && <span className="rounded-full bg-[#e8eee9] px-2 py-0.5 text-[9px] font-semibold text-[#4f7059]">{t("history.current")}</span>}
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-[#414a44]">{preview}</p>
                    <p className="mt-1 text-[10px] text-[#929a94]">{t("history.messages", { n: userCount })}</p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(session.id)}
                        className="rounded-md px-2 py-1 text-[10px] font-medium text-[#a07a72] hover:bg-[#f7efed]"
                      >
                        {t("history.delete")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onLoad(session)}
                        className="rounded-md bg-[#202722] px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-[#37423b]"
                      >
                        {t("history.load")}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {sessions.length > 0 && (
          <div className="border-t border-[#e8ebe7] px-5 py-3">
            <button type="button" onClick={handleClear} className="text-[11px] font-medium text-[#a07a72] hover:underline">
              {t("history.clear")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(timestamp: number, lang: "en" | "zh"): string {
  return new Date(timestamp).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
