"use client";
import Image from "next/image";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion } from "motion/react";
import { Product, money } from "@/data/demo-menu";
import { useCart } from "@/store/cart";
import { Dialog } from "./dialog";
export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= 20}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <motion.article
        className="product-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <button
          className="product-image"
          onClick={() => setShow(true)}
          aria-label={`Customize ${p.name}`}
        >
          <Image
            src={p.image}
            alt={`Generated concept photograph for ${p.name}`}
            fill
            sizes="(max-width:700px) 95vw, 33vw"
          />
          {p.tag && <span className="tag">{p.tag}</span>}
          <span className="add-circle">
            <Plus />
          </span>
        </button>
        <div className="product-heading">
          <button onClick={() => setShow(true)}>
            <h3>{p.name}</h3>
          </button>
          <span>{money(p.price)}</span>
        </div>
        <p>{p.description}</p>
      </motion.article>
      {show && <ProductDetail product={p} close={() => setShow(false)} />}
    </>
  );
}
export function ProductDetail({
  product: p,
  close,
}: {
  product: Product;
  close: () => void;
}) {
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const price =
    p.price +
    p.addons
      .filter((a) => addons.includes(a.id))
      .reduce((s, a) => s + a.price, 0);
  return (
    <Dialog title={`Customize ${p.name}`} close={close}>
      <div className="detail-image">
        <Image
          src={p.image}
          alt={`Generated ${p.name} concept`}
          fill
          sizes="600px"
        />
      </div>
      <div className="detail-content">
        <span className="eyebrow">MAKE IT YOURS · DEMO ITEM</span>
        <h2>{p.name}</h2>
        <p>{p.description}</p>
        <p className="small">
          Sample ingredients: {p.ingredients.join(", ")}. Fictional menu; not an
          allergen guide.
        </p>
        {p.addons.length > 0 && (
          <fieldset>
            <legend>Add a little extra</legend>
            {p.addons.map((a) => (
              <label className="addon" key={a.id}>
                <span>
                  <input
                    type="checkbox"
                    checked={addons.includes(a.id)}
                    onChange={(e) =>
                      setAddons(
                        e.target.checked
                          ? [...addons, a.id]
                          : addons.filter((id) => id !== a.id),
                      )
                    }
                  />
                  {a.name}
                </span>
                <span>+{money(a.price)}</span>
              </label>
            ))}
          </fieldset>
        )}
        <div className="buy-row">
          <Quantity value={qty} onChange={setQty} />
          <button
            className="button"
            onClick={() => {
              close();
              cart.add(p.id, addons, qty);
            }}
          >
            Add to demo cart · {money(price * qty)}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
