// ============================================================
// Pickup bookings — client-side demo store (localStorage)
//
// Bridges the public /pickup flow to the admin "Prenotazioni" view without a
// backend: a confirmed pickup is persisted in the browser and the admin page
// reads it back, merged with the seeded BOOKINGS. Demo-only — no real data.
// ============================================================
import type { Booking } from "./admin-data";

const KEY = "artigiano_pickup_bookings";
/** Dispatched on the window after a write, so an open admin tab can refresh. */
export const BOOKINGS_EVENT = "artigiano-bookings-change";

/** Read the bookings saved from the pickup flow (newest first). SSR-safe. */
export function loadStoredBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

/** Persist a new booking at the top of the list (cap at 50 for the demo). */
export function saveStoredBooking(booking: Booking): void {
  if (typeof window === "undefined") return;
  try {
    const list = [booking, ...loadStoredBookings()].slice(0, 50);
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(BOOKINGS_EVENT));
  } catch {
    /* ignore quota / serialization errors — demo is best-effort */
  }
}

/** Clear all pickup-originated bookings (e.g. a "reset demo" action). */
export function clearStoredBookings(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(BOOKINGS_EVENT));
  } catch {
    /* ignore */
  }
}
