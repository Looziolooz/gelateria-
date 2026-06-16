"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Clock, MapPin, Phone, Check, CalendarDays, ShoppingBag, ArrowLeft, IceCream,
} from "lucide-react";
import {
  BOUTIQUES, type Boutique, type City,
  FORMATS, FLAVORS, BOUTIQUE_FLAVORS, flavorById,
} from "@/lib/data";
import {
  generateSlots, isClosedOn, formatDateLong, upcomingDays,
  WEEKDAYS_SHORT_IT, MONTHS_IT,
} from "@/lib/pickup";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Milano", "Roma"];

export function PickupForm() {
  const now = useMemo(() => new Date(), []);
  const days = useMemo(() => upcomingDays(now, 14), [now]);

  const [boutiqueId, setBoutiqueId] = useState<string>(BOUTIQUES[0].id);
  const [formatId, setFormatId] = useState<string>(FORMATS[0].id);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [dateIdx, setDateIdx] = useState<number>(0);
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const boutique = BOUTIQUES.find((b) => b.id === boutiqueId) as Boutique;
  const format = FORMATS.find((f) => f.id === formatId)!;
  const maxFlavors = format.maxFlavors;
  const selectedDate = days[dateIdx];
  const slots = useMemo(
    () => generateSlots(boutique, selectedDate, now),
    [boutique, selectedDate, now]
  );
  const availableFlavors = useMemo(
    () => (BOUTIQUE_FLAVORS[boutiqueId] ?? []).map(flavorById).filter(Boolean) as typeof FLAVORS,
    [boutiqueId]
  );

  function pickBoutique(id: string) {
    setBoutiqueId(id);
    setSlot("");
    setFlavors([]); // each boutique has different flavors
  }
  function pickFormat(id: string) {
    setFormatId(id);
    const max = FORMATS.find((f) => f.id === id)!.maxFlavors;
    setFlavors((prev) => prev.slice(0, max));
  }
  function toggleFlavor(id: string) {
    setFlavors((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxFlavors) return prev;
      return [...prev, id];
    });
  }
  function pickDate(i: number) {
    setDateIdx(i);
    setSlot("");
  }

  const canConfirm = boutique && format && flavors.length > 0 && slot && name.trim() && phone.trim();

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl text-center bg-cream rounded-[18px] shadow-xl ring-1 ring-secondary/10 px-8 py-14">
        <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-primary text-white mb-6">
          <Check size={30} />
        </div>
        <p className="eyebrow mb-3">Ritiro prenotato</p>
        <h2 className="display-title display-title--md mb-6">Ci vediamo in gelateria!</h2>
        <div className="text-left mx-auto max-w-md space-y-3 bg-gold-soft rounded-[14px] p-6 mb-8">
          <Row icon={<MapPin size={18} />} label="Gelateria" value={`${boutique.city} · ${boutique.name}`} />
          <Row icon={<IceCream size={18} />} label="Formato" value={format.name} />
          <Row icon={<ShoppingBag size={18} />} label="Gusti" value={flavors.map((id) => flavorById(id)?.name).join(", ")} />
          <Row icon={<CalendarDays size={18} />} label="Giorno" value={formatDateLong(selectedDate)} />
          <Row icon={<Clock size={18} />} label="Orario di ritiro" value={slot} />
          <Row icon={<Phone size={18} />} label="A nome di" value={`${name} · ${phone}`} />
        </div>
        <p className="text-sm text-secondary/70 mb-8">
          Ti aspettiamo in {boutique.address}. Mostra questa conferma al bancone:
          prepariamo il tuo ordine per il ritiro.
        </p>
        <button
          type="button"
          onClick={() => { setConfirmed(false); setSlot(""); }}
          className="btn-pill btn-pill--ghost"
        >
          <ArrowLeft size={16} /> Nuova prenotazione
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
      {/* ---------------- LEFT: steps ---------------- */}
      <div className="space-y-12 min-w-0">
        {/* Step 1 — boutique */}
        <Step n={1} title="Scegli la gelateria">
          {CITIES.map((city) => (
            <div key={city} className="mb-6 last:mb-0">
              <p className="eyebrow mb-3">{city}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {BOUTIQUES.filter((b) => b.city === city).map((b) => {
                  const active = b.id === boutiqueId;
                  return (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => pickBoutique(b.id)}
                      className={cn(
                        "flex gap-3 text-left rounded-[14px] p-3 ring-1 transition-all",
                        active ? "ring-primary bg-primary/5 shadow-sm" : "ring-secondary/15 bg-cream hover:ring-primary/40"
                      )}
                    >
                      <span className="relative h-16 w-16 shrink-0 rounded-[10px] overflow-hidden">
                        <Image src={b.image} alt={b.name} fill className="object-cover" sizes="64px" quality={85} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-secondary leading-tight">{b.name}</span>
                        <span className="mt-1 flex items-center gap-1 text-[12px] text-secondary/60">
                          <Clock size={12} /> {b.open}–{b.close}
                        </span>
                        {b.closedWeekdays.length > 0 && (
                          <span className="block text-[11px] text-primary mt-0.5">Chiuso il lunedì</span>
                        )}
                      </span>
                      <span className={cn("ml-auto mt-1 grid place-items-center h-5 w-5 shrink-0 rounded-full border", active ? "bg-primary border-primary text-white" : "border-secondary/30")}>
                        {active && <Check size={13} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Step>

        {/* Step 2 — format */}
        <Step n={2} title="Cono, coppetta o vaschetta?">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FORMATS.map((f) => {
              const active = f.id === formatId;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => pickFormat(f.id)}
                  className={cn(
                    "rounded-[14px] p-4 text-left ring-1 transition-all",
                    active ? "ring-primary bg-primary/5 shadow-sm" : "ring-secondary/15 bg-cream hover:ring-primary/40"
                  )}
                >
                  <IceCream size={20} className={cn("mb-2", active ? "text-primary" : "text-secondary/50")} />
                  <span className="block font-semibold text-secondary leading-tight">{f.name}</span>
                  <span className="block text-[12px] text-secondary/55 mt-0.5">{f.detail}</span>
                  <span className="block text-[11px] text-primary mt-1.5">fino a {f.maxFlavors} gusti</span>
                </button>
              );
            })}
          </div>
        </Step>

        {/* Step 3 — flavors */}
        <Step n={3} title="Scegli i gusti">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-secondary/70">
              Disponibili da <span className="font-semibold text-secondary">{boutique.name}</span>
            </p>
            <span className={cn("text-sm font-semibold", flavors.length >= maxFlavors ? "text-primary" : "text-secondary/60")}>
              {flavors.length}/{maxFlavors}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-3 gap-y-5">
            {availableFlavors.map((f) => {
              const selected = flavors.includes(f.id);
              const disabled = !selected && flavors.length >= maxFlavors;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => toggleFlavor(f.id)}
                  disabled={disabled}
                  className={cn("flex flex-col items-center gap-2 group", disabled && "opacity-35 cursor-not-allowed")}
                >
                  <span
                    className={cn(
                      "relative h-[68px] w-[68px] sm:h-20 sm:w-20 rounded-full overflow-hidden ring-2 transition-all",
                      selected ? "ring-primary scale-[1.06] shadow-md" : "ring-secondary/15 group-hover:ring-primary/50"
                    )}
                    style={!f.image ? { background: f.color } : undefined}
                  >
                    {f.image && <Image src={f.image} alt={f.name} fill className="object-cover" sizes="80px" quality={88} />}
                    {selected && (
                      <span className="absolute inset-0 bg-primary/35 grid place-items-center">
                        <Check size={22} className="text-white" />
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs text-secondary text-center leading-tight max-w-[80px]">{f.name}</span>
                </button>
              );
            })}
          </div>
          {flavors.length === 0 && (
            <p className="mt-4 text-sm text-primary">Seleziona almeno un gusto.</p>
          )}
        </Step>

        {/* Step 4 — date */}
        <Step n={4} title="Quando vuoi ritirare?">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {days.map((d, i) => {
              const closed = isClosedOn(boutique, d);
              const active = i === dateIdx;
              return (
                <button
                  type="button"
                  key={i}
                  disabled={closed}
                  onClick={() => pickDate(i)}
                  className={cn(
                    "shrink-0 w-16 rounded-[12px] py-3 text-center ring-1 transition-all",
                    closed && "opacity-35 cursor-not-allowed ring-secondary/15",
                    !closed && active && "bg-primary text-white ring-primary",
                    !closed && !active && "bg-cream ring-secondary/15 hover:ring-primary/40 text-secondary"
                  )}
                >
                  <span className="block text-[11px] uppercase tracking-wide">{WEEKDAYS_SHORT_IT[d.getDay()]}</span>
                  <span className="block text-xl font-semibold leading-tight">{d.getDate()}</span>
                  <span className="block text-[10px] opacity-70">{MONTHS_IT[d.getMonth()].slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-secondary/70">{formatDateLong(selectedDate)}</p>
        </Step>

        {/* Step 5 — time slot */}
        <Step n={5} title="Scegli l'orario">
          {slots.length === 0 ? (
            <p className="text-sm text-primary">La gelateria è chiusa in questa data. Scegli un altro giorno.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {slots.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSlot(s)}
                  className={cn(
                    "rounded-full py-2 text-sm font-semibold ring-1 transition-all",
                    slot === s ? "bg-primary text-white ring-primary" : "bg-cream ring-secondary/15 hover:ring-primary/40 text-secondary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </Step>

        {/* Step 6 — details */}
        <Step n={6} title="I tuoi dati">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome e cognome" required>
              <input value={name} onChange={(e) => setName(e.target.value)} className="pf-input" placeholder="Es. Giulia Rossi" />
            </Field>
            <Field label="Telefono" required>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="pf-input" placeholder="Es. 333 1234567" inputMode="tel" />
            </Field>
            <Field label="Note (allergie, dediche…)">
              <input value={note} onChange={(e) => setNote(e.target.value)} className="pf-input" placeholder="Facoltativo" />
            </Field>
          </div>
        </Step>
      </div>

      {/* ---------------- RIGHT: summary ---------------- */}
      <aside className="lg:sticky lg:top-28 rounded-[18px] bg-secondary text-cream p-6 shadow-xl">
        <p className="eyebrow !text-gold mb-4">Riepilogo ritiro</p>
        <div className="space-y-3 text-sm">
          <SumRow icon={<MapPin size={16} />} value={`${boutique.city} · ${boutique.name}`} />
          <SumRow icon={<IceCream size={16} />} value={format.name} />
          <SumRow icon={<ShoppingBag size={16} />} value={flavors.length ? flavors.map((id) => flavorById(id)?.name).join(", ") : "Scegli i gusti"} muted={!flavors.length} />
          <SumRow icon={<CalendarDays size={16} />} value={formatDateLong(selectedDate)} />
          <SumRow icon={<Clock size={16} />} value={slot || "Seleziona un orario"} muted={!slot} />
        </div>
        <div className="my-5 h-px bg-cream/15" />
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => setConfirmed(true)}
          className={cn("w-full btn-pill", !canConfirm && "opacity-45 cursor-not-allowed")}
        >
          Conferma prenotazione
        </button>
        {!canConfirm && (
          <p className="mt-3 text-[12px] text-cream/60 text-center">
            Completa gelateria, formato, gusti, orario, nome e telefono.
          </p>
        )}
        <p className="mt-4 text-[11px] text-cream/50 leading-snug text-center">
          Demo dimostrativa: nessun ordine reale viene inviato.
        </p>
      </aside>
    </div>
  );
}

/* ---------- helpers ---------- */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center h-8 w-8 rounded-full bg-secondary text-cream text-sm font-semibold shrink-0">{n}</span>
        <h2 className="text-xl font-semibold text-secondary">{title}</h2>
      </div>
      <div className="pl-0 sm:pl-11 min-w-0">{children}</div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-secondary mb-1.5">
        {label}{required && <span className="text-primary"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-primary mt-0.5">{icon}</span>
      <span className="text-sm text-secondary/60 w-24 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-secondary">{value}</span>
    </div>
  );
}

function SumRow({ icon, value, muted }: { icon: React.ReactNode; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gold mt-0.5">{icon}</span>
      <span className={cn("font-medium", muted ? "text-cream/50" : "text-cream")}>{value}</span>
    </div>
  );
}
