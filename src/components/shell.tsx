"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import { Menu, X, ShoppingBag, Settings } from "lucide-react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import { CartProvider, useCart } from "@/store/cart";
import { CartDrawer } from "./cart-drawer";
import { Assistant } from "./assistant";
import { disclaimer } from "@/data/demo-menu";
import { MenuProvider } from "@/store/menu";
function Nav() {
  const [open, setOpen] = useState(false);
  const c = useCart();
  const path = usePathname();
  const links = [
    ["Home", "/"],
    ["Menu", "/menu"],
    ["Our story", "/#story"],
    ["Contact", "/#contact"],
  ];
  return (
    <>
      <div className="concept-bar">
        A LITTLE TASTE OF WHAT’S POSSIBLE{" "}
        <span>AN INDEPENDENT MACKAY DESIGN CONCEPT</span>
      </div>
      <header className="header">
        <Link href="/" className="wordmark" aria-label="Griddle Club home">
          GRIDDLE<span>CLUB</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, url]) => (
            <Link
              key={name}
              className={path === url ? "active" : ""}
              href={url}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link className="admin-nav" href="/admin">
            <Settings size={17} />
            <span>Admin demo</span>
          </Link>
          <Link className="button compact order-nav" href="/menu">
            Order demo
          </Link>
          <button
            className="icon bag"
            aria-label={`Open cart, ${c.items.reduce((s, i) => s + i.quantity, 0)} items`}
            onClick={() => c.setOpen(true)}
          >
            <ShoppingBag size={22} />
            <span>{c.items.reduce((s, i) => s + i.quantity, 0)}</span>
          </button>
          <button
            className="icon mobile-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            aria-label="Mobile navigation"
          >
            {links.map(([name, url]) => (
              <Link key={name} href={url} onClick={() => setOpen(false)}>
                {name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MenuProvider>
        <CartProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <Nav />
          {children}
          <footer id="contact">
            <div className="footer-top">
              <Link className="wordmark" href="/">
                GRIDDLE<span>CLUB.</span>
              </Link>
              <p>
                Big ideas. Bigger flavour.
                <br />
                <span className="muted">
                  A restaurant experience, reimagined.
                </span>
              </p>
              <div>
                <Link href="/menu">Explore menu</Link>
                <Link href="/#story">Read the concept story</Link>
                <span>A Mackay Design concept</span>
              </div>
            </div>
            <div className="footer-bottom">
              <p>{disclaimer}</p>
              <p>
                © {new Date().getFullYear()} Mackay Design · Concept artwork and
                sample menu.
                <br />
                Keyboard accessible · Reduced motion supported.
              </p>
            </div>
          </footer>
          <CartDrawer />
          <Assistant />
        </CartProvider>
      </MenuProvider>
    </MotionConfig>
  );
}
