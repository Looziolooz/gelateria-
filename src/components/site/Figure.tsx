import Image from "next/image";

/**
 * Editorial photo frame — one consistent radius / gold hairline / shadow + a
 * warm bottega grade overlay so every photograph on the site reads as one set.
 * Wraps a fill `next/image`; the wrapper is the positioned parent.
 */
export function Figure({
  src,
  alt,
  sizes,
  quality = 95,
  priority,
  radius = "16px",
  grade = true,
  className = "",
  imgClassName = "object-cover",
}: {
  src: string;
  alt: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  /** border radius (any CSS length) — defaults to the editorial 16px */
  radius?: string;
  /** apply the warm grade/vignette overlay */
  grade?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={`figure-frame ${grade ? "photo-grade" : ""} block ${className}`}
      style={{ borderRadius: radius }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={imgClassName}
      />
    </span>
  );
}
