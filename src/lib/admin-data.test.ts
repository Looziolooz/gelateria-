import { describe, it, expect } from "vitest";
import {
  ORDERS,
  KPIS,
  BOOKINGS,
  BOOKING_KPIS,
  INVENTORY_WITH_STATUS,
  euro,
} from "@/lib/admin-data";

const TODAY = "2026-06-16";

describe("euro formatter (it-IT)", () => {
  it("uses a comma decimal and the € symbol", () => {
    expect(euro(4.5)).toMatch(/4,5/);
    expect(euro(10)).toContain("€");
  });
  it("drops decimals for whole amounts", () => {
    expect(euro(10)).not.toMatch(/,/);
  });
});

describe("order KPIs", () => {
  const todayOrders = ORDERS.filter((o) => o.date === TODAY && o.status !== "Annullato");

  it("counts only today's non-cancelled orders", () => {
    expect(KPIS.ordiniOggi).toBe(todayOrders.length);
  });

  it("sums today's revenue", () => {
    const expected = todayOrders.reduce((s, o) => s + o.total, 0);
    expect(KPIS.fatturatoOggi).toBeCloseTo(expected, 5);
  });

  it("derives the average ticket from revenue / orders", () => {
    const expected = KPIS.ordiniOggi ? KPIS.fatturatoOggi / KPIS.ordiniOggi : 0;
    expect(KPIS.scontrinoMedio).toBeCloseTo(expected, 5);
  });

  it("counts today's pickup orders", () => {
    const expected = todayOrders.filter((o) => o.channel === "Pickup").length;
    expect(KPIS.pickupOggi).toBe(expected);
  });

  it("low-stock count matches inventory below par / empty", () => {
    const expected = INVENTORY_WITH_STATUS.filter((i) => i.status !== "Disponibile").length;
    expect(KPIS.lowStock).toBe(expected);
  });
});

describe("inventory status derivation", () => {
  it("flags an out-of-stock item as Esaurito", () => {
    const empty = INVENTORY_WITH_STATUS.find((i) => i.stockKg === 0);
    expect(empty?.status).toBe("Esaurito");
  });
  it("flags below-par stock as In esaurimento", () => {
    const low = INVENTORY_WITH_STATUS.find((i) => i.stockKg > 0 && i.stockKg < i.parKg);
    expect(low?.status).toBe("In esaurimento");
  });
});

describe("booking KPIs", () => {
  it("counts today's non-cancelled bookings", () => {
    const expected = BOOKINGS.filter((b) => b.date === TODAY && b.status !== "Annullata").length;
    expect(BOOKING_KPIS.oggi).toBe(expected);
  });
  it("counts bookings still to prepare", () => {
    const expected = BOOKINGS.filter(
      (b) => b.status === "Confermata" || b.status === "In preparazione"
    ).length;
    expect(BOOKING_KPIS.inAttesa).toBe(expected);
  });
});
