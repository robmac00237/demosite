import { menu, type Product } from "@/data/demo-menu";
export type CartItem = {
  key: string;
  productId: string;
  addons: string[];
  quantity: number;
};
const configured = Number(process.env.NEXT_PUBLIC_DEMO_TAX_RATE ?? 0.15);
export const taxRate =
  Number.isFinite(configured) && configured >= 0 && configured <= 1
    ? configured
    : 0.15;
export function unitPrice(item: CartItem, catalog: Product[] = menu) {
  const p = catalog.find((product) => product.id === item.productId);
  return p
    ? p.price +
        p.addons
          .filter((a) => item.addons.includes(a.id))
          .reduce((s, a) => s + a.price, 0)
    : 0;
}
export function totals(
  items: CartItem[],
  rate = taxRate,
  catalog: Product[] = menu,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + unitPrice(item, catalog) * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * rate);
  return { subtotal, tax, total: subtotal + tax };
}
export function restoreCart(
  value: unknown,
  catalog: Product[] = menu,
): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 50).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const p = catalog.find((product) => product.id === raw.productId);
    if (
      !p ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1 ||
      raw.quantity > 20 ||
      !Array.isArray(raw.addons)
    )
      return [];
    const addons = p.addons
      .filter((a) => raw.addons.includes(a.id))
      .map((a) => a.id)
      .sort();
    return [
      {
        key: p.id + ":" + addons.join(","),
        productId: p.id,
        quantity: raw.quantity,
        addons,
      },
    ];
  });
}
