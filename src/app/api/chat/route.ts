import { NextResponse } from "next/server";
import { AIChatService } from "@/lib/ai/ai-chat-service";
import { AIServiceError } from "@/lib/ai/types";
import { validateConversationRequest } from "@/lib/ai/request-validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = validateConversationRequest(body);
  if (!input) return NextResponse.json({ error: "Invalid scenario or conversation messages." }, { status: 400 });

  try {
    const response = await AIChatService.reply(input.scenario, input.messages);
    return NextResponse.json({ response });
  } catch (error) {
    if (error instanceof AIServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Chat request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to get an AI response." }, { status: 502 });
  }
}
