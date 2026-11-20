"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { categories } from "@/data/demo-menu";
import { ProductCard } from "@/components/products";
import { useMenu } from "@/store/menu";
export default function MenuPage() {
  const { products, ready } = useMenu();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = products.filter(
    (p) =>
      p.available !== false &&
      (category === "All" || p.category === category) &&
      `${p.name} ${p.description} ${p.ingredients.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main id="main" className="menu-page section">
      <span className="eyebrow">FICTIONAL MENU. SERIOUS CRAVINGS.</span>
      <div className="menu-title">
        <h1>
          PICK YOUR
          <br />
          <span>HAPPY PLACE.</span>
        </h1>
        <p>
          Make it yours. Stack it high.
          <br />
          Sample prices in CAD. No real orders.
        </p>
      </div>
      <div className="menu-tools">
        <div className="categories" aria-label="Menu categories">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Search menu"
            placeholder="Find your craving…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="small" aria-live="polite">
        {ready ? filtered.length : "…"} sample{" "}
        {filtered.length === 1 ? "item" : "items"}
      </p>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No bites found.</h2>
          <p>Try another search or explore all the favourites.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </main>
  );
}
