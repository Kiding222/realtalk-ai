import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`mx-auto min-h-[calc(100vh-145px)] w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 ${className}`}>{children}</main>;
}
