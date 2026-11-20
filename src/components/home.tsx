"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Flame, ChevronDown } from "lucide-react";
import { ProductCard } from "./products";
import { useMenu } from "@/store/menu";
export function Home() {
  const { products } = useMenu();
  const featured = products
    .filter((product) => product.available !== false)
    .slice(0, 3);
  return (
    <main id="main">
      <section className="hero">
        <Image
          src="/images/hero.webp"
          alt="Original generated photograph of a double smash burger with melted cheddar"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow">
            <span className="tiny-line" /> BIG CRAVINGS. NO COMPROMISE.
          </div>
          <h1>
            BETTER
            <br />
            BURGERS.
            <br />
            <span>
              BIGGER
              <br className="mobile-break" /> FLAVOUR.
            </span>
          </h1>
          <p>
            Big cravings deserve bold flavours. Discover a burger experience
            worth coming back for.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/menu">
              Explore menu
            </Link>
            <a className="text-link" href="#featured">
              See what’s cooking
            </a>
          </div>
        </motion.div>
        <div className="hero-stamp">
          <Flame size={24} />
          <span>
            ALL FLAVOUR.
            <br />
            ZERO BORING.
          </span>
        </div>
        <div className="hero-bottom">
          <a href="#featured">
            <ChevronDown size={16} /> SCROLL FOR THE GOOD STUFF
          </a>
          <span>GENERATED FOOD PHOTOGRAPHY · CONCEPT ONLY</span>
        </div>
      </section>
      <div className="flavour-strip">
        <span>SMASHED. STACKED. SAVOURED.</span>
        <span>✳</span>
        <span>GO BIG ON FLAVOUR.</span>
        <span>✳</span>
        <span>GRIDDLE CLUB.</span>
      </div>
      <section className="section" id="featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE CRAVING STARTS HERE</span>
            <h2>
              MEET YOUR
              <br />
              <span className="outline">NEXT OBSESSION.</span>
            </h2>
          </div>
          <div>
            <p>
              A few bold ideas from our concept kitchen.
              <br />
              Fictional menu. Very real appetite.
            </p>
            <Link className="text-link" href="/menu">
              View the full sample menu
            </Link>
          </div>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
        <p className="image-note">
          All food imagery is AI-generated. All items and CAD prices are for
          demonstration.
        </p>
      </section>
      <section id="story" className="story">
        <div className="story-photo">
          <Image
            src="/images/combo.webp"
            alt="Generated concept burger, fries and citrus drink"
            fill
            sizes="(max-width:700px) 100vw, 50vw"
          />
          <span className="photo-caption">THE FULL SEND · CONCEPT MEAL</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">A FRESH TAKE ON THE BURGER JOINT</span>
          <h2>
            GOOD FOOD.
            <br />
            GREAT COMPANY.
            <br />
            <span>NO SMALL BITES.</span>
          </h2>
          <p>
            This is our idea of a burger place worth gathering around. Crisp
            edges. Melting cheese. Fries you don’t want to share. An experience
            that starts before the first bite.
          </p>
          <p className="small">
            A creative vision by Mackay Design, inspired by a local New
            Brunswick restaurant. This is concept storytelling, not the
            restaurant’s history.
          </p>
          <Link className="text-link" href="/menu">
            Find your flavour
          </Link>
        </div>
      </section>
      <section className="cta">
        <span className="eyebrow">YOUR NEXT GREAT BITE IS WAITING</span>
        <h2>
          COME HUNGRY.
          <br />
          LEAVE INSPIRED.
        </h2>
        <Link className="button dark" href="/menu">
          Build your demo order
        </Link>
        <span className="cta-star">✳</span>
      </section>
    </main>
  );
}
