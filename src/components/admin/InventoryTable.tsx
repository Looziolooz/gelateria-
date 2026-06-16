"use client";

import { useMemo, useState } from "react";
import { Search, Leaf, WheatOff } from "lucide-react";
import { INVENTORY_WITH_STATUS, euro } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Tutte", "Creme", "Frutta", "Cioccolato", "Specialità", "Ingrediente"] as const;

export function InventoryTable() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tutte");

  const rows = useMemo(() => {
    return INVENTORY_WITH_STATUS.filter((i) => {
      const matchCat = cat === "Tutte" || i.category === cat;
      const needle = q.trim().toLowerCase();
      const matchQ = !needle || i.name.toLowerCase().includes(needle);
      return matchCat && matchQ;
    });
  }, [q, cat]);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-secondary/10 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-secondary/10">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca gusto o ingrediente…"
            className="pf-input pl-9 py-2"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                cat === c ? "bg-primary text-white" : "bg-secondary/8 text-secondary/70 hover:bg-secondary/15"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-secondary/50 border-b border-secondary/10">
              <th className="px-4 py-3 font-semibold">Prodotto</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Categoria</th>
              <th className="px-4 py-3 font-semibold">Giacenza</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Scorta min.</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">Prezzo/cono</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const pct = Math.min(100, Math.round((i.stockKg / Math.max(i.parKg, 1)) * 100));
              const barColor =
                i.status === "Esaurito" ? "bg-red-500"
                : i.status === "In esaurimento" ? "bg-amber-500"
                : "bg-emerald-500";
              return (
                <tr key={i.id} className="border-b border-secondary/5 hover:bg-gold-soft/40">
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary flex items-center gap-2">
                      {i.name}
                      {i.vegan && <Leaf size={13} className="text-emerald-600" aria-label="Vegan" />}
                      {i.glutenFree && <WheatOff size={13} className="text-amber-600" aria-label="Gluten free" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary/70 hidden sm:table-cell">{i.category}</td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center justify-between text-xs text-secondary/60 mb-1">
                      <span>{i.stockKg.toFixed(1)} kg</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/10 overflow-hidden">
                      <div className={cn("h-full rounded-full", barColor)} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary/70 hidden md:table-cell">{i.parKg} kg</td>
                  <td className="px-4 py-3 text-secondary/70 hidden lg:table-cell">{i.pricePerScoop ? euro(i.pricePerScoop) : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-secondary/50">
                  Nessun prodotto trovato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 text-xs text-secondary/50 border-t border-secondary/10">
        {rows.length} prodotti · dati dimostrativi
      </div>
    </div>
  );
}
