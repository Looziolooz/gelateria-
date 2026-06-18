/**
 * Shared motion language for the bottega site.
 *
 * One vocabulary of easings + durations so every GSAP animation across the
 * homepage panels, the process section and the secondary pages feels like the
 * same hand. Keep motion intentional and unhurried (DESIGN.md → "Motion").
 */

/** GSAP easing tokens. */
export const EASE = {
  /** entrances — confident settle */
  out: "power3.out",
  /** exits — accelerate away */
  in: "power2.in",
  /** sustained / scrubbed moves */
  inOut: "power2.inOut",
  /** playful overshoot — pins, seals, map cones */
  back: "back.out(1.6)",
  /** linear, for scroll-locked parallax */
  none: "none",
} as const;

/** Duration tokens (seconds). */
export const DUR = {
  xs: 0.25,
  sm: 0.5,
  md: 0.9,
  lg: 1.2,
  xl: 1.5,
} as const;

/** Scrub smoothing tokens (seconds of lag for scroll-linked tweens). */
export const SCRUB = {
  tight: 1,
  soft: 1.5,
  loose: 2,
} as const;

/** Per-child stagger step used by reveal cascades (seconds). */
export const STAGGER = 0.08;

/** The horizontal-scroll track is the GSAP scroller on every public page. */
export const HS_TRACK_SELECTOR = ".hs-track";

/** True when the visitor asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
