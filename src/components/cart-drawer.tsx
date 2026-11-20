"use client";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { money } from "@/data/demo-menu";
import { totals, unitPrice, taxRate } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { Dialog } from "./dialog";
import { Quantity } from "./products";
import { useMenu } from "@/store/menu";
export function CartLines() {
  const c = useCart();
  const { products } = useMenu();
  return (
    <>
      {c.items.map((i) => {
        const p = products.find((product) => product.id === i.productId);
        if (!p) return null;
        return (
          <div className="cart-line" key={i.key}>
            <div>
              <h3>{p.name}</h3>
              <p className="small">
                {p.addons
                  .filter((a) => i.addons.includes(a.id))
                  .map((a) => a.name)
                  .join(", ") || "Original recipe"}
              </p>
              <Quantity
                value={i.quantity}
                onChange={(n) => c.quantity(i.key, n)}
              />
            </div>
            <div>
              <b>{money(unitPrice(i, products) * i.quantity)}</b>
              <button
                className="icon"
                aria-label={`Remove ${p.name}`}
                onClick={() => c.quantity(i.key, 0)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
export function OrderTotals() {
  const c = useCart();
  const { products } = useMenu();
  const t = totals(c.items, taxRate, products);
  return (
    <div className="totals">
      <div>
        <span>Subtotal</span>
        <span>{money(t.subtotal)}</span>
      </div>
      <div>
        <span>Illustrative tax ({Math.round(taxRate * 100)}%)</span>
        <span>{money(t.tax)}</span>
      </div>
      <div className="grand-total">
        <span>Estimated total</span>
        <span>{money(t.total)}</span>
      </div>
      <p className="small">Demonstration prices in CAD.</p>
    </div>
  );
}
export function CartDrawer() {
  const c = useCart();
  if (!c.open) return null;
  return (
    <Dialog title="Your demo cart" close={() => c.setOpen(false)} drawer>
      <span className="eyebrow">GOOD TASTE. GREAT CHOICES.</span>
      <h2>Your bag.</h2>
      {c.items.length ? (
        <>
          <CartLines />
          <OrderTotals />
          <Link
            href="/checkout"
            className="button full"
            onClick={() => c.setOpen(false)}
          >
            Continue to demo checkout
          </Link>
          <p className="small">
            No real orders. No payments. Just a taste of what’s possible.
          </p>
        </>
      ) : (
        <div className="empty">
          <ShoppingBag size={46} />
          <h3>A craving starts here.</h3>
          <p>Pick something delicious from the sample menu.</p>
          <Link
            className="button"
            href="/menu"
            onClick={() => c.setOpen(false)}
          >
            Explore the menu
          </Link>
        </div>
      )}
    </Dialog>
  );
}
