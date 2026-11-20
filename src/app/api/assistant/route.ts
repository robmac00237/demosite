import { NextRequest, NextResponse } from "next/server";
import { menu } from "@/data/demo-menu";
import {
  fallbackIds,
  isSafetyQuestion,
  makeAnswer,
} from "@/lib/cohere/assistant";
export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > 6000)
    return NextResponse.json({ error: "Message too long." }, { status: 413 });
  let body;
  try {
    const raw = await req.text();
    if (raw.length > 6000)
      return NextResponse.json({ error: "Message too long." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    typeof body.message !== "string" ||
    !body.message.trim() ||
    body.message.length > 500
  )
    return NextResponse.json(
      { error: "Send a message between 1 and 500 characters." },
      { status: 400 },
    );
  const message = body.message;
  let ids = fallbackIds(message);
  let mode = "demo";
  // Cohere sees only menu-selection keywords, never raw visitor messages or checkout data.
  if (
    process.env.COHERE_API_KEY &&
    !isSafetyQuestion(message) &&
    !/hours|address|phone|open|deliver|policy|available|availability/i.test(
      message,
    )
  ) {
    try {
      const intent = `Recommend from these locally matched menu IDs: ${ids.join(", ") || "none"}. Return only IDs from this set.`;
      const response = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.COHERE_MODEL || "command-a-03-2025",
          messages: [
            {
              role: "system",
              content: `Return JSON only: {"ids":["product-id"]}, at most 3 IDs from this fictional catalog. Match intent. No additional fields. Catalog: ${JSON.stringify(menu.map(({ id, name, price, description, ingredients }) => ({ id, name, priceCents: price, description, ingredients })))}`,
            },
            { role: "user", content: intent },
          ],
          response_format: { type: "json_object" },
          max_tokens: 120,
        }),
        signal: AbortSignal.timeout(7000),
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(
          data.message.content.find((c: { type: string }) => c.type === "text")
            ?.text ?? "{}",
        );
        if (Array.isArray(parsed.ids)) {
          const valid = parsed.ids.filter(
            (id: unknown) =>
              typeof id === "string" &&
              ids.includes(id) &&
              menu.some((p) => p.id === id),
          );
          if (valid.length) {
            ids = [...new Set(valid)] as string[];
            ids = ids.slice(0, 3);
            mode = "cohere";
          }
        }
      }
    } catch {
      /* Deterministic fallback is always available. */
    }
  }
  return NextResponse.json(
    { ...makeAnswer(ids, message), mode },
    { headers: { "Cache-Control": "no-store" } },
  );
}
