"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { menu, type Product } from "@/data/demo-menu";
import {
  MENU_STORAGE_KEY,
  createProduct,
  duplicateProduct,
  normalizeProducts,
} from "@/lib/menu-admin";

type MenuStore = {
  products: Product[];
  ready: boolean;
  update: (id: string, patch: Partial<Product>) => void;
  add: () => Product;
  duplicate: (id: string) => Product | null;
  remove: (id: string) => void;
  move: (id: string, direction: -1 | 1) => void;
  replace: (products: Product[]) => void;
  reset: () => void;
};

const Context = createContext<MenuStore | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(menu);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- One-time hydration from browser storage.
        setProducts(normalizeProducts(JSON.parse(saved)));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(products));
    } catch {}
  }, [products, ready]);

  return (
    <Context.Provider
      value={{
        products,
        ready,
        update: (id, patch) =>
          setProducts((current) =>
            current.map((product) =>
              product.id === id
                ? { ...product, ...patch, id: product.id }
                : product,
            ),
          ),
        add: () => {
          const product = createProduct(products);
          setProducts((current) => [...current, product]);
          return product;
        },
        duplicate: (id) => {
          const source = products.find((product) => product.id === id);
          if (!source) return null;
          const product = duplicateProduct(source, products);
          setProducts((current) => [...current, product]);
          return product;
        },
        remove: (id) =>
          setProducts((current) =>
            current.length > 1
              ? current.filter((product) => product.id !== id)
              : current,
          ),
        move: (id, direction) =>
          setProducts((current) => {
            const index = current.findIndex((product) => product.id === id);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= current.length)
              return current;
            const next = [...current];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
          }),
        replace: (next) => setProducts(normalizeProducts(next)),
        reset: () => setProducts(menu),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useMenu() {
  const value = useContext(Context);
  if (!value) throw new Error("MenuProvider missing");
  return value;
}
