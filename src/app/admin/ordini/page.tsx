"use client";

import { ShoppingBag, Clock, CheckCircle2, Banknote } from "lucide-react";
import { getOrders, euro } from "@/lib/admin-data";
import { useAdminScope } from "@/components/admin/AdminScope";
import { KpiCard } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default function OrdiniPage() {
  const { scope } = useAdminScope();
  const orders = getOrders(scope);
  const active = orders.filter((o) => o.status === "Nuovo" || o.status === "In preparazione").length;
  const ready = orders.filter((o) => o.status === "Pronto").length;
  const pickup = orders.filter((o) => o.channel === "Pickup").length;
  const totalValue = orders.filter((o) => o.status !== "Annullato").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Da evadere" value={String(active)} sub="nuovi + in preparazione" icon={<Clock size={18} />} />
        <KpiCard label="Pronti al ritiro" value={String(ready)} sub="in attesa del cliente" icon={<CheckCircle2 size={18} />} accent="green" />
        <KpiCard label="Ordini pickup" value={String(pickup)} sub="su totale ordini" icon={<ShoppingBag size={18} />} accent="secondary" />
        <KpiCard label="Valore ordini" value={euro(totalValue)} sub="periodo visualizzato" icon={<Banknote size={18} />} />
      </div>

      <OrdersTable scope={scope} />
    </div>
  );
}
