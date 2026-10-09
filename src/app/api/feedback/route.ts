import { NextResponse } from "next/server";
import { FeedbackAnalyzer } from "@/lib/ai/feedback-analyzer";
import { AIServiceError } from "@/lib/ai/types";
import { validateFeedbackRequest } from "@/lib/ai/request-validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = validateFeedbackRequest(body);
  if (!input) return NextResponse.json({ error: "Send a valid scenario and completed conversation." }, { status: 400 });

  try {
    const feedback = await FeedbackAnalyzer.analyze(input.scenario, input.messages);
    return NextResponse.json({ feedback });
  } catch (error) {
    if (error instanceof AIServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Feedback request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to analyze this conversation." }, { status: 502 });
  }
}
