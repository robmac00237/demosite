"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Minus, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { money } from "@/data/demo-menu";
import { ProductDetail } from "./products";
import { useMenu } from "@/store/menu";
type Message = { role: "user" | "assistant"; text: string; ids?: string[] };
export function Assistant() {
  const { products } = useMenu();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("Demo menu guide");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey, hungry? Let’s find your next favourite. I can help you explore our fictional menu. What are you craving?",
    },
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, busy, open]);
  async function send(text: string) {
    if (!text.trim() || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: AbortSignal.timeout(12000),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setMode(
        data.mode === "cohere"
          ? "Menu guide · Powered by Cohere"
          : "Demo menu guide · Local matching",
      );
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.message, ids: data.ids },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "The menu guide couldn’t connect. Try again, or explore the menu directly.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="assistant-launch"
        aria-expanded={open}
        aria-controls="menu-assistant"
        onClick={() => setOpen(!open)}
      >
        <Sparkles size={20} />
        <span>Got a craving?</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.section
            id="menu-assistant"
            aria-label="Menu assistant"
            className="assistant-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            <div className="assistant-head">
              <Sparkles />
              <div>
                <b>Your flavour finder</b>
                <small>{mode}</small>
              </div>
              <button
                className="icon"
                aria-label="Minimize assistant"
                onClick={() => setOpen(false)}
              >
                <Minus size={18} />
              </button>
              <button
                className="icon"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="chat-messages" role="log" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <p>{m.text}</p>
                  {m.ids?.map((id) => {
                    const p = products.find((product) => product.id === id);
                    return p ? (
                      <button
                        className="recommendation"
                        key={id}
                        onClick={() => setSelected(id)}
                      >
                        {p.name}
                        <span>{money(p.price)} · Customize</span>
                      </button>
                    ) : null;
                  })}
                </div>
              ))}
              {busy && (
                <p className="typing" role="status">
                  Finding your flavour…
                </p>
              )}
              <div ref={end} />
            </div>
            <div className="suggestions">
              {["What should I try?", "Under $20", "Spiciest burger?"].map(
                (q) => (
                  <button disabled={busy} key={q} onClick={() => send(q)}>
                    {q}
                  </button>
                ),
              )}
            </div>
            <form
              className="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={field}
                aria-label="Ask the menu assistant"
                placeholder="Tell us what you’re craving…"
                maxLength={500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="icon"
                aria-label="Send message"
                disabled={busy || !input.trim()}
              >
                <Send size={20} />
              </button>
            </form>
            <p className="chat-note">
              Fictional menu only. Don’t share personal information.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
      {selected && (
        <ProductDetail
          product={products.find((product) => product.id === selected)!}
          close={() => setSelected(null)}
        />
      )}
    </>
  );
}
