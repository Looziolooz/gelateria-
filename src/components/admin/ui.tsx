import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Card ---------------- */
export function Card({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl bg-white ring-1 ring-secondary/10 shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            {title && <h3 className="font-semibold text-secondary">{title}</h3>}
            {subtitle && <p className="text-xs text-secondary/55 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ---------------- KPI ---------------- */
export function KpiCard({
  label,
  value,
  sub,
  icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  trend?: string;
  accent?: "primary" | "secondary" | "green";
}) {
  const ring =
    accent === "green" ? "bg-emerald-500/10 text-emerald-600"
    : accent === "secondary" ? "bg-secondary/10 text-secondary"
    : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl bg-white ring-1 ring-secondary/10 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary/55">{label}</p>
        {icon && <span className={cn("grid place-items-center h-9 w-9 rounded-full", ring)}>{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-semibold text-secondary leading-none">{value}</p>
      {(sub || trend) && (
        <p className="mt-2 text-xs text-secondary/55">
          {trend && <span className="text-emerald-600 font-semibold">{trend} </span>}
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Vertical bar chart ---------------- */
export function BarChart({
  data,
  format = (v) => String(v),
  height = 200,
}: {
  data: { label: string; value: number }[];
  format?: (v: number) => string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-stretch gap-2 sm:gap-3" style={{ height }}>
      {data.map((d) => {
        const h = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="flex-1 h-full flex flex-col items-center group">
            <div className="flex-1 w-full flex items-end min-h-0">
              <div
                className="w-full rounded-t-md bg-primary transition-all"
                style={{ height: `${h}%` }}
                title={`${d.label}: ${format(d.value)}`}
              />
            </div>
            <span className="mt-2 text-[10px] text-secondary/60">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Horizontal bar list ---------------- */
export function BarList({
  data,
  format = (v) => String(v),
}: {
  data: { label: string; value: number; sub?: string }[];
  format?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-secondary">{d.label}</span>
            <span className="text-secondary/60">{format(d.value)}{d.sub ? ` · ${d.sub}` : ""}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Donut (conic) ---------------- */
const DONUT_COLORS = ["#ac7b40", "#2c595e", "#a2ae95"];
export function Donut({ data }: { data: { channel: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const stops = data
    .map((d, i) => {
      const start = (acc / total) * 360;
      acc += d.value;
      const end = (acc / total) * 360;
      return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(", ");
  return (
    <div className="flex items-center gap-6">
      <div
        className="relative h-32 w-32 rounded-full shrink-0"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[22%] rounded-full bg-white grid place-items-center">
          <span className="text-xs text-secondary/55">Mix</span>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((d, i) => (
          <li key={d.channel} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-secondary font-medium w-20">{d.channel}</span>
            <span className="text-secondary/60">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Status badge ---------------- */
const STATUS_STYLES: Record<string, string> = {
  Nuovo: "bg-blue-500/12 text-blue-600",
  Confermata: "bg-blue-500/12 text-blue-600",
  "In preparazione": "bg-amber-500/15 text-amber-600",
  Pronto: "bg-emerald-500/15 text-emerald-600",
  Pronta: "bg-emerald-500/15 text-emerald-600",
  Ritirato: "bg-secondary/10 text-secondary/70",
  Ritirata: "bg-secondary/10 text-secondary/70",
  Annullato: "bg-red-500/12 text-red-600",
  Annullata: "bg-red-500/12 text-red-600",
  Disponibile: "bg-emerald-500/15 text-emerald-600",
  "In esaurimento": "bg-amber-500/15 text-amber-600",
  Esaurito: "bg-red-500/12 text-red-600",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status] ?? "bg-secondary/10 text-secondary")}>
      {status}
    </span>
  );
}
