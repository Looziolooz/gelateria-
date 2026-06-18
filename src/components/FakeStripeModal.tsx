"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CreditCard, Lock, Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface FakeStripeModalProps {
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function FakeStripeModal({ total, onSuccess, onClose }: FakeStripeModalProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [cardName, setCardName] = useState("Mario Rossi");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const overlayRef = useRef<HTMLDivElement>(null);

  const pay = useCallback(() => {
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      setTimeout(() => {
        onSuccess();
      }, 800);
    }, 1600);
  }, [onSuccess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "form") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/60 grid place-items-center p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === overlayRef.current && step === "form") onClose(); }}
    >
      <div className="w-full max-w-md rounded-[18px] bg-cream shadow-2xl overflow-hidden">
        {/* header */}
        <div className="bg-secondary px-6 py-5 flex items-center gap-3">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-primary/20 text-primary">
            <CreditCard size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-cream">Pagamento</p>
            <p className="text-[11px] text-cream/60">transazione demo · nessun addebito reale</p>
          </div>
          <Lock size={16} className="ml-auto text-cream/40 shrink-0" />
        </div>

        {step === "form" && (
          <div className="p-6 space-y-5">
            <div className="rounded-[12px] bg-white ring-1 ring-secondary/10 p-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-secondary/60 uppercase tracking-wide mb-1">Numero carta</label>
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="pf-input bg-cream" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-secondary/60 uppercase tracking-wide mb-1">Scadenza</label>
                  <input value={expiry} onChange={(e) => setExpiry(e.target.value)} className="pf-input bg-cream" placeholder="MM/AA" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-secondary/60 uppercase tracking-wide mb-1">CVV</label>
                  <input value={cvc} onChange={(e) => setCvc(e.target.value)} className="pf-input bg-cream" placeholder="123" maxLength={4} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-secondary/60 uppercase tracking-wide mb-1">Intestatario</label>
                <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="pf-input bg-cream" placeholder="Mario Rossi" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-secondary/50 px-1">
              <span className="flex items-center gap-1.5"><Lock size={13} /> Pagamento sicuro</span>
              <span>Powered by <span className="font-semibold text-secondary/70">Artigiano Pay</span></span>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-pill btn-pill--ghost flex-1">Annulla</button>
              <button type="button" onClick={pay} className="btn-pill flex-1 font-semibold">
                Paga {total.toFixed(2)} €
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="p-14 text-center space-y-4">
            <Loader size={36} className="animate-spin mx-auto text-primary" />
            <p className="text-sm font-semibold text-secondary">Elaborando pagamento…</p>
            <p className="text-xs text-secondary/50">Transazione demo in corso</p>
          </div>
        )}

        {step === "done" && (
          <div className={cn("p-14 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300")}>
            <span className="grid place-items-center h-14 w-14 rounded-full bg-green-500 text-white mx-auto">
              <Check size={28} />
            </span>
            <p className="text-sm font-semibold text-secondary">Pagamento riuscito!</p>
            <p className="text-xs text-secondary/50">
              {total.toFixed(2)} € — ordine confermato
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
