import { Boxes, AlertTriangle, XCircle, Leaf } from "lucide-react";
import { INVENTORY_WITH_STATUS } from "@/lib/admin-data";
import { KpiCard } from "@/components/admin/ui";
import { InventoryTable } from "@/components/admin/InventoryTable";

export default function MercePage() {
  const total = INVENTORY_WITH_STATUS.length;
  const low = INVENTORY_WITH_STATUS.filter((i) => i.status === "In esaurimento").length;
  const out = INVENTORY_WITH_STATUS.filter((i) => i.status === "Esaurito").length;
  const vegan = INVENTORY_WITH_STATUS.filter((i) => i.vegan && i.category !== "Ingrediente").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Prodotti a magazzino" value={String(total)} sub="gusti + ingredienti" icon={<Boxes size={18} />} accent="secondary" />
        <KpiCard label="In esaurimento" value={String(low)} sub="sotto scorta minima" icon={<AlertTriangle size={18} />} accent="primary" />
        <KpiCard label="Esauriti" value={String(out)} sub="da riordinare subito" icon={<XCircle size={18} />} />
        <KpiCard label="Gusti vegani" value={String(vegan)} sub="disponibili" icon={<Leaf size={18} />} accent="green" />
      </div>

      <InventoryTable />
    </div>
  );
}
