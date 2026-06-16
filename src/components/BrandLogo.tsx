import { cn } from "@/lib/utils";

/**
 * Wordmark logo for "Artigiano Gelateria" — Fraunces name + Hanken small-caps
 * subtitle, in the bottega palette. `tone` switches between dark text (on light
 * surfaces) and cream text (on dark surfaces).
 */
export function BrandLogo({
  className,
  tone = "dark",
  subtitle = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  subtitle?: boolean;
}) {
  const name = tone === "light" ? "text-cream" : "text-secondary";
  const sub = tone === "light" ? "text-gold" : "text-primary";
  return (
    <span className={cn("inline-flex flex-col leading-none select-none", className)}>
      <span className={cn("caviar font-medium tracking-[0.01em] text-[22px] md:text-[25px]", name)}>
        Artigiano
      </span>
      {subtitle && (
        <span className={cn("core uppercase tracking-[0.34em] text-[8px] md:text-[9px] mt-1", sub)}>
          Gelateria · dal 1978
        </span>
      )}
    </span>
  );
}
