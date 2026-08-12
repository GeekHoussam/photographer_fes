import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const styles = {
  primary:
    "group/button relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-paper px-6 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink transition-all duration-500 ease-[var(--ease-out)] hover:bg-sand focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-4 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-45",
  inverse:
    "group/button relative inline-flex min-h-12 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full bg-ink px-6 text-[0.68rem] font-bold whitespace-nowrap uppercase tracking-[0.15em] text-paper transition-all duration-500 ease-[var(--ease-out)] hover:bg-surface focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-4 focus-visible:ring-offset-sand disabled:cursor-not-allowed disabled:opacity-45",
  secondary:
    "group/button relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full border border-current/25 px-6 text-[0.68rem] font-bold uppercase tracking-[0.15em] transition-all duration-500 ease-[var(--ease-out)] hover:border-sand hover:text-sand focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-4 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-45",
  text: "group/button inline-flex min-h-11 items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.15em] underline decoration-current/25 underline-offset-8 transition-colors hover:text-sand",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Link href={href} className={`${styles[variant]} ${className}`}>
      <span className="relative z-10">{children}</span>
      {showArrow ? (
        <ArrowUpRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
        />
      ) : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
}) {
  return <button className={`${styles[variant]} ${className}`} {...props} />;
}
