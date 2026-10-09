import type { Scenario } from "@/data/scenarios";
import { generateDeepSeekContent } from "@/lib/ai/deepseek-client";
import { feedbackInstructions } from "@/lib/ai/prompts";
import type { ChatMessage, FeedbackResult } from "@/lib/ai/types";

const feedbackSchema = {
  type: "object",
  additionalProperties: false,
  required: ["grammar_score", "naturalness_score", "strengths", "improvements", "cultural_tips"],
  properties: {
    grammar_score: { type: "integer", minimum: 0, maximum: 100 },
    naturalness_score: { type: "integer", minimum: 0, maximum: 100 },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    cultural_tips: { type: "array", items: { type: "string" } },
  },
} as const;

export class FeedbackAnalyzer {
  static async analyze(scenario: Scenario, messages: ChatMessage[]): Promise<FeedbackResult> {
    const transcript = messages.map(({ role, content }) => `${role === "user" ? "Learner" : "Conversation partner"}: ${content}`).join("\n");
    const output = await generateDeepSeekContent([
      {
        role: "system",
        content: `${feedbackInstructions}\n\nReturn one valid JSON object with exactly these fields: grammar_score (integer 0-100), naturalness_score (integer 0-100), strengths (array of strings), improvements (array of strings), cultural_tips (array of strings).\n\nScenario: ${scenario.title}. Conversation partner: ${scenario.aiRole}. Context: ${scenario.description}`,
      },
      { role: "user", content: `Review this complete practice conversation:\n\n${transcript}` },
    ], { maxTokens: 700, jsonMode: true });

    try {
      const result: unknown = JSON.parse(output);
      if (!isFeedbackResult(result)) throw new Error("Unexpected feedback format");
      return result;
    } catch {
      throw new Error("The AI returned feedback in an unexpected format. Please try again.");
    }
  }
}

function isFeedbackResult(value: unknown): value is FeedbackResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return Number.isInteger(result.grammar_score) && Number(result.grammar_score) >= 0 && Number(result.grammar_score) <= 100
    && Number.isInteger(result.naturalness_score) && Number(result.naturalness_score) >= 0 && Number(result.naturalness_score) <= 100
    && Array.isArray(result.strengths) && result.strengths.every((item) => typeof item === "string")
    && Array.isArray(result.improvements) && result.improvements.every((item) => typeof item === "string")
    && Array.isArray(result.cultural_tips) && result.cultural_tips.every((item) => typeof item === "string");
}
