import { AdminError } from "./errors";
import type { DocumentInput } from "./schema";

const MAX_MINOR = BigInt(1_000_000_000_000);
export function scaled(value: string, places = 2): bigint {
  if (!new RegExp(`^\\d{1,9}(\\.\\d{1,${places}})?$`).test(value)) {
    throw new AdminError("validation");
  }
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole + fraction.padEnd(places, "0"));
}

function round(value: bigint, divisor: bigint) {
  return (value + divisor / BigInt(2)) / divisor;
}

function checked(value: bigint): number {
  if (value < BigInt(0) || value > MAX_MINOR)
    throw new AdminError("money_range");
  return Number(value);
}

// Half-up per line; fixed discount is apportioned before tax. All arithmetic
// stays in integers, including three-decimal quantities and discount remainders.
export function calculateDocument(
  input: Pick<DocumentInput, "items" | "discount">,
) {
  const bases = input.items.map((item) =>
    round(scaled(item.quantity, 3) * scaled(item.unitPrice), BigInt(1000)),
  );
  const subtotal = bases.reduce((sum, value) => sum + value, BigInt(0));
  const discount = scaled(input.discount);
  if (discount > subtotal) throw new AdminError("discount_exceeds_subtotal");
  let remaining = discount;
  const allocations = bases.map((base) =>
    subtotal === BigInt(0) ? BigInt(0) : (discount * base) / subtotal,
  );
  remaining -= allocations.reduce((sum, value) => sum + value, BigInt(0));
  for (let index = 0; remaining > BigInt(0); index += 1) {
    if (bases[index] > allocations[index]) {
      allocations[index] += BigInt(1);
      remaining -= BigInt(1);
    }
  }
  const items = input.items.map((item, index) => {
    const base = bases[index];
    const tax = round(
      (base - allocations[index]) * scaled(item.taxRate),
      BigInt(10000),
    );
    return {
      ...item,
      subtotal: checked(base),
      discount: checked(allocations[index]),
      tax: checked(tax),
      total: checked(base - allocations[index] + tax),
    };
  });
  const tax = items.reduce((sum, item) => sum + BigInt(item.tax), BigInt(0));
  return {
    items,
    subtotal: checked(subtotal),
    discount: checked(discount),
    tax: checked(tax),
    total: checked(subtotal - discount + tax),
  };
}

export function decimalFromMinor(value: number) {
  return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
}

export function formatMoney(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value / 100,
  );
}
