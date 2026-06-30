"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, HS_TRACK_SELECTOR, prefersReducedMotion } from "@/lib/motion";

const TOTAL = 100;
const PAD = (n: number) => String(n + 1).padStart(3, "0");

/** smoothstep 0→1 between edges a and b */
function smooth(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function HeroSequence({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  // Canvas frame scrub + title drift — read the track's scrollLeft over the
  // hero's first two viewports. The source frames are only 1136px wide, so we
  // keep the backing store modest (cap dpr) to avoid over-upscaling them into a
  // mush of pixels, and the cream feather (page.tsx) dissolves the frame edges
  // into the page so there is no visible border.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stack = stackRef.current;

    let currentFrame = -1;
    let loaded = 0;
    const frames: HTMLImageElement[] = [];

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const draw = (i: number) => {
      const img = frames[i];
      if (!img?.complete || img.naturalWidth === 0) return;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const ir = iw / ih, cr = cw / ch;
      let dw: number, dh: number;
      if (ir > cr) {
        dh = ch;
        dw = dh * ir;
      } else {
        dw = cw;
        dh = dw / ir;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const progress = () => {
      const track = document.querySelector<HTMLElement>(HS_TRACK_SELECTOR);
      const w = window.innerWidth || 1;
      const x = track ? track.scrollLeft : 0;
      return Math.max(0, Math.min(1, x / (w * 2)));
    };

    let raf = 0;
    let lastP = -1;
    const loop = () => {
      const p = progress();
      if (loaded === TOTAL) {
        const idx = Math.floor(p * (TOTAL - 1));
        if (idx !== currentFrame) {
          currentFrame = idx;
          draw(idx);
        }
      }
      if (p !== lastP && stack) {
        lastP = p;
        const out = smooth(0.18, 0.55, p);
        stack.style.transform = `translate3d(${-out * 7}vw, ${-out * 14}vh, 0)`;
        stack.style.opacity = String(1 - out);
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      size();
      if (currentFrame >= 0) draw(currentFrame);
    };

    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; };
      img.src = `/images/hero-frames/ezgif-frame-${PAD(i)}.webp`;
      frames.push(img);
    }

    size();
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Entrance — masked title rises line by line on load.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const masks = overlay.querySelectorAll<HTMLElement>(".hero-mask > *");

    if (prefersReducedMotion()) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(masks, { yPercent: 0, opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.out } });
    tl.set(overlay, { autoAlpha: 1 })
      .from(masks, { yPercent: 118, opacity: 0, duration: 1.25, stagger: 0.16 }, 0.15);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden />

      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 flex flex-col justify-end px-[6vw] pb-[16vh] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div ref={stackRef} className="max-w-[min(92vw,1100px)] will-change-transform">
          <div className="hero-mask overflow-hidden mb-3">
            <p className="core c-secondary t-u fs-16 fs-m-12" style={{ letterSpacing: "0.28em" }}>
              Artigiano Gelateria
            </p>
          </div>
          <h1 className="title caviar fs-120 fs-m-50 t-lh-1 t-u italic c-secondary m-0">
            <span className="hero-mask block overflow-hidden">
              <span className="block">Gelato</span>
            </span>
            <span className="hero-mask block overflow-hidden">
              <span className="block">per amore</span>
            </span>
          </h1>
          <div className="hero-mask overflow-hidden mt-4">
            <span
              className="cormorant block text-[34px] md:text-[44px] leading-none"
              style={{ color: "var(--color-primary)" }}
            >
              dal 1978
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
