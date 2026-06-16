"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ORDERS, euro, type OrderStatus } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const STATUSES: (OrderStatus | "Tutti")[] = [
  "Tutti", "Nuovo", "In preparazione", "Pronto", "Ritirato", "Annullato",
];

export function OrdersTable() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Tutti");

  const rows = useMemo(() => {
    return ORDERS.filter((o) => {
      const matchStatus = status === "Tutti" || o.status === status;
      const needle = q.trim().toLowerCase();
      const matchQ =
        !needle ||
        o.id.toLowerCase().includes(needle) ||
        o.customer.toLowerCase().includes(needle) ||
        o.boutiqueLabel.toLowerCase().includes(needle);
      return matchStatus && matchQ;
    });
  }, [q, status]);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-secondary/10 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-secondary/10">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca ordine, cliente, boutique…"
            className="pf-input pl-9 py-2"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                status === s ? "bg-primary text-white" : "bg-secondary/8 text-secondary/70 hover:bg-secondary/15"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-secondary/50 border-b border-secondary/10">
              <th className="px-4 py-3 font-semibold">Ordine</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Boutique</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">Gusti</th>
              <th className="px-4 py-3 font-semibold">Canale</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Ritiro</th>
              <th className="px-4 py-3 font-semibold text-right">Totale</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-secondary/5 hover:bg-gold-soft/40">
                <td className="px-4 py-3 font-semibold text-secondary whitespace-nowrap">{o.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-secondary">{o.customer}</div>
                  <div className="text-xs text-secondary/50">{o.phone}</div>
                </td>
                <td className="px-4 py-3 text-secondary/70 hidden md:table-cell whitespace-nowrap">{o.boutiqueLabel}</td>
                <td className="px-4 py-3 text-secondary/70 hidden lg:table-cell">
                  {o.items.map((it) => `${it.qty}× ${it.flavor}`).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                    o.channel === "Pickup" ? "bg-primary/12 text-primary" : "bg-secondary/10 text-secondary/70"
                  )}>
                    {o.channel}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary/70 hidden sm:table-cell whitespace-nowrap">{o.date.slice(8)}/{o.date.slice(5,7)} · {o.time}</td>
                <td className="px-4 py-3 text-right font-semibold text-secondary whitespace-nowrap">{euro(o.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-secondary/50">
                  Nessun ordine corrisponde ai filtri.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 text-xs text-secondary/50 border-t border-secondary/10">
        {rows.length} ordini · dati dimostrativi
      </div>
    </div>
  );
}
