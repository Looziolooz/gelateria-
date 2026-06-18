import { Emblem } from "@/components/icons";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  panel = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** render as a full-viewport horizontal-scroll panel (centered) */
  panel?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative bg-gold-soft overflow-hidden",
        panel && "w-[100svw] h-[100svh] shrink-0 flex items-center"
      )}
    >
      <Emblem className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 md:h-96 md:w-96 text-primary/5 hidden md:block" />
      <hr className="rule-gold absolute top-0 inset-x-0 opacity-70" />
      <div
        className={cn(
          "site-wrap text-center relative",
          panel ? "py-16" : "pt-32 md:pt-44 pb-14 md:pb-20"
        )}
      >
        <p className="eyebrow mb-4" data-reveal>{eyebrow}</p>
        <h1 className="display-title display-title--xl" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="lead mx-auto max-w-2xl mt-6" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            {subtitle}
          </p>
        )}
        {panel && (
          <div data-reveal className="mt-10 flex items-center justify-center gap-3 text-secondary/55" style={{ ["--reveal-delay" as string]: "240ms" }}>
            <span className="core t-u text-[11px]" style={{ letterSpacing: "0.24em" }}>Scorri</span>
            <span className="cue-nudge text-primary">→</span>
          </div>
        )}
      </div>
    </section>
  );
}
