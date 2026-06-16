"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * The homepage is a pure horizontal-scroll experience and renders the footer as
 * its own last panel, so the shared footer is suppressed there.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  // Horizontal-scroll pages render the footer as their own last panel.
  if (["/", "/boutiques", "/stili-di-gelato"].includes(pathname)) return null;
  return <SiteFooter />;
}
