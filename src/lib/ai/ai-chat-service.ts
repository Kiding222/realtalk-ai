import type { Scenario } from "@/data/scenarios";
import { buildConversationInstructions } from "@/lib/ai/prompts";
import { generateDeepSeekContent } from "@/lib/ai/deepseek-client";
import type { ChatMessage } from "@/lib/ai/types";

export class AIChatService {
  static async reply(scenario: Scenario, messages: ChatMessage[]) {
    const response = await generateDeepSeekContent([
      { role: "system", content: buildConversationInstructions(scenario) },
      ...messages.map(({ role, content }) => ({ role, content })),
    ], { maxTokens: 180 });

    if (!response) throw new Error("The AI returned an empty response. Please try again.");
    return response;
  }
}
