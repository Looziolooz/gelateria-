"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  Clock, MapPin, Phone, Check, CalendarDays, ShoppingBag, ArrowLeft, ArrowRight, IceCream, Plus, Trash2, Minus,
} from "lucide-react";
import {
  BOUTIQUES, type Boutique, type City,
  FORMATS, FLAVORS, BOUTIQUE_FLAVORS, flavorById,
} from "@/lib/data";
import {
  generateSlots, isClosedOn, formatDateLong, upcomingDays,
  WEEKDAYS_SHORT_IT, MONTHS_IT,
} from "@/lib/pickup";
import { saveStoredBooking } from "@/lib/bookings-store";
import { cn } from "@/lib/utils";
import { FakeStripeModal } from "@/components/FakeStripeModal";

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const CITIES: City[] = ["Cosenza", "Catanzaro", "Lamezia Terme"];
const TOTAL_STEPS = 5;

// Hint shown when a step can't be left yet (mandatory fields not filled).
const STEP_HINT: Record<number, string> = {
  2: "Aggiungi almeno un articolo",
  3: "Scegli un giorno di apertura",
  4: "Seleziona un orario di ritiro",
};

interface CartItem {
  id: string;
  formatId: string;
  flavors: string[];
  quantity: number;
}

const emptyItem = (): CartItem => ({
  id: "",
  formatId: FORMATS[0].id,
  flavors: [],
  quantity: 1,
});

export function PickupForm() {
  const now = useMemo(() => new Date(), []);
  const days = useMemo(() => upcomingDays(now, 14), [now]);

  const [boutiqueId, setBoutiqueId] = useState<string>(BOUTIQUES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [draft, setDraft] = useState<CartItem>(emptyItem);
  const [dateIdx, setDateIdx] = useState<number>(0);
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [slide, setSlide] = useState(0); // 0 = intro, 1..5 = steps
  const confirmRef = useRef<HTMLDivElement>(null);

  const boutique = BOUTIQUES.find((b) => b.id === boutiqueId) as Boutique;
  const selectedDate = days[dateIdx];
  const slots = useMemo(() => generateSlots(boutique, selectedDate, now), [boutique, selectedDate, now]);
  const availableFlavors = useMemo(() => (BOUTIQUE_FLAVORS[boutiqueId] ?? []).map(flavorById).filter(Boolean) as typeof FLAVORS, [boutiqueId]);

  const draftFormat = FORMATS.find((f) => f.id === draft.formatId)!;
  const draftMax = draftFormat.maxFlavors;

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const fmt = FORMATS.find((f) => f.id === item.formatId);
      return sum + (fmt ? fmt.price * item.quantity : 0);
    }, 0);
  }, [cart]);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const canConfirm = !!(boutique && cart.length > 0 && slot && name.trim() && phone.trim());

  // Can leave slide N forward? Every required field must be filled, so a step
  // can never be skipped — the order can't omit information.
  const canAdvance = [
    true,                                  // 0 intro
    !!boutiqueId,                          // 1 gelateria (always selected)
    cart.length > 0,                       // 2 carrello
    !isClosedOn(boutique, selectedDate),   // 3 data (giorno di apertura)
    !!slot,                                // 4 orario
  ];
  let maxReachable = 0;
  while (maxReachable < 5 && canAdvance[maxReachable]) maxReachable++;

  const goNext = useCallback(() => {
    setSlide((s) => (s < 5 && canAdvance[s] ? s + 1 : s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAdvance]);
  const goBack = useCallback(() => setSlide((s) => Math.max(0, s - 1)), []);
  const goTo = useCallback((k: number) => setSlide((s) => (k <= maxReachable ? k : s)), [maxReachable]);

  const pickBoutique = useCallback((id: string) => {
    setBoutiqueId(id);
    setCart([]);
    setSlot("");
    setDraft(emptyItem());
  }, []);

  const addToCart = useCallback(() => {
    if (draft.flavors.length === 0) return;
    setCart((prev) => [...prev, { ...draft, id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }]);
    setDraft(emptyItem());
    setAdding(false);
  }, [draft]);

  const removeFromCart = useCallback((id: string) => setCart((prev) => prev.filter((i) => i.id !== id)), []);
  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  }, []);

  const saveOrders = useCallback(() => {
    for (const item of cart) {
      const fmt = FORMATS.find((f) => f.id === item.formatId)!;
      saveStoredBooking({
        id: `PRE-${String(Date.now()).slice(-5)}-${Math.random().toString(36).slice(2, 4)}`,
        customer: name.trim(),
        phone: phone.trim(),
        boutiqueLabel: `${boutique.city} · ${boutique.name}`,
        format: item.quantity > 1 ? `${item.quantity}× ${fmt.name}` : fmt.name,
        flavors: item.flavors.map((id) => flavorById(id)?.name ?? id),
        date: toISODate(selectedDate),
        time: slot,
        total: fmt.price * item.quantity,
        status: "Confermata",
      });
    }
    setConfirmed(true);
  }, [cart, name, phone, boutique, selectedDate, slot]);

  const handlePaymentSuccess = useCallback(() => saveOrders(), [saveOrders]);
  const confirmBooking = useCallback(() => { if (canConfirm) setShowPayment(true); }, [canConfirm]);

  const cartMini = (
    <span className="text-sm text-secondary/70">
      {cart.length ? (
        <><b className="text-secondary">{itemCount}</b> art. · <b className="text-secondary">{cartTotal.toFixed(2)} €</b></>
      ) : "Carrello vuoto"}
    </span>
  );

  if (confirmed) {
    return (
      <section ref={confirmRef} className="w-[100svw] h-[100svh] overflow-y-auto bg-cream flex items-center">
        <div className="mx-auto max-w-2xl w-full text-center px-[6vw] py-24">
          <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-primary text-white mb-6"><Check size={30} /></div>
          <p className="eyebrow mb-3">Ordine confermato</p>
          <h2 className="display-title display-title--md mb-6">Ci vediamo in gelateria!</h2>
          <div className="text-left mx-auto max-w-md space-y-3 bg-gold-soft rounded-[14px] p-6 mb-8">
            <Row icon={<MapPin size={18} />} label="Gelateria" value={`${boutique.city} · ${boutique.name}`} />
            <Row icon={<ShoppingBag size={18} />} label="Articoli" value={`${itemCount} pezzi (${cartTotal.toFixed(2)} €)`} />
            <Row icon={<CalendarDays size={18} />} label="Giorno" value={formatDateLong(selectedDate)} />
            <Row icon={<Clock size={18} />} label="Orario di ritiro" value={slot} />
            <Row icon={<Phone size={18} />} label="A nome di" value={`${name} · ${phone}`} />
          </div>
          <p className="text-sm text-secondary/70 mb-8">
            Ti aspettiamo in {boutique.address}. Mostra questa conferma al bancone: prepariamo il tuo ordine per il ritiro.
          </p>
          <button type="button" onClick={() => { setConfirmed(false); setSlot(""); setCart([]); setSlide(1); }} className="btn-pill btn-pill--ghost">
            <ArrowLeft size={16} /> Nuovo ordine
          </button>
        </div>
      </section>
    );
  }

  const navFooter = (n: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      <span className="flex items-center gap-2">
        {cartMini}
        {!canAdvance[n] && STEP_HINT[n] && <span className="text-amber-600 text-xs">· {STEP_HINT[n]}</span>}
      </span>
      <div className="flex gap-2">
        <button type="button" onClick={goBack} className="btn-pill btn-pill--ghost flex items-center gap-1.5"><ArrowLeft size={15} /> Indietro</button>
        <button type="button" onClick={goNext} disabled={!canAdvance[n]} className={cn("btn-pill btn-pill--brown flex items-center gap-1.5", !canAdvance[n] && "opacity-45 cursor-not-allowed")}>
          Continua <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-[100svw] h-[100svh] overflow-hidden bg-cream">
        <div
          className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${slide * 100}svw)` }}
        >
          {/* 0 — intro */}
          <div inert={slide === 0 ? undefined : true} className="w-[100svw] h-full shrink-0 overflow-y-auto bg-gold-soft">
            <div className="min-h-full flex flex-col items-center justify-center text-center px-[6vw] pt-28 pb-16 max-w-2xl mx-auto">
              <p className="eyebrow mb-3">Ordina e ritira</p>
              <h1 className="display-title display-title--xl mb-6">Pickup in boutique</h1>
              <p className="lead mb-10">
                Ti guidiamo passo passo: gelateria, carrello, giorno, orario e contatti. Ogni passaggio è obbligatorio, così non manca nulla all&apos;ordine.
              </p>
              <button type="button" onClick={() => setSlide(1)} className="btn-pill">Inizia l&apos;ordine <ArrowRight size={16} /></button>
            </div>
          </div>

          {/* 1 — boutique */}
          <StepFrame n={1} title="Scegli la gelateria" subtitle="Dove vuoi ritirare il tuo gelato?" active={slide === 1} maxReachable={maxReachable} goTo={goTo} footer={navFooter(1)}>
            {CITIES.map((city) => (
              <div key={city} className="mb-6 last:mb-0">
                <p className="eyebrow mb-3">{city}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {BOUTIQUES.filter((b) => b.city === city).map((b) => {
                    const active = b.id === boutiqueId;
                    return (
                      <button type="button" key={b.id} onClick={() => pickBoutique(b.id)}
                        className={cn("flex gap-3 text-left rounded-[14px] p-3 ring-1 transition-all", active ? "ring-primary bg-primary/5 shadow-sm" : "ring-secondary/15 bg-cream hover:ring-primary/40")}>
                        <span className="relative h-16 w-16 shrink-0 rounded-[10px] overflow-hidden">
                          <Image src={b.image} alt={b.name} fill className="object-cover" sizes="64px" quality={90} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-secondary leading-tight">{b.name}</span>
                          <span className="mt-1 flex items-center gap-1 text-[12px] text-secondary/60"><Clock size={12} /> {b.open}–{b.close}</span>
                          {b.closedWeekdays.length > 0 && <span className="block text-[11px] text-primary mt-0.5">Chiuso il lunedì</span>}
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
          </StepFrame>

          {/* 2 — cart */}
          <StepFrame n={2} title="Il tuo carrello" subtitle="Componi i tuoi coni e vaschette." active={slide === 2} maxReachable={maxReachable} goTo={goTo} footer={navFooter(2)}>
            {cart.length === 0 && !adding && <p className="text-sm text-secondary/60 mb-4">Ancora nessun articolo. Aggiungi coni o vaschette.</p>}
            {cart.length > 0 && (
              <div className="space-y-2 mb-5">
                {cart.map((item) => {
                  const fmt = FORMATS.find((f) => f.id === item.formatId)!;
                  return (
                    <div key={item.id} className="flex items-center gap-3 bg-cream rounded-[12px] p-3 ring-1 ring-secondary/10">
                      <IceCream size={20} className="text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary">{fmt.name}</p>
                        <p className="text-[11px] text-secondary/60 truncate">{item.flavors.map((id) => flavorById(id)?.name).join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => updateQty(item.id, -1)} className="h-7 w-7 grid place-items-center rounded-full ring-1 ring-secondary/20 hover:ring-primary text-secondary/60 hover:text-primary transition-all"><Minus size={13} /></button>
                        <span className="w-6 text-center text-sm font-semibold text-secondary">{item.quantity}</span>
                        <button type="button" onClick={() => updateQty(item.id, 1)} className="h-7 w-7 grid place-items-center rounded-full ring-1 ring-secondary/20 hover:ring-primary text-secondary/60 hover:text-primary transition-all"><Plus size={13} /></button>
                      </div>
                      <span className="text-sm font-semibold text-secondary w-16 text-right">{(fmt.price * item.quantity).toFixed(2)} €</span>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="h-7 w-7 grid place-items-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                    </div>
                  );
                })}
              </div>
            )}
            {adding ? (
              <div className="bg-cream rounded-[14px] p-4 ring-1 ring-secondary/10 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FORMATS.map((f) => {
                    const active = f.id === draft.formatId;
                    return (
                      <button type="button" key={f.id} onClick={() => setDraft((prev) => ({ ...prev, formatId: f.id, flavors: [] }))}
                        className={cn("rounded-[10px] p-2.5 text-center ring-1 transition-all text-sm", active ? "ring-primary bg-primary/5 shadow-sm text-primary font-semibold" : "ring-secondary/15 bg-white hover:ring-primary/40 text-secondary")}>
                        <IceCream size={18} className={cn("mx-auto mb-1", active ? "text-primary" : "text-secondary/50")} />
                        {f.name}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary mb-2">Gusti (max {draftMax})</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-2 gap-y-3">
                    {availableFlavors.map((f) => {
                      const selected = draft.flavors.includes(f.id);
                      const disabled = !selected && draft.flavors.length >= draftMax;
                      return (
                        <button type="button" key={f.id} disabled={disabled}
                          onClick={() => setDraft((prev) => ({ ...prev, flavors: prev.flavors.includes(f.id) ? prev.flavors.filter((id) => id !== f.id) : prev.flavors.length >= draftMax ? prev.flavors : [...prev.flavors, f.id] }))}
                          className={cn("flex flex-col items-center gap-1.5 group", disabled && "opacity-30 cursor-not-allowed")}>
                          <span className={cn("relative h-[52px] w-[52px] rounded-full overflow-hidden ring-2 transition-all", selected ? "ring-primary scale-105 shadow-sm" : "ring-secondary/15 group-hover:ring-primary/50")} style={!f.image ? { background: f.color } : undefined}>
                            {f.image && <Image src={f.image} alt={f.name} fill className="object-cover" sizes="52px" quality={85} />}
                            {selected && <span className="absolute inset-0 bg-primary/35 grid place-items-center"><Check size={16} className="text-white" /></span>}
                          </span>
                          <span className="text-[10px] text-secondary text-center leading-tight">{f.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary/70">Quantità:</span>
                    <button type="button" onClick={() => setDraft((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))} className="h-7 w-7 grid place-items-center rounded-full ring-1 ring-secondary/20 hover:ring-primary text-secondary/60 hover:text-primary transition-all"><Minus size={13} /></button>
                    <span className="w-6 text-center text-sm font-semibold text-secondary">{draft.quantity}</span>
                    <button type="button" onClick={() => setDraft((prev) => ({ ...prev, quantity: Math.min(20, prev.quantity + 1) }))} className="h-7 w-7 grid place-items-center rounded-full ring-1 ring-secondary/20 hover:ring-primary text-secondary/60 hover:text-primary transition-all"><Plus size={13} /></button>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setAdding(false); setDraft(emptyItem()); }} className="btn-pill btn-pill--ghost text-xs">Annulla</button>
                    <button type="button" onClick={addToCart} disabled={draft.flavors.length === 0} className={cn("btn-pill text-xs flex items-center gap-1.5", draft.flavors.length === 0 && "opacity-45 cursor-not-allowed")}><Plus size={14} /> Aggiungi</button>
                  </div>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setAdding(true)} className="btn-pill btn-pill--ghost flex items-center gap-1.5 text-sm"><Plus size={15} /> Aggiungi cono o vaschetta</button>
            )}
          </StepFrame>

          {/* 3 — date */}
          <StepFrame n={3} title="Quando vuoi ritirare?" subtitle="Scegli il giorno del ritiro." active={slide === 3} maxReachable={maxReachable} goTo={goTo} footer={navFooter(3)}>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {days.map((d, i) => {
                const closed = isClosedOn(boutique, d);
                const active = i === dateIdx;
                return (
                  <button type="button" key={i} disabled={closed} onClick={() => { setDateIdx(i); setSlot(""); }}
                    className={cn("shrink-0 w-16 rounded-[12px] py-3 text-center ring-1 transition-all", closed && "opacity-35 cursor-not-allowed ring-secondary/15", !closed && active && "bg-primary text-white ring-primary", !closed && !active && "bg-cream ring-secondary/15 hover:ring-primary/40 text-secondary")}>
                    <span className="block text-[11px] uppercase tracking-wide">{WEEKDAYS_SHORT_IT[d.getDay()]}</span>
                    <span className="block text-xl font-semibold leading-tight">{d.getDate()}</span>
                    <span className="block text-[10px] opacity-70">{MONTHS_IT[d.getMonth()].slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-secondary/70">{formatDateLong(selectedDate)}</p>
          </StepFrame>

          {/* 4 — slot */}
          <StepFrame n={4} title="Scegli l'orario" subtitle="A che ora passi a ritirare?" active={slide === 4} maxReachable={maxReachable} goTo={goTo} footer={navFooter(4)}>
            {slots.length === 0 ? (
              <p className="text-sm text-primary">La gelateria è chiusa in questa data. Torna indietro e scegli un altro giorno.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {slots.map((s) => (
                  <button type="button" key={s} onClick={() => setSlot(s)}
                    className={cn("rounded-full py-2 text-sm font-semibold ring-1 transition-all", slot === s ? "bg-primary text-white ring-primary" : "bg-cream ring-secondary/15 hover:ring-primary/40 text-secondary")}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </StepFrame>

          {/* 5 — details + confirm */}
          <StepFrame n={5} title="I tuoi dati" subtitle="Ultimo passo: lasciaci un recapito." active={slide === 5} maxReachable={maxReachable} goTo={goTo}
            footer={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <span className="flex items-center gap-2">
                  {cartMini}
                  {!canConfirm && <span className="text-amber-600 text-xs">· Completa nome e telefono</span>}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={goBack} className="btn-pill btn-pill--ghost flex items-center gap-1.5"><ArrowLeft size={15} /> Indietro</button>
                  <button type="button" onClick={confirmBooking} disabled={!canConfirm} className={cn("btn-pill", !canConfirm && "opacity-45 cursor-not-allowed")}>Conferma ordine</button>
                </div>
              </div>
            }>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="grid gap-4 content-start">
                <Field label="Nome e cognome" required><input value={name} onChange={(e) => setName(e.target.value)} className="pf-input" placeholder="Es. Giulia Rossi" /></Field>
                <Field label="Telefono" required><input value={phone} onChange={(e) => setPhone(e.target.value)} className="pf-input" placeholder="Es. 333 1234567" inputMode="tel" /></Field>
                <Field label="Note (allergie, dediche…)"><input value={note} onChange={(e) => setNote(e.target.value)} className="pf-input" placeholder="Facoltativo" /></Field>
              </div>
              <aside className="rounded-[18px] bg-secondary text-cream p-6 shadow-xl">
                <p className="eyebrow !text-gold mb-4">Riepilogo</p>
                <div className="space-y-3 text-sm">
                  {cart.map((item) => {
                    const fmt = FORMATS.find((f) => f.id === item.formatId)!;
                    return (
                      <div key={item.id} className="flex items-start gap-2">
                        <IceCream size={15} className="text-gold mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-cream font-medium">{item.quantity}× {fmt.name}</span>
                          <p className="text-[11px] text-cream/50 truncate">{item.flavors.map((id) => flavorById(id)?.name).join(", ")}</p>
                        </div>
                        <span className="text-cream font-semibold shrink-0">{(fmt.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    );
                  })}
                </div>
                <div className="my-5 h-px bg-cream/15" />
                <div className="space-y-1.5 text-sm">
                  <p className="text-cream/70 flex items-center gap-2"><Clock size={14} className="text-gold" /> {formatDateLong(selectedDate)} · {slot}</p>
                  <p className="text-cream/70 flex items-center gap-2"><MapPin size={14} className="text-gold" /> {boutique.city} · {boutique.name}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-cream/70">Subtotale</span>
                  <span className="text-cream font-semibold text-lg">{cartTotal.toFixed(2)} €</span>
                </div>
                <p className="mt-3 text-[11px] text-cream/45 leading-snug">Demo dimostrativa: nessun ordine reale viene inviato.</p>
              </aside>
            </div>
          </StepFrame>
        </div>
      </div>

      {showPayment && <FakeStripeModal total={cartTotal} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />}
    </>
  );
}

/* ---------- wizard slide frame ---------- */
function StepFrame({
  n, title, subtitle, active, maxReachable, goTo, children, footer,
}: {
  n: number;
  title: string;
  subtitle?: string;
  active: boolean;
  maxReachable: number;
  goTo: (k: number) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div inert={active ? undefined : true} className="w-[100svw] h-full shrink-0 overflow-y-auto bg-cream">
      <div className="min-h-full flex flex-col px-[6vw] pt-28 lg:pt-24 pb-10 max-w-[940px] mx-auto w-full">
        {/* numbered stepper — go back to a completed step, never skip ahead */}
        <div className="flex items-center gap-2 mb-7 shrink-0">
          {[1, 2, 3, 4, 5].map((k) => (
            <button key={k} type="button" onClick={() => goTo(k)} disabled={k > maxReachable} aria-current={k === n ? "step" : undefined}
              className={cn(
                "h-8 w-8 rounded-full text-[12px] font-semibold grid place-items-center transition-colors",
                k === n ? "bg-primary text-white" : k <= maxReachable ? "bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer" : "bg-secondary/5 text-secondary/30 cursor-not-allowed"
              )}>
              {k}
            </button>
          ))}
          <span className="ml-2 text-xs text-secondary/50">Passo {n} di {TOTAL_STEPS}</span>
        </div>

        <div className="mb-6 shrink-0">
          <h2 className="title fs-60 fs-m-30 caviar t-u t-lh-12">{title}</h2>
          {subtitle && <p className="text-sm text-secondary/70 mt-2">{subtitle}</p>}
          <hr className="rule-gold w-16 mt-5" />
        </div>

        <div className="flex-1 min-w-0">{children}</div>
        <div className="mt-8 pt-5 border-t border-secondary/12 shrink-0">{footer}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-secondary mb-1.5">{label}{required && <span className="text-primary"> *</span>}</span>
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
