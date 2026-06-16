import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteHeader } from "@/components/SiteHeader";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { RevealObserver } from "@/components/Reveal";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <RevealObserver />
      <SiteHeader />
      <main>{children}</main>
      <ConditionalFooter />
    </SmoothScroll>
  );
}
