import type { Metadata } from "next";
import { ScenariosClient } from "@/components/scenarios/scenarios-client";

export const metadata: Metadata = { title: "Choose your real-world scenario" };

export default function ScenariosPage() {
  return <ScenariosClient />;
}
