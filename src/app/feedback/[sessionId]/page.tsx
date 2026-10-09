import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedbackReport } from "@/components/feedback/feedback-report";
import { PageShell } from "@/components/layout/page-shell";
import { getScenarioBySlug } from "@/data/scenarios";

export const metadata: Metadata = { title: "Practice Result" };

export default async function FeedbackPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const scenario = getScenarioBySlug(sessionId);
  if (!scenario) notFound();

  return <PageShell><FeedbackReport scenario={scenario} /></PageShell>;
}
