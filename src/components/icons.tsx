import type { SVGProps } from "react";

/** ARTIGIANO wordmark/badge — inline brand mark (scalloped cup with "ARTIGIANO"). */
export function CremaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 92.854" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M85.971,20.544V18.163A10.078,10.078,0,0,0,75.9,8.1H69.638C63.885,2.794,57.117,0,50,0S36.115,2.794,30.361,8.1H24.1A10.079,10.079,0,0,0,14.027,18.163v2.382C5.093,27.409,0,36.77,0,46.428S5.093,65.447,14.027,72.311v2.381A10.08,10.08,0,0,0,24.1,84.761h6.265c5.755,5.3,12.522,8.093,19.639,8.093s13.885-2.794,19.638-8.093H75.9A10.079,10.079,0,0,0,85.971,74.692V72.311C94.907,65.447,100,56.085,100,46.428S94.907,27.409,85.971,20.544"
      />
    </svg>
  );
}

/** Decorative scoop / cone glyph used as a small divider. */
export function ConeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 21 6.5 9.5h11L12 21Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.5a5 5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
