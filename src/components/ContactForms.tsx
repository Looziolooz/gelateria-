"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SOCIAL } from "@/lib/data";

type Tab = "messaggio" | "lavora";

const inputClass =
  "w-full bg-transparent border-0 border-b border-secondary/40 focus:border-primary outline-none py-2 text-secondary placeholder:text-secondary/40 transition-colors";

export function ContactForms() {
  const [tab, setTab] = useState<Tab>("messaggio");
  const [messaggioSent, setMessaggioSent] = useState(false);
  const [lavoraSent, setLavoraSent] = useState(false);

  return (
    <div className="mt-8 max-w-xl">
      {/* ---------------- Toggle ---------------- */}
      <div className="inline-flex b-back-2 rounded-full p-1">
        <button
          type="button"
          onClick={() => setTab("messaggio")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            tab === "messaggio" ? "b-primary c-white" : "c-secondary"
          }`}
        >
          Messaggio
        </button>
        <button
          type="button"
          onClick={() => setTab("lavora")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            tab === "lavora" ? "b-primary c-white" : "c-secondary"
          }`}
        >
          Lavora con noi
        </button>
      </div>

      {/* ---------------- Active form ---------------- */}
      <div className="mt-8">
        {tab === "messaggio" ? (
          messaggioSent ? (
            <SuccessBlock>
              Grazie! Il tuo messaggio è stato inviato. Ti risponderemo al più
              presto. 🍦
            </SuccessBlock>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setMessaggioSent(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nome" required>
                  <input type="text" required className={inputClass} />
                </Field>
                <Field label="Cognome" required>
                  <input type="text" required className={inputClass} />
                </Field>
              </div>

              <Field label="E-mail" required>
                <input type="email" required className={inputClass} />
              </Field>

              <Field label="Oggetto" required>
                <input type="text" required className={inputClass} />
              </Field>

              <Field label="Messaggio" required>
                <textarea required rows={3} className={inputClass} />
              </Field>

              <ConsentBlock />

              <button type="submit" className="btn-pill">
                Invia messaggio
              </button>

              <DemoNote />
            </form>
          )
        ) : lavoraSent ? (
          <SuccessBlock>
            Grazie! La tua candidatura è stata inviata.
          </SuccessBlock>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setLavoraSent(true);
            }}
          >
            <Field label="Nome" required>
              <input type="text" required className={inputClass} />
            </Field>

            <Field label="E-mail" required>
              <input type="email" required className={inputClass} />
            </Field>

            <Field label="Telefono" required>
              <input type="tel" required className={inputClass} />
            </Field>

            <Field label="Allega il tuo cv">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full text-secondary/70 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              />
            </Field>

            <Field label="Messaggio" required>
              <textarea required rows={3} className={inputClass} />
            </Field>

            <ConsentBlock />

            <button
              type="submit"
              className="b-primary c-white t-u caviar rounded-full px-7 py-3 text-sm font-semibold"
            >
              Invia messaggio
            </button>

            <DemoNote />
          </form>
        )}
      </div>

      {/* ---------------- Social row ---------------- */}
      <div className="mt-12 flex items-center gap-4">
        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center transition-colors hover:bg-secondary/5"
        >
          <img src="/icons/icon-instagram-b.svg" alt="Instagram" className="h-5 w-5" />
        </a>
        <a
          href={SOCIAL.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center transition-colors hover:bg-secondary/5"
        >
          <img src="/icons/icon-fb-b.svg" alt="Facebook" className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-wide text-secondary/60 mb-1">
        {label}
        {required && <span className="c-primary"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ConsentBlock() {
  return (
    <div className="space-y-3 pt-1">
      <label className="flex items-start gap-2.5 text-sm text-secondary/80">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          Acconsento al trattamento dei dati per l&apos;esclusiva finalità di
          essere contattato per ricevere informazioni, come specificato nella
          Privacy Policy.
        </span>
      </label>
      <label className="flex items-start gap-2.5 text-sm text-secondary/80">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>Voglio iscrivermi alla newsletter Artigiano</span>
      </label>
    </div>
  );
}

function SuccessBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start text-left py-6">
      <span className="grid place-items-center h-14 w-14 rounded-full bg-primary text-white mb-5">
        <Check size={28} />
      </span>
      <p className="max-w-sm text-base font-medium c-secondary">{children}</p>
      <DemoNote />
    </div>
  );
}

function DemoNote() {
  return (
    <p className="mt-4 text-[11px] text-secondary/50">
      Demo dimostrativa: nessun dato viene realmente inviato.
    </p>
  );
}
