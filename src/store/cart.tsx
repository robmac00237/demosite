"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { CartItem, restoreCart } from "@/lib/pricing";
import { useMenu } from "@/store/menu";
type Store = {
  items: CartItem[];
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, addons: string[], quantity: number) => void;
  quantity: (key: string, n: number) => void;
  clear: () => void;
};
const Context = createContext<Store | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const menuStore = useMenu();
  const hydrated = useRef(false);
  // Hydrate browser storage after mount to preserve identical server/client markup.
  useEffect(() => {
    if (!menuStore.ready || hydrated.current) return;
    hydrated.current = true;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- One-time hydration from external browser storage.
      setItems(
        restoreCart(
          JSON.parse(localStorage.getItem("griddle-club-cart-v1") ?? "[]"),
          menuStore.products,
        ),
      );
    } catch {}
    setReady(true);
  }, [menuStore.products, menuStore.ready]);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("griddle-club-cart-v1", JSON.stringify(items));
      } catch {}
  }, [items, ready]);
  return (
    <Context.Provider
      value={{
        items,
        ready,
        open,
        setOpen,
        add: (id, addons, quantity) => {
          const sorted = [...addons].sort();
          const key = id + ":" + sorted.join(",");
          setItems((old) =>
            old.some((i) => i.key === key)
              ? old.map((i) =>
                  i.key === key
                    ? { ...i, quantity: Math.min(20, i.quantity + quantity) }
                    : i,
                )
              : [
                  ...old,
                  {
                    key,
                    productId: id,
                    addons: sorted,
                    quantity: Math.min(20, quantity),
                  },
                ],
          );
          setOpen(true);
        },
        quantity: (key, n) =>
          setItems((old) =>
            n <= 0
              ? old.filter((i) => i.key !== key)
              : old.map((i) =>
                  i.key === key ? { ...i, quantity: Math.min(20, n) } : i,
                ),
          ),
        clear: () => setItems([]),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const c = useContext(Context);
  if (!c) throw new Error("CartProvider missing");
  return c;
}
