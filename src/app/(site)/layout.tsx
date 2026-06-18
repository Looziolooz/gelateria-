import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteHeader } from "@/components/SiteHeader";
import { RevealObserver } from "@/components/Reveal";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Every public page is now a horizontal-scroll experience and renders its own
  // footer panel where one is wanted — so there's no global vertical footer.
  return (
    <SmoothScroll>
      <RevealObserver />
      <SiteHeader />
      <main>{children}</main>
    </SmoothScroll>
  );
}
