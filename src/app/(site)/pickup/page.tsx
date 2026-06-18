import type { Metadata } from "next";
import { PickupForm } from "@/components/PickupForm";

export const metadata: Metadata = {
  title: "Pickup — Ordina e ritira | ARTIGIANO",
  description:
    "Ordina il tuo gelato Artigiano e ritiralo in boutique. Scegli la gelateria, il giorno e l'orario di ritiro tra Cosenza, Catanzaro e Lamezia Terme.",
};

// The pickup wizard is a self-contained, gated horizontal stepper (each step is
// mandatory), so it is NOT wrapped in the free-scroll HorizontalScroll.
export default function PickupPage() {
  return <PickupForm />;
}
