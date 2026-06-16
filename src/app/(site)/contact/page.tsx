import Image from "next/image";
import { ContactForms } from "@/components/ContactForms";

export const metadata = {
  title: "Contatti",
  description: "Contatta Artigiano Gelateria.",
};

export default function ContactPage() {
  return (
    <section className="b-back-1 c-secondary min-h-[100svh] pt-28 lg:pt-24 pb-10 px-[5vw] flex items-center">
      <div className="grid lg:grid-cols-2 gap-12 w-full items-center">
        {/* LEFT — title + forms */}
        <div>
          <h1 className="title fs-70 fs-m-40 caviar t-u">Contattaci</h1>
          <ContactForms />
        </div>

        {/* RIGHT — illustration */}
        <div className="hidden lg:block">
          <Image
            src="/images/shop/maestro.png"
            width={520}
            height={620}
            alt="Il maestro gelatiere Artigiano"
            className="w-full max-w-md mx-auto h-auto rounded-[18px]"
            quality={95}
          />
        </div>
      </div>
    </section>
  );
}
