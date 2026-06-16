"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Info } from "lucide-react";
import { ConeGlyph } from "@/components/icons";
import { BrandLogo } from "@/components/BrandLogo";
import { login, getSession } from "@/lib/admin-auth";
import { DEMO_CREDENTIALS } from "@/lib/admin-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // If already logged in, skip to dashboard.
  useEffect(() => {
    if (getSession()) router.replace("/admin");
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (login(email, password)) {
      router.replace("/admin");
    } else {
      setError(true);
    }
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-secondary text-cream p-12 overflow-hidden">
        <ConeGlyph className="absolute -right-10 -bottom-10 h-[360px] w-[360px] text-cream/[0.06]" />
        <div className="relative">
          <BrandLogo tone="light" />
        </div>
        <div className="relative">
          <p className="eyebrow !text-gold mb-4">CRM &amp; Gestionale</p>
          <h1 className="display-title display-title--md !text-cream mb-4">
            Tutto il gusto,<br />sotto controllo
          </h1>
          <p className="lead !text-cream/80 max-w-sm">
            Ordini, magazzino, fatturato e calendario delle tue boutique in
            un&apos;unica dashboard.
          </p>
        </div>
        <p className="relative text-xs text-cream/50">© 2026 Artigiano Gelateria — Demo</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <BrandLogo tone="dark" />
          </div>

          <p className="eyebrow mb-2">Area riservata</p>
          <h2 className="text-3xl font-semibold text-secondary mb-2">Accedi al gestionale</h2>
          <p className="text-sm text-secondary/60 mb-8">
            Inserisci le credenziali per gestire le tue boutique.
          </p>

          {/* Visible demo credentials */}
          <div className="mb-6 rounded-xl bg-gold-soft ring-1 ring-primary/20 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
              <Info size={14} /> ACCOUNT DEMO
            </p>
            <div className="text-sm text-secondary space-y-0.5">
              <p>Email: <span className="font-semibold">{DEMO_CREDENTIALS.email}</span></p>
              <p>Password: <span className="font-semibold">{DEMO_CREDENTIALS.password}</span></p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Compila automaticamente →
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-secondary mb-1.5">E-mail</span>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(false); }}
                  className="pf-input pl-9"
                  placeholder="nome@artigiano.it"
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-secondary mb-1.5">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  className="pf-input pl-9"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600">Credenziali non valide. Usa l&apos;account demo qui sopra.</p>
            )}

            <button type="submit" className="btn-pill w-full">
              Accedi <ArrowRight size={16} />
            </button>
          </form>

          <Link href="/" className="block text-center mt-6 text-sm text-secondary/60 hover:text-primary">
            ← Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}
