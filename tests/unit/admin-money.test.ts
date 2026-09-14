import { describe, expect, it } from "vitest";
import { calculateDocument, scaled } from "@/features/admin/money";
import { documentSchema } from "@/features/admin/schema";
import en from "../../messages/admin/en.json";
import fr from "../../messages/admin/fr.json";
import ar from "../../messages/admin/ar.json";

const item = (unitPrice: string, quantity = "1", taxRate = "0") => ({
  description: "Service",
  unitPrice,
  quantity,
  taxRate,
});
describe("exact financial calculations", () => {
  it("adds fractional prices exactly", () =>
    expect(
      calculateDocument({ items: [item("0.10"), item("0.20")], discount: "0" })
        .total,
    ).toBe(30));
  it("rounds fractional quantities half-up", () =>
    expect(
      calculateDocument({ items: [item("0.01", "0.5")], discount: "0" }).total,
    ).toBe(1));
  it("allocates discount remainders before mixed tax rates", () => {
    const result = calculateDocument({
      items: [
        item("10.00", "1", "20"),
        item("10.00", "1", "10"),
        item("10.00", "1", "0"),
      ],
      discount: "1.00",
    });
    expect(result.items.map((i) => i.discount)).toEqual([34, 33, 33]);
    expect(result.subtotal).toBe(3000);
    expect(result.tax).toBe(290);
    expect(result.total).toBe(3190);
  });
  it("handles a full discount and zero totals", () =>
    expect(
      calculateDocument({ items: [item("1", "1", "20")], discount: "1" }).total,
    ).toBe(0));
  it("rejects excessive discounts and overflow", () => {
    expect(() =>
      calculateDocument({ items: [item("1")], discount: "2" }),
    ).toThrow("discount_exceeds_subtotal");
    expect(() =>
      calculateDocument({
        items: [item("999999999.99", "999999")],
        discount: "0",
      }),
    ).toThrow("money_range");
  });
  it.each(["NaN", "Infinity", "-1", "1e3", "0.001", "1,20"])(
    "rejects malformed money %s",
    (value) => expect(() => scaled(value)).toThrow(),
  );
  it("rejects browser totals, statuses and malformed dates", () => {
    const input = {
      clientId: "891d4c7f-9a75-4b7d-8cf3-44b9f67f3b94",
      issueDate: "2026-08-29",
      dueDate: "2026-09-01",
      currency: "MAD",
      items: [item("5")],
      discount: "0",
      notes: "",
      terms: "",
    };
    expect(documentSchema.safeParse(input).success).toBe(true);
    for (const extra of [
      { total: 1 },
      { status: "PAID" },
      { dueDate: "2026-02-30" },
      { dueDate: "2025-01-01" },
      { items: [] },
      { items: [item("1", "0")] },
    ])
      expect(documentSchema.safeParse({ ...input, ...extra }).success).toBe(
        false,
      );
  });
});
function paths(value: unknown, prefix = ""): string[] {
  return value && typeof value === "object"
    ? Object.entries(value).flatMap(([key, child]) =>
        paths(child, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];
}
describe("admin translations", () => {
  it("has identical nonempty keys in English, French and Arabic", () => {
    expect(paths(fr).sort()).toEqual(paths(en).sort());
    expect(paths(ar).sort()).toEqual(paths(en).sort());
    for (const messages of [en, fr, ar])
      expect(JSON.stringify(messages)).not.toContain(':""');
  });
  it("contains real Arabic labels", () => {
    for (const value of Object.values(ar.nav))
      expect(value).toMatch(/[\u0600-\u06ff]/);
    for (const value of Object.values(ar.errors))
      expect(value).toMatch(/[\u0600-\u06ff]/);
  });
});
