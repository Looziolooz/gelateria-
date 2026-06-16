import { TrendingUp, Banknote, Store, CalendarRange } from "lucide-react";
import {
  REVENUE_MONTHLY, REVENUE_BY_BOUTIQUE, CHANNEL_SPLIT, euro,
} from "@/lib/admin-data";
import { Card, KpiCard, BarChart, BarList, Donut } from "@/components/admin/ui";

export default function FatturatoPage() {
  const current = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 1].revenue;
  const prev = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 2].revenue;
  const growth = Math.round(((current - prev) / prev) * 1000) / 10;
  const total10 = REVENUE_MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = REVENUE_BY_BOUTIQUE.reduce((s, b) => s + b.orders, 0);
  const avgTicket = total10 / totalOrders;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Fatturato giugno" value={euro(current)} trend={`+${growth}%`} sub="vs maggio" icon={<Banknote size={18} />} />
        <KpiCard label="Ultimi 10 mesi" value={euro(total10)} sub="totale cumulato" icon={<CalendarRange size={18} />} accent="secondary" />
        <KpiCard label="Scontrino medio" value={euro(avgTicket)} sub="sul periodo" icon={<TrendingUp size={18} />} accent="green" />
        <KpiCard label="Boutique attive" value={String(REVENUE_BY_BOUTIQUE.length)} sub="Milano + Roma" icon={<Store size={18} />} />
      </div>

      <Card title="Andamento del fatturato" subtitle="Ricavi mensili — set 2025 / giu 2026">
        <BarChart data={REVENUE_MONTHLY.map((m) => ({ label: m.month, value: m.revenue }))} format={(v) => euro(v)} height={260} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Fatturato per boutique" subtitle="Mese corrente">
          <BarList
            data={REVENUE_BY_BOUTIQUE.map((b) => ({ label: `${b.boutique}`, value: b.revenue, sub: `${b.orders} ordini` }))}
            format={(v) => euro(v)}
          />
        </Card>
        <Card title="Mix per canale" subtitle="Quota sul fatturato">
          <Donut data={CHANNEL_SPLIT} />
          <p className="mt-5 text-xs text-secondary/55">
            Il canale <span className="font-semibold text-primary">Pickup</span> è in crescita costante:
            sempre più clienti ordinano e ritirano in boutique.
          </p>
        </Card>
      </div>

      <Card title="Dettaglio per boutique">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-secondary/50 border-b border-secondary/10">
                <th className="py-3 pr-4 font-semibold">Boutique</th>
                <th className="py-3 pr-4 font-semibold">Città</th>
                <th className="py-3 pr-4 font-semibold text-right">Ordini</th>
                <th className="py-3 pr-4 font-semibold text-right">Fatturato</th>
                <th className="py-3 font-semibold text-right">Scontrino medio</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_BY_BOUTIQUE.map((b) => (
                <tr key={b.boutique} className="border-b border-secondary/5 last:border-0">
                  <td className="py-3 pr-4 font-medium text-secondary">{b.boutique}</td>
                  <td className="py-3 pr-4 text-secondary/70">{b.city}</td>
                  <td className="py-3 pr-4 text-right text-secondary/70">{b.orders}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-secondary">{euro(b.revenue)}</td>
                  <td className="py-3 text-right text-secondary/70">{euro(b.revenue / b.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
