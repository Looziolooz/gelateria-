import { describe, it, expect } from "vitest";
import type { Boutique } from "@/lib/data";
import {
  timeToMinutes,
  minutesToTime,
  sameDay,
  isClosedOn,
  upcomingDays,
  generateSlots,
} from "@/lib/pickup";

// Minimal boutique factory — only the fields the pickup helpers read.
function makeBoutique(overrides: Partial<Boutique> = {}): Boutique {
  return {
    id: "test",
    name: "Test",
    city: "Cosenza",
    address: "",
    phone: "",
    phoneHref: "",
    hoursLabel: "",
    open: "12:00",
    close: "23:30",
    closedWeekdays: [],
    image: "",
    mapUrl: "",
    ...overrides,
  };
}

describe("time conversions", () => {
  it("converts HH:mm to minutes", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("12:00")).toBe(720);
    expect(timeToMinutes("23:30")).toBe(1410);
  });

  it("converts minutes back to padded HH:mm", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(1380)).toBe("23:00");
    expect(minutesToTime(540)).toBe("09:00");
  });

  it("round-trips", () => {
    for (const t of ["08:00", "11:30", "19:45", "23:30"]) {
      expect(minutesToTime(timeToMinutes(t))).toBe(t);
    }
  });
});

describe("sameDay", () => {
  it("is true for the same calendar date regardless of time", () => {
    expect(sameDay(new Date(2026, 5, 16, 9, 0), new Date(2026, 5, 16, 22, 30))).toBe(true);
  });
  it("is false across day boundaries", () => {
    expect(sameDay(new Date(2026, 5, 16), new Date(2026, 5, 17))).toBe(false);
  });
});

describe("isClosedOn", () => {
  // 2026-06-15 is a Monday (getDay() === 1).
  const monday = new Date(2026, 5, 15);
  const tuesday = new Date(2026, 5, 16);

  it("is closed on a configured closed weekday", () => {
    expect(isClosedOn(makeBoutique({ closedWeekdays: [1] }), monday)).toBe(true);
  });
  it("is open otherwise", () => {
    expect(isClosedOn(makeBoutique({ closedWeekdays: [1] }), tuesday)).toBe(false);
    expect(isClosedOn(makeBoutique({ closedWeekdays: [] }), monday)).toBe(false);
  });
});

describe("upcomingDays", () => {
  it("returns `count` consecutive days starting today", () => {
    const now = new Date(2026, 5, 16, 14, 0);
    const days = upcomingDays(now, 14);
    expect(days).toHaveLength(14);
    expect(sameDay(days[0], now)).toBe(true);
    expect(sameDay(days[13], new Date(2026, 5, 29))).toBe(true);
  });
});

describe("generateSlots", () => {
  const boutique = makeBoutique({ open: "12:00", close: "23:30", closedWeekdays: [1] });
  // A future, non-today, open weekday so the "today" filter doesn't apply.
  const futureOpenDay = new Date(2026, 5, 16); // Tuesday
  const now = new Date(2026, 5, 16, 14, 0);

  it("returns [] when the boutique is closed that weekday", () => {
    const monday = new Date(2026, 5, 15);
    expect(generateSlots(boutique, monday, now)).toEqual([]);
  });

  it("offers 30-min slots from open to 30 min before close", () => {
    const later = new Date(2026, 6, 7); // a Tuesday weeks ahead (not today)
    const slots = generateSlots(boutique, later, now);
    expect(slots[0]).toBe("12:00");
    expect(slots[slots.length - 1]).toBe("23:00"); // 30 min before 23:30
    // 12:00 → 23:00 inclusive, step 30 → 23 slots
    expect(slots).toHaveLength(23);
  });

  it("hides slots less than 30 min ahead when the date is today", () => {
    const slots = generateSlots(boutique, futureOpenDay, now); // now = 14:00
    // earliest offered slot is strictly after now + 30min (14:30) → 15:00
    expect(slots[0]).toBe("15:00");
    expect(slots).not.toContain("14:00");
    expect(slots).not.toContain("14:30");
  });
});
