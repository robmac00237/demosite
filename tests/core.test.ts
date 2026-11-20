import { test } from "node:test";
import assert from "node:assert/strict";
import { restoreCart, totals, unitPrice } from "../src/lib/pricing";
import { fallbackIds, makeAnswer } from "../src/lib/cohere/assistant";
import { categories, menu } from "../src/data/demo-menu";
import {
  createProduct,
  normalizeProducts,
  textToAddons,
} from "../src/lib/menu-admin";
test("customized quantities and tax use integer cents", () => {
  const cart = [
    {
      key: "original:cheese",
      productId: "original",
      addons: ["cheese"],
      quantity: 2,
    },
  ];
  assert.equal(unitPrice(cart[0]), 1600);
  assert.deepEqual(totals(cart, 0.15), {
    subtotal: 3200,
    tax: 480,
    total: 3680,
  });
  assert.equal(totals(cart, 0).total, 3200);
});
test("untrusted persisted cart cannot inject price or unknown modifiers", () => {
  assert.deepEqual(
    restoreCart([
      {
        productId: "original",
        quantity: 2,
        addons: ["free", "cheese", "cheese"],
        price: -1,
      },
    ]),
    [
      {
        key: "original:cheese",
        productId: "original",
        quantity: 2,
        addons: ["cheese"],
      },
    ],
  );
  assert.deepEqual(
    restoreCart([
      { productId: "nope", quantity: 2, addons: [] },
      { productId: "original", quantity: -1, addons: [] },
    ]),
    [],
  );
  assert.deepEqual(restoreCart({}), []);
});
test("fallback matches budget, spicy and meal intents", () => {
  assert.deepEqual(fallbackIds("spiciest burger"), ["heat"]);
  assert.deepEqual(fallbackIds("really hungry"), ["combo"]);
  assert.deepEqual(fallbackIds("under $4"), []);
  assert.ok(fallbackIds("under $20").includes("original"));
});
test("allergens and operational questions cannot generate food safety claims", () => {
  assert.match(
    makeAnswer(["original"], "Is it nut free and safe?").message,
    /cannot establish/,
  );
  assert.deepEqual(makeAnswer(["original"], "allergy").ids, []);
  assert.deepEqual(makeAnswer(["original"], "What are your hours?").ids, []);
});
test("expanded fictional catalog covers every category", () => {
  assert.equal(menu.length, 20);
  for (const category of categories) {
    assert.ok(
      menu.filter((product) => product.category === category).length >= 2,
    );
  }
  assert.equal(new Set(menu.map((product) => product.id)).size, menu.length);
});
test("admin catalog normalization rejects malformed and duplicate records", () => {
  const normalized = normalizeProducts([
    menu[0],
    { ...menu[0], name: "Duplicate ID" },
    { id: "bad", name: "", description: "Missing name", price: -2 },
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].id, menu[0].id);
});
test("admin helpers create unique items and parse dollar add-ons into cents", () => {
  const created = createProduct(menu);
  assert.ok(!menu.some((product) => product.id === created.id));
  assert.deepEqual(textToAddons("Extra cheddar | 1.50\nJalapeños | 1.00"), [
    { id: "extra-cheddar-1", name: "Extra cheddar", price: 150 },
    { id: "jalape-os-2", name: "Jalapeños", price: 100 },
  ]);
});
