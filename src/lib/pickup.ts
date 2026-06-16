// ============================================================
// Pickup helpers — time-slot generation from boutique hours
// ============================================================
import type { Boutique } from "@/lib/data";

export const WEEKDAYS_IT = [
  "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato",
];
export const WEEKDAYS_SHORT_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
export const MONTHS_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isClosedOn(boutique: Boutique, date: Date): boolean {
  return boutique.closedWeekdays.includes(date.getDay());
}

export function formatDateLong(d: Date): string {
  return `${WEEKDAYS_IT[d.getDay()]} ${d.getDate()} ${MONTHS_IT[d.getMonth()]}`;
}

/** Next `count` calendar days starting today. */
export function upcomingDays(now: Date, count = 14): Date[] {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push(d);
  }
  return out;
}

/**
 * Generate 30-minute pickup slots for a boutique on a given date.
 * - returns [] when the boutique is closed that weekday
 * - last slot is 30 min before closing
 * - for "today" only slots at least 30 min in the future are offered
 */
export function generateSlots(boutique: Boutique, date: Date, now: Date): string[] {
  if (isClosedOn(boutique, date)) return [];
  const open = timeToMinutes(boutique.open);
  const close = timeToMinutes(boutique.close);
  const lastStart = close - 30;
  const slots: string[] = [];
  const today = sameDay(date, now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let t = open; t <= lastStart; t += 30) {
    if (today && t <= nowMin + 30) continue;
    slots.push(minutesToTime(t));
  }
  return slots;
}
