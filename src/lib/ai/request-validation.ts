import { getScenarioBySlug, type Scenario } from "@/data/scenarios";
import type { ChatMessage, ConversationRequest } from "@/lib/ai/types";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_TOTAL_LENGTH = 12_000;

export function validateConversationRequest(value: unknown): { scenario: Scenario; messages: ChatMessage[] } | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Partial<ConversationRequest>;
  if (typeof body.scenario !== "string" || typeof body.character !== "string" || body.character.length > 100) return null;
  const scenario = getScenarioBySlug(body.scenario);
  if (!scenario || !Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) return null;

  const messages: ChatMessage[] = [];
  let totalLength = 0;
  for (const item of body.messages) {
    if (!item || typeof item !== "object") return null;
    const message = item as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string") return null;
    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return null;
    totalLength += content.length;
    if (totalLength > MAX_TOTAL_LENGTH) return null;
    messages.push({ role: message.role, content });
  }

  if (messages[messages.length - 1]?.role !== "user") return null;
  return { scenario, messages };
}

export function validateFeedbackRequest(value: unknown): { scenario: Scenario; messages: ChatMessage[] } | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Partial<ConversationRequest>;
  if (typeof body.scenario !== "string") return null;
  const scenario = getScenarioBySlug(body.scenario);
  if (!scenario || !Array.isArray(body.messages) || body.messages.length < 2 || body.messages.length > MAX_MESSAGES) return null;

  const messages: ChatMessage[] = [];
  let totalLength = 0;
  let hasUserMessage = false;
  for (const item of body.messages) {
    if (!item || typeof item !== "object") return null;
    const message = item as Record<string, unknown>;
    if ((message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string") return null;
    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return null;
    totalLength += content.length;
    if (totalLength > MAX_TOTAL_LENGTH) return null;
    hasUserMessage ||= message.role === "user";
    messages.push({ role: message.role, content });
  }

  if (!hasUserMessage) return null;
  return { scenario, messages };
}
