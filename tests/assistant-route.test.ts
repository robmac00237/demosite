import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/assistant/route";
const request = (body: unknown) =>
  new NextRequest("http://localhost/api/assistant", {
    method: "POST",
    body: JSON.stringify(body),
  });
test("API rejects null, missing, empty and oversized message inputs", async () => {
  for (const body of [null, {}, { message: "" }, { message: "x".repeat(501) }])
    assert.equal((await POST(request(body))).status, 400);
});
test("API works without credentials and does not invent menu items", async () => {
  const previous = process.env.COHERE_API_KEY;
  delete process.env.COHERE_API_KEY;
  try {
    const r = await POST(request({ message: "spiciest burger" }));
    const data = await r.json();
    assert.equal(r.status, 200);
    assert.equal(data.mode, "demo");
    assert.deepEqual(data.ids, ["heat"]);
  } finally {
    if (previous) process.env.COHERE_API_KEY = previous;
  }
});
test("Cohere output is constrained and visitor text is never forwarded", async () => {
  const oldFetch = globalThis.fetch;
  const key = process.env.COHERE_API_KEY;
  process.env.COHERE_API_KEY = "test-only";
  let outbound = "";
  globalThis.fetch = async (_url, init) => {
    outbound = String(init?.body);
    return new Response(
      JSON.stringify({
        message: {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ids: ["invented", "combo", "original"] }),
            },
          ],
        },
      }),
    );
  };
  try {
    const data = await (
      await POST(request({ message: "My name is PrivatePerson. Under $20" }))
    ).json();
    assert.deepEqual(data.ids, ["original"]);
    assert.ok(!outbound.includes("PrivatePerson"));
    assert.ok(!outbound.includes("Under $20"));
  } finally {
    globalThis.fetch = oldFetch;
    if (key) process.env.COHERE_API_KEY = key;
    else delete process.env.COHERE_API_KEY;
  }
});
