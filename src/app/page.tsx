import {
  CallToActionSection,
  HeroSection,
  HowItWorksSection,
  PersonalStorySection,
  ProblemSection,
  ScenariosSection,
} from "@/components/home/landing-sections";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ScenariosSection />
      <PersonalStorySection />
      <CallToActionSection />
    </main>
  );
}
