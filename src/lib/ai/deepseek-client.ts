import { AIServiceError } from "@/lib/ai/types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateDeepSeekContent(
  messages: DeepSeekMessage[],
  options: { maxTokens?: number; jsonMode?: boolean } = {},
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new AIServiceError("DeepSeek is not configured. Add DEEPSEEK_API_KEY to .env.local and restart the server.", 503);
  }

  let response: Response;
  try {
    response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages,
        max_tokens: options.maxTokens ?? 300,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? error.cause : undefined;
    const causeCode = cause && typeof cause === "object" && "code" in cause
      ? String(cause.code)
      : undefined;
    console.error("DeepSeek API connection failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      causeCode,
      message: error instanceof Error ? error.message : "Unknown connection error",
    });
    throw new AIServiceError("The server cannot connect to DeepSeek. Check this computer's network or VPN, then try again.", 502);
  }

  if (!response.ok) {
    console.error("DeepSeek API request failed", { status: response.status });
    if (response.status === 401) {
      throw new AIServiceError("DeepSeek rejected the API key. Check DEEPSEEK_API_KEY in .env.local.", 502);
    }
    if (response.status === 402) {
      throw new AIServiceError("The DeepSeek account has insufficient balance. Check its API billing page.", 402);
    }
    if (response.status === 429) {
      throw new AIServiceError("DeepSeek is rate limiting requests. Please wait a moment and try again.", 429);
    }
    throw new AIServiceError("DeepSeek could not complete this request. Check the model and request settings.", 502);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") return "";
  const message = (choices[0] as { message?: { content?: unknown } }).message;
  return typeof message?.content === "string" ? message.content.trim() : "";
}
