import { menu, money } from "@/data/demo-menu";
export function isSafetyQuestion(text: string) {
  return /allerg|safe|gluten|celiac|coeliac|nut.free|dairy.free|vegan|vegetarian|halal|kosher|pregnan/i.test(
    text,
  );
}
export function fallbackIds(text: string): string[] {
  if (/spic|hot|heat/i.test(text)) return ["heat"];
  if (/hungry|meal|fries|dinner|combo/i.test(text)) return ["combo"];
  if (/under|budget|cheap|\$|dollar/i.test(text)) {
    const cap =
      Number(
        text.match(/(?:under|\$|budget(?: of)?)\s*(\d+(?:\.\d+)?)/i)?.[1] ?? 20,
      ) * 100;
    return menu
      .filter((p) => p.price < cap)
      .slice(0, 3)
      .map((p) => p.id);
  }
  if (/chicken/i.test(text)) return ["chicken"];
  if (/drink|thirst/i.test(text)) return ["citrus"];
  if (/dessert|sweet|chocolate/i.test(text)) return ["brownie"];
  return ["original", "chicken"];
}
export function makeAnswer(ids: string[], text: string) {
  if (isSafetyQuestion(text))
    return {
      message:
        "This menu is fictional and cannot establish actual food or allergen safety. Contact the real restaurant directly about ingredients, cross-contact and dietary requirements.",
      ids: [],
    };
  if (
    /hours|address|phone|open|deliver|policy|available|availability/i.test(text)
  )
    return {
      message:
        "Griddle Club is a fictional concept, so it has no real hours, location, availability or restaurant policies.",
      ids: [],
    };
  const products = menu.filter((p) => ids.includes(p.id));
  return {
    message: products.length
      ? `From our fictional sample menu: ${products.map((p) => `${p.name} (${money(p.price)} CAD) — ${p.description}`).join("\n\n")}\n\nSample prices before illustrative tax and add-ons. No real orders or availability implied.`
      : "No sample items match that budget. Try a higher amount or browse the full menu.",
    ids: products.map((p) => p.id),
  };
}
