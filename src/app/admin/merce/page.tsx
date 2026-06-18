"use client";

import { Boxes, AlertTriangle, XCircle, Leaf } from "lucide-react";
import { getInventory, scopeLabel } from "@/lib/admin-data";
import { useAdminScope } from "@/components/admin/AdminScope";
import { KpiCard } from "@/components/admin/ui";
import { InventoryTable } from "@/components/admin/InventoryTable";

export default function MercePage() {
  const { scope } = useAdminScope();
  const inv = getInventory(scope);
  const total = inv.length;
  const low = inv.filter((i) => i.status === "In esaurimento").length;
  const out = inv.filter((i) => i.status === "Esaurito").length;
  const vegan = inv.filter((i) => i.vegan && i.category !== "Ingrediente").length;
  const stockSub = scope === "all" ? "giacenza totale delle 3 botteghe" : `giacenza · ${scopeLabel(scope)}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Prodotti a magazzino" value={String(total)} sub={stockSub} icon={<Boxes size={18} />} accent="secondary" />
        <KpiCard label="In esaurimento" value={String(low)} sub="sotto scorta minima" icon={<AlertTriangle size={18} />} accent="primary" />
        <KpiCard label="Esauriti" value={String(out)} sub="da riordinare subito" icon={<XCircle size={18} />} />
        <KpiCard label="Gusti vegani" value={String(vegan)} sub="disponibili" icon={<Leaf size={18} />} accent="green" />
      </div>

      <InventoryTable scope={scope} />
    </div>
  );
}
