import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>;

const variants = {
  primary: "bg-[#176b52] text-white shadow-sm hover:bg-[#10553f]",
  secondary: "border border-[#dfe5df] bg-white text-[#24352d] hover:border-[#b9c9be] hover:bg-[#f7faf7]",
  quiet: "text-[#52635a] hover:bg-[#f0f3ef]",
};

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b52] ${variants[variant]} ${className}`;
  if (href) return <Link className={classes} href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</Link>;
  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
