import type { ConversationMessage } from "@/components/conversation/message-bubble";

const SESSIONS_KEY = "realtalk:sessions";
const MAX_SESSIONS_PER_SCENARIO = 20;

export type StoredSession = {
  id: string;
  slug: string;
  messages: ConversationMessage[];
  createdAt: number;
  updatedAt: number;
};

export function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readAll(): StoredSession[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredSession);
  } catch {
    return [];
  }
}

function writeAll(sessions: StoredSession[]): void {
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Storage may be full or blocked; drop the write rather than crash.
  }
}

export function loadSessionsBySlug(slug: string): StoredSession[] {
  return readAll()
    .filter((session) => session.slug === slug)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function upsertSession(session: StoredSession): void {
  const sessions = readAll();
  const index = sessions.findIndex((item) => item.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }

  // Keep only the newest sessions for this scenario to bound local storage use.
  const sameScenario = sessions
    .filter((item) => item.slug === session.slug)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const removeIds = sameScenario.slice(MAX_SESSIONS_PER_SCENARIO).map((item) => item.id);
  const kept = sessions.filter((item) => !removeIds.includes(item.id));

  writeAll(kept);
}

export function deleteSession(id: string): void {
  writeAll(readAll().filter((session) => session.id !== id));
}

export function clearSessionsBySlug(slug: string): void {
  writeAll(readAll().filter((session) => session.slug !== slug));
}

function isStoredSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string"
    && typeof record.slug === "string"
    && Array.isArray(record.messages)
    && typeof record.createdAt === "number"
    && typeof record.updatedAt === "number"
  );
}
