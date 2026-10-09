import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RealTalk AI — Real-world English conversation practice", template: "%s | RealTalk AI" },
  description: "AI-powered simulations for the English conversations you will face abroad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-dvh flex-col overflow-hidden">
        <LanguageProvider>
          <SiteHeader />
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          <SiteFooter />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
