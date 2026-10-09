export type ScenarioDifficulty = "Easy" | "Medium" | "Hard";

export type Scenario = {
  slug: string;
  title: string;
  description: string;
  aiRole: string;
  characterTitle: string;
  characterRole: string;
  characterGoal: string;
  difficulty: ScenarioDifficulty;
  example: string;
  icon: string;
  category: string;
};

export const scenarios = [
  {
    slug: "airport",
    title: "Airport Immigration",
    description: "Practice answering questions from a US immigration officer.",
    aiRole: "CBP Officer",
    characterTitle: "Airport Officer",
    characterRole: "Immigration officer",
    characterGoal: "Ask normal entry questions and help you explain your trip.",
    difficulty: "Medium",
    example: "What's the purpose of your visit?",
    icon: "✈",
    category: "TRAVEL",
  },
  {
    slug: "restaurant",
    title: "Restaurant Ordering",
    description: "Practice ordering food naturally in an American restaurant.",
    aiRole: "Restaurant Staff",
    characterTitle: "Restaurant Staff",
    characterRole: "Restaurant employee",
    characterGoal: "Take your order and help with menu questions.",
    difficulty: "Easy",
    example: "What would you like to order?",
    icon: "◒",
    category: "EVERYDAY",
  },
  {
    slug: "workplace",
    title: "Workplace Conversation",
    description: "Practice communication with an American coworker or manager.",
    aiRole: "Manager",
    characterTitle: "Your Manager",
    characterRole: "American workplace manager",
    characterGoal: "Talk through a project update and agree on next steps.",
    difficulty: "Hard",
    example: "Can you finish this task by Friday?",
    icon: "⌘",
    category: "CAREER",
  },
] as const satisfies readonly Scenario[];

export function getScenarioBySlug(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}
