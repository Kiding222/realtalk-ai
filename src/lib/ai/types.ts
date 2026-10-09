export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type FeedbackResult = {
  grammar_score: number;
  naturalness_score: number;
  strengths: string[];
  improvements: string[];
  cultural_tips: string[];
};

export type ConversationRequest = {
  scenario: string;
  messages: ChatMessage[];
  character: string;
};

export class AIServiceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AIServiceError";
  }
}
