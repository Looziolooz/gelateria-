"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const dark = variant === "dark";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
      }}
      className="w-full max-w-md"
    >
      {done ? (
        <p className={cn("text-sm flex items-center gap-2", dark ? "text-white/90" : "text-secondary")}>
          <Check size={16} className="text-green-500 shrink-0" /> Grazie! Iscrizione registrata.
        </p>
      ) : (
        <>
          <label htmlFor="newsletter-email" className="sr-only">La tua e-mail</label>
          <div
            className={cn(
              "flex items-center gap-2 border-b pb-2",
              dark ? "border-white/40" : "border-secondary/40"
            )}
          >
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua e-mail"
              className={cn(
                "flex-1 bg-transparent outline-none text-sm placeholder:opacity-60",
                dark ? "text-white placeholder:text-white/70" : "text-secondary"
              )}
            />
            <button
              type="submit"
              aria-label="Iscriviti"
              className={cn(
                "group grid place-items-center h-9 w-9 rounded-full transition-colors duration-300 cursor-pointer",
                dark ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
              )}
            >
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
          <label
            className={cn(
              "mt-3 flex items-start gap-2 text-[11px] leading-snug cursor-pointer",
              dark ? "text-white/70" : "text-secondary/70"
            )}
          >
            <input type="checkbox" required className="mt-0.5 accent-primary cursor-pointer" />
            <span>
              Accetto il trattamento dei dati personali secondo la Privacy Policy.
            </span>
          </label>
        </>
      )}
    </form>
  );
}
