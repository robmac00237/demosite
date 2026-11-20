import {
  categories,
  menu,
  type Category,
  type Product,
} from "@/data/demo-menu";

export const MENU_STORAGE_KEY = "griddle-club-menu-v1";

const validImages = new Set([
  "/images/burger.webp",
  "/images/chicken.webp",
  "/images/fries.webp",
  "/images/combo.webp",
  "/images/drink.webp",
  "/images/dessert.webp",
]);

export function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100)
    return menu;
  const seen = new Set<string>();
  const products: Product[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const record = raw as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id.slice(0, 80) : "";
    const name =
      typeof record.name === "string" ? record.name.trim().slice(0, 80) : "";
    const description =
      typeof record.description === "string"
        ? record.description.trim().slice(0, 320)
        : "";
    const category = categories.includes(record.category as Category)
      ? (record.category as Category)
      : null;
    const price = Number(record.price);
    if (!id || seen.has(id) || !name || !description || !category) continue;
    if (!Number.isInteger(price) || price < 0 || price > 100000) continue;
    seen.add(id);
    const ingredients = Array.isArray(record.ingredients)
      ? record.ingredients
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 30)
      : [];
    const addons = Array.isArray(record.addons)
      ? record.addons
          .filter(
            (addon): addon is { id: string; name: string; price: number } =>
              Boolean(addon) &&
              typeof addon === "object" &&
              typeof addon.id === "string" &&
              typeof addon.name === "string" &&
              Number.isInteger(Number(addon.price)),
          )
          .map((addon) => ({
            id: addon.id.slice(0, 80),
            name: addon.name.trim().slice(0, 80),
            price: Math.max(0, Math.min(100000, Number(addon.price))),
          }))
          .filter((addon) => addon.id && addon.name)
          .slice(0, 20)
      : [];
    products.push({
      id,
      name,
      description,
      category,
      price,
      image:
        typeof record.image === "string" && validImages.has(record.image)
          ? record.image
          : "/images/burger.webp",
      tag:
        typeof record.tag === "string" && record.tag.trim()
          ? record.tag.trim().slice(0, 50)
          : undefined,
      ingredients,
      addons,
      available: record.available !== false,
    });
  }
  return products.length ? products : menu;
}

export function createProduct(products: Product[]): Product {
  const base = `sample-item-${Date.now().toString(36)}`;
  let id = base;
  let suffix = 2;
  while (products.some((product) => product.id === id))
    id = `${base}-${suffix++}`;
  return {
    id,
    name: "New sample item",
    category: "Signature Burgers",
    description: "Add a short, appetizing description for this fictional item.",
    price: 1200,
    image: "/images/burger.webp",
    ingredients: ["Sample ingredient"],
    addons: [],
    available: true,
  };
}

export function duplicateProduct(
  product: Product,
  products: Product[],
): Product {
  const copy = createProduct(products);
  return { ...product, id: copy.id, name: `${product.name} Copy` };
}

export function addonsToText(product: Product) {
  return product.addons
    .map((addon) => `${addon.name} | ${(addon.price / 100).toFixed(2)}`)
    .join("\n");
}

export function textToAddons(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20)
    .flatMap((line, index) => {
      const [rawName, rawPrice = "0"] = line.split("|");
      const name = rawName.trim().slice(0, 80);
      const price = Math.round(Number(rawPrice.trim()) * 100);
      if (!name || !Number.isFinite(price) || price < 0) return [];
      return [
        {
          id: `${
            name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || "addon"
          }-${index + 1}`,
          name,
          price: Math.min(price, 100000),
        },
      ];
    });
}
