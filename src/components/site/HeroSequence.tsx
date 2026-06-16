"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 40;
const FPS = 14;
const framePath = (i: number) =>
  `/images/hero-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

/**
 * Looping frame animation for the hero (chocolate being poured), drawn on a
 * canvas with object-cover + a slight zoom to crop the baked letterbox bars.
 * Auto-plays continuously and pauses when the hero scrolls out of view.
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

    let frame = 0;
    let visible = true;
    let last = 0;
    const interval = 1000 / FPS;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const ZOOM = 1.2; // crop the baked-in letterbox bars
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

    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!last) last = t;
      if (reduce) {
        draw(0);
        return;
      }
      if (t - last >= interval) {
        last = t;
        frame = (frame + 1) % FRAME_COUNT;
        draw(frame);
      }
    };

    const onResize = () => {
      sizeCanvas();
      draw(frame);
    };

    sizeCanvas();
    images[0].onload = () => draw(frame);
    if (images[0].complete) draw(0);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
