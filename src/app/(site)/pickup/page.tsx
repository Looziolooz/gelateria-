import type { Metadata } from "next";
import { PickupForm } from "@/components/PickupForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Pickup — Ordina e ritira | ARTIGIANO",
  description:
    "Ordina il tuo gelato Artigiano e ritiralo in boutique. Scegli la gelateria, il giorno e l'orario di ritiro tra Milano e Roma.",
};

export default function PickupPage() {
  return (
    <>
      <PageHero
        eyebrow="Ordina e ritira"
        title="Pickup in boutique"
        subtitle="Scegli la gelateria, il giorno e l'orario che preferisci: prepariamo il tuo gelato e lo trovi pronto al bancone, senza fila."
      />
      <section className="bg-cream">
        <div className="site-wrap pb-24 md:pb-32">
          <PickupForm />
        </div>
      </section>
    </>
  );
}
