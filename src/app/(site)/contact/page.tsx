import { ContactForms } from "@/components/ContactForms";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { PageHero } from "@/components/PageHero";
import { Figure } from "@/components/site/Figure";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Contatti",
  description: "Contatta Artigiano Gelateria.",
};

export default function ContactPage() {
  return (
    <HorizontalScroll>
      <PageHero
        panel
        eyebrow="Contatti"
        title="Contattaci"
        subtitle="Scrivici per informazioni, collaborazioni o per unirti al team. Ti rispondiamo al più presto."
      />

      <section className="w-[100svw] h-[100svh] shrink-0 overflow-y-auto b-back-1 c-secondary">
        <div className="min-h-full flex items-center px-[5vw] py-28 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full max-w-[1280px] mx-auto items-center">
            {/* LEFT — forms */}
            <div data-reveal>
              <p className="eyebrow mb-3">Parliamone</p>
              <h2 className="title fs-70 fs-m-40 caviar t-u t-lh-12">Scrivici</h2>
              <ContactForms />
            </div>

            {/* RIGHT — maestro photo */}
            <div data-reveal className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <Figure
                  src="/images/shop/maestro.webp"
                  alt="Il maestro gelatiere Artigiano"
                  sizes="(max-width: 1024px) 0px, 448px"
                  radius="18px"
                  className="w-full aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-[100svw] h-[100svh] shrink-0 flex items-center b-secondary">
        <div className="w-full">
          <SiteFooter />
        </div>
      </section>
    </HorizontalScroll>
  );
}
