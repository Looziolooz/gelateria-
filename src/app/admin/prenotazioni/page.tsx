import { CalendarCheck, Clock, CheckCircle2, Banknote, IceCream } from "lucide-react";
import { BOOKINGS, BOOKING_KPIS, euro } from "@/lib/admin-data";
import { Card, KpiCard, StatusBadge } from "@/components/admin/ui";

export default function PrenotazioniPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Prenotazioni oggi" value={String(BOOKING_KPIS.oggi)} sub="ritiri in programma" icon={<CalendarCheck size={18} />} />
        <KpiCard label="Da preparare" value={String(BOOKING_KPIS.inAttesa)} sub="confermate + in preparazione" icon={<Clock size={18} />} accent="secondary" />
        <KpiCard label="Pronte al ritiro" value={String(BOOKING_KPIS.pronte)} sub="in attesa del cliente" icon={<CheckCircle2 size={18} />} accent="green" />
        <KpiCard label="Valore oggi" value={euro(BOOKING_KPIS.valoreOggi)} sub="ritiri di oggi" icon={<Banknote size={18} />} />
      </div>

      <Card title="Prenotazioni pickup" subtitle="Ordini e ritiri dalla pagina /pickup · dati dimostrativi">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-secondary/50 border-b border-secondary/10">
                <th className="px-2 py-3 font-semibold">Codice</th>
                <th className="px-2 py-3 font-semibold">Cliente</th>
                <th className="px-2 py-3 font-semibold hidden md:table-cell">Gelateria</th>
                <th className="px-2 py-3 font-semibold">Formato</th>
                <th className="px-2 py-3 font-semibold hidden lg:table-cell">Gusti</th>
                <th className="px-2 py-3 font-semibold hidden sm:table-cell">Ritiro</th>
                <th className="px-2 py-3 font-semibold text-right">Totale</th>
                <th className="px-2 py-3 font-semibold">Stato</th>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((b) => (
                <tr key={b.id} className="border-b border-secondary/5 hover:bg-gold-soft/40 align-top">
                  <td className="px-2 py-3 font-semibold text-secondary whitespace-nowrap">{b.id}</td>
                  <td className="px-2 py-3">
                    <div className="font-medium text-secondary">{b.customer}</div>
                    <div className="text-xs text-secondary/50">{b.phone}</div>
                  </td>
                  <td className="px-2 py-3 text-secondary/70 hidden md:table-cell whitespace-nowrap">{b.boutiqueLabel}</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-secondary"><IceCream size={14} className="text-primary" /> {b.format}</span>
                  </td>
                  <td className="px-2 py-3 text-secondary/70 hidden lg:table-cell max-w-[280px]">{b.flavors.join(", ")}</td>
                  <td className="px-2 py-3 text-secondary/70 hidden sm:table-cell whitespace-nowrap">{b.date.slice(8)}/{b.date.slice(5, 7)} · {b.time}</td>
                  <td className="px-2 py-3 text-right font-semibold text-secondary whitespace-nowrap">{euro(b.total)}</td>
                  <td className="px-2 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-2 pt-4 text-xs text-secondary/50">{BOOKINGS.length} prenotazioni · sincronizzate con la pagina Pickup</p>
      </Card>
    </div>
  );
}
