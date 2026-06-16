import { Emblem } from "@/components/icons";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative bg-gold-soft overflow-hidden">
      <Emblem className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 text-primary/5 hidden md:block" />
      <div className="site-wrap pt-32 md:pt-44 pb-14 md:pb-20 text-center relative">
        <p className="eyebrow mb-4" data-reveal>{eyebrow}</p>
        <h1 className="display-title display-title--xl" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="lead mx-auto max-w-2xl mt-6" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
