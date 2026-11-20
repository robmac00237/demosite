"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import {
  categories,
  money,
  type Category,
  type Product,
} from "@/data/demo-menu";
import { addonsToText, textToAddons } from "@/lib/menu-admin";
import { useMenu } from "@/store/menu";

const imageOptions = [
  ["Burger", "/images/burger.webp"],
  ["Chicken", "/images/chicken.webp"],
  ["Fries", "/images/fries.webp"],
  ["Combo", "/images/combo.webp"],
  ["Drink", "/images/drink.webp"],
  ["Dessert", "/images/dessert.webp"],
];

export default function AdminPage() {
  const store = useMenu();
  const [selectedId, setSelectedId] = useState(store.products[0]?.id ?? "");
  const [notice, setNotice] = useState(
    "Changes save automatically in this browser.",
  );
  const importRef = useRef<HTMLInputElement>(null);
  const selected =
    store.products.find((product) => product.id === selectedId) ??
    store.products[0];
  const available = store.products.filter(
    (product) => product.available !== false,
  ).length;
  const average = store.products.length
    ? Math.round(
        store.products.reduce((sum, product) => sum + product.price, 0) /
          store.products.length,
      )
    : 0;
  const categoryCount = useMemo(
    () => new Set(store.products.map((product) => product.category)).size,
    [store.products],
  );

  function update(patch: Partial<Product>, message = "Saved in this browser.") {
    if (!selected) return;
    store.update(selected.id, patch);
    setNotice(message);
  }

  function downloadCatalog() {
    const blob = new Blob([JSON.stringify(store.products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "griddle-club-demo-menu.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Menu JSON downloaded.");
  }

  async function importCatalog(file?: File) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      store.replace(parsed);
      setSelectedId("");
      setNotice("Menu JSON imported and saved in this browser.");
    } catch {
      setNotice(
        "That file could not be imported. Choose a valid menu JSON file.",
      );
    }
    if (importRef.current) importRef.current.value = "";
  }

  return (
    <main id="main" className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">
            GRIDDLE CLUB · DEMONSTRATION CONTROL ROOM
          </span>
          <h1>
            MENU,
            <br />
            <span>YOUR WAY.</span>
          </h1>
        </div>
        <div className="admin-intro">
          <div className="demo-badge">DEMO ADMIN · BROWSER-ONLY</div>
          <p>
            Edit the fictional menu and watch the public experience change. This
            prototype stores changes only on this device and is not a secure
            production admin system.
          </p>
          <Link className="text-link" href="/menu">
            Open public menu
          </Link>
        </div>
      </section>

      <section className="admin-stats" aria-label="Menu summary">
        <div>
          <span>Total items</span>
          <strong>{store.products.length}</strong>
        </div>
        <div>
          <span>Available now</span>
          <strong>{available}</strong>
        </div>
        <div>
          <span>Categories</span>
          <strong>{categoryCount}</strong>
        </div>
        <div>
          <span>Average sample price</span>
          <strong>{money(average)}</strong>
        </div>
      </section>

      <section className="admin-workspace">
        <aside className="admin-catalog" aria-label="Demo catalog">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">CATALOG</span>
              <h2>Sample items</h2>
            </div>
            <button
              className="admin-icon-button"
              aria-label="Add menu item"
              onClick={() => {
                const product = store.add();
                setSelectedId(product.id);
                setNotice("New sample item added.");
              }}
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="admin-product-list">
            {store.products.map((product) => (
              <button
                key={product.id}
                className={
                  product.id === selected?.id
                    ? "admin-product selected"
                    : "admin-product"
                }
                onClick={() => setSelectedId(product.id)}
              >
                <span className="admin-thumb">
                  <Image src={product.image} alt="" fill sizes="64px" />
                </span>
                <span>
                  <b>{product.name}</b>
                  <small>
                    {product.category} · {money(product.price)}
                  </small>
                </span>
                {product.available === false ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            ))}
          </div>
          <button
            className="button full"
            onClick={() => {
              const product = store.add();
              setSelectedId(product.id);
              setNotice("New sample item added.");
            }}
          >
            <Plus size={17} /> Add sample item
          </button>
        </aside>

        {selected && (
          <div className="admin-editor">
            <div className="admin-editor-head">
              <div>
                <span className="eyebrow">EDITING</span>
                <h2>{selected.name}</h2>
              </div>
              <div className="admin-item-actions">
                <button
                  aria-label="Move item up"
                  onClick={() => store.move(selected.id, -1)}
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  aria-label="Move item down"
                  onClick={() => store.move(selected.id, 1)}
                >
                  <ArrowDown size={18} />
                </button>
                <button
                  aria-label="Duplicate item"
                  onClick={() => {
                    const copy = store.duplicate(selected.id);
                    if (copy) setSelectedId(copy.id);
                    setNotice("Sample item duplicated.");
                  }}
                >
                  <Copy size={18} />
                </button>
                <button
                  className="danger"
                  aria-label="Remove item"
                  onClick={() => {
                    if (
                      !window.confirm(
                        `Remove ${selected.name} from this browser demo?`,
                      )
                    )
                      return;
                    const index = store.products.findIndex(
                      (product) => product.id === selected.id,
                    );
                    const next =
                      store.products[index + 1] ?? store.products[index - 1];
                    store.remove(selected.id);
                    setSelectedId(next?.id ?? "");
                    setNotice("Sample item removed.");
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="admin-form-grid">
              <label className="wide">
                Item name
                <input
                  value={selected.name}
                  maxLength={80}
                  onChange={(event) => update({ name: event.target.value })}
                />
              </label>
              <label>
                Sample price (CAD)
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.01"
                  value={(selected.price / 100).toFixed(2)}
                  onChange={(event) =>
                    update({
                      price: Math.max(
                        0,
                        Math.round(Number(event.target.value) * 100) || 0,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={selected.category}
                  onChange={(event) =>
                    update({ category: event.target.value as Category })
                  }
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="wide">
                Description
                <textarea
                  value={selected.description}
                  maxLength={320}
                  onChange={(event) =>
                    update({ description: event.target.value })
                  }
                />
              </label>
              <label>
                Menu badge
                <input
                  value={selected.tag ?? ""}
                  maxLength={50}
                  placeholder="Optional"
                  onChange={(event) =>
                    update({ tag: event.target.value || undefined })
                  }
                />
              </label>
              <label>
                Concept image
                <select
                  value={selected.image}
                  onChange={(event) => update({ image: event.target.value })}
                >
                  {imageOptions.map(([name, path]) => (
                    <option value={path} key={path}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wide">
                Ingredients
                <input
                  value={selected.ingredients.join(", ")}
                  onChange={(event) =>
                    update({
                      ingredients: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <small>
                  Separate ingredients with commas. This remains fictional and
                  is not an allergen declaration.
                </small>
              </label>
              <label className="wide">
                Add-ons and prices
                <textarea
                  value={addonsToText(selected)}
                  placeholder={"Extra cheddar | 1.50\nJalapeños | 1.00"}
                  onChange={(event) =>
                    update({ addons: textToAddons(event.target.value) })
                  }
                />
                <small>Use one add-on per line: Name | price in dollars.</small>
              </label>
            </div>

            <div className="admin-availability">
              <div>
                <b>Visible on the public menu</b>
                <p>Hide an item without deleting its details.</p>
              </div>
              <button
                role="switch"
                aria-checked={selected.available !== false}
                className={
                  selected.available !== false
                    ? "availability-switch on"
                    : "availability-switch"
                }
                onClick={() =>
                  update(
                    { available: selected.available === false },
                    selected.available === false
                      ? "Item is visible."
                      : "Item is hidden from the public menu.",
                  )
                }
              >
                <span />
              </button>
            </div>

            <div className="admin-preview">
              <div className="admin-preview-image">
                <Image
                  src={selected.image}
                  alt={`Preview for ${selected.name}`}
                  fill
                  sizes="320px"
                />
              </div>
              <div>
                <span className="eyebrow">LIVE CARD PREVIEW</span>
                <h3>{selected.name}</h3>
                <b>{money(selected.price)}</b>
                <p>{selected.description}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="admin-utilities">
        <div>
          <Check size={18} />
          <p aria-live="polite">{notice}</p>
        </div>
        <div className="admin-utility-actions">
          <button onClick={downloadCatalog}>
            <Download size={17} /> Download JSON
          </button>
          <button onClick={() => importRef.current?.click()}>
            <Upload size={17} /> Import JSON
          </button>
          <input
            ref={importRef}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => importCatalog(event.target.files?.[0])}
          />
          <button
            className="danger"
            onClick={() => {
              if (
                !window.confirm(
                  "Reset every browser-only menu change to the original demo catalog?",
                )
              )
                return;
              store.reset();
              setSelectedId("");
              setNotice("Original demo catalog restored.");
            }}
          >
            <RotateCcw size={17} /> Reset demo
          </button>
        </div>
      </section>
    </main>
  );
}
