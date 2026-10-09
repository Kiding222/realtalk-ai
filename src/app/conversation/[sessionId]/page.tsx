import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversationExperience } from "@/components/conversation/conversation-experience";
import { getScenarioBySlug } from "@/data/scenarios";

export const metadata: Metadata = { title: "Conversation Practice" };

export default async function ConversationPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId: scenarioSlug } = await params;
  const scenario = getScenarioBySlug(scenarioSlug);

  if (!scenario) notFound();

  return <ConversationExperience scenario={scenario} />;
}
