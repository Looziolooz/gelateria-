"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 40;
const framePath = (i: number) =>
  `/images/hero-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

/**
 * SCROLL-DRIVEN frame sequence for the hero (no autoplay). As the page scrolls
 * horizontally past the hero panel (or vertically on mobile), the chocolate-pour
 * frames are scrubbed 0 → 39. Drawn on a canvas (object-cover + slight zoom to
 * crop the baked letterbox bars).
 */
export function HeroSequence({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = framePath(i);
      images.push(img);
    }

    let current = -1;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const draw = (idx: number) => {
      const img = images[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      const ZOOM = 1.2;
      let dw: number, dh: number;
      if (ir > cr) {
        dh = ch * ZOOM;
        dw = dh * ir;
      } else {
        dw = cw * ZOOM;
        dh = dw / ir;
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // 0 → 1 across the hero panel's own scroll distance (one viewport).
    const progress = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        const track = document.querySelector<HTMLElement>(".hs-track");
        const w = window.innerWidth || 1;
        const x = track ? track.scrollLeft : 0;
        return Math.max(0, Math.min(1, x / w));
      }
      const h = window.innerHeight || 1;
      return Math.max(0, Math.min(1, window.scrollY / h));
    };

    let raf = 0;
    const loop = () => {
      const idx = Math.round(progress() * (FRAME_COUNT - 1));
      if (idx !== current) {
        current = idx;
        draw(idx);
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      sizeCanvas();
      draw(Math.max(0, current));
    };

    sizeCanvas();
    images[0].onload = () => draw(current < 0 ? 0 : current);
    if (images[0].complete) draw(0);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
