"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { simulateCheckout } from "@/lib/demo-checkout";
import { useCart } from "@/store/cart";
import { CartLines, OrderTotals } from "@/components/cart-drawer";
export default function Checkout() {
  const c = useCart();
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  if (reference)
    return (
      <main id="main" className="section confirmation">
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check size={44} />
        </motion.div>
        <span className="eyebrow">THAT’S A WRAP — SIMULATION COMPLETE</span>
        <h1>
          GREAT TASTE.
          <br />
          <span>GREAT CHOICE.</span>
        </h1>
        <p>
          Your demo reference is <strong>{reference}</strong>.
        </p>
        <p>
          No order was sent to the restaurant and no payment was collected.
          <br />
          There is nothing to pick up.
        </p>
        <Link className="button" href="/menu">
          Back for another look
        </Link>
      </main>
    );
  return (
    <main id="main" className="section checkout">
      <span className="eyebrow">THE FINAL BITE</span>
      <h1>
        MAKE IT
        <br />
        <span>AN ORDER. SORT OF.</span>
      </h1>
      <div className="notice">
        DEMO CHECKOUT — No real order will be placed and no payment will be
        collected.
      </div>
      {!c.ready ? (
        <p>Loading your demo cart…</p>
      ) : !c.items.length ? (
        <div className="empty">
          <h2>Your bag is empty.</h2>
          <Link className="button" href="/menu">
            Explore menu
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              const confirmation = await simulateCheckout();
              setReference(confirmation.reference);
              c.clear();
              setBusy(false);
            }}
          >
            <h2>The imaginary details.</h2>
            <p>
              Use fictional details only. These fields stay in this page and are
              discarded when you leave.
            </p>
            <label>
              Demo name
              <input
                required
                maxLength={60}
                defaultValue="Alex Example"
                autoComplete="off"
              />
            </label>
            <label>
              Pickup preference
              <select defaultValue="soon">
                <option value="soon">Next available — simulation only</option>
                <option value="later">
                  Later this evening — simulation only
                </option>
              </select>
            </label>
            <label>
              Special instructions (fictional only)
              <textarea
                maxLength={300}
                placeholder="For example: extra napkins"
              />
            </label>
            <button className="button full" disabled={busy}>
              {busy
                ? "Creating demo confirmation…"
                : "Complete simulated order"}
            </button>
            <p className="small">
              No payment details required. No personal data is sent or saved.
            </p>
          </form>
          <aside className="summary">
            <h2>Your good choices.</h2>
            <CartLines />
            <OrderTotals />
          </aside>
        </div>
      )}
    </main>
  );
}
