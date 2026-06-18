"use client";

/**
 * The whole public site now scrolls horizontally (see HorizontalScroll), which
 * runs its own eased scroll engine. Lenis vertical smoothing would fight the
 * track's wheel handling, so it is intentionally not initialised here — this is
 * a thin pass-through kept as the mount point in the site layout.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
