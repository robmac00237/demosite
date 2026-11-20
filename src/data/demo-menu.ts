export type Category =
  "Signature Burgers" | "Chicken" | "Sides" | "Combos" | "Drinks" | "Desserts";
export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  tag?: string;
  ingredients: string[];
  addons: { id: string; name: string; price: number }[];
  available?: boolean;
};
const extras = [
  { id: "cheese", name: "Extra cheddar", price: 150 },
  { id: "patty", name: "Extra smash patty", price: 400 },
  { id: "jalapeno", name: "Jalapeños", price: 100 },
];
const chickenExtras = [
  { id: "cheese", name: "Extra cheddar", price: 150 },
  { id: "chicken", name: "Extra crispy chicken", price: 450 },
  { id: "jalapeno", name: "Jalapeños", price: 100 },
];
const sideExtras = [
  { id: "cheese", name: "Cheddar sauce", price: 150 },
  { id: "house-sauce", name: "House sauce", price: 100 },
  { id: "jalapeno", name: "Jalapeños", price: 100 },
];
export const menu: Product[] = [
  {
    id: "original",
    name: "The Original Smash",
    category: "Signature Burgers",
    description:
      "Two crisp-edged beef patties, melting cheddar, pickles and our imagined house sauce. All tucked into a toasted brioche bun.",
    price: 1450,
    image: "/images/burger.webp",
    tag: "THE SIGNATURE",
    ingredients: ["Beef", "Cheddar", "Pickles", "Brioche", "House sauce"],
    addons: extras,
  },
  {
    id: "heat",
    name: "The Heat Seeker",
    category: "Signature Burgers",
    description:
      "Double smash beef, cheddar, jalapeños and smoky hot sauce. A little fire in every bite.",
    price: 1650,
    image: "/images/burger.webp",
    tag: "BRING THE HEAT",
    ingredients: ["Beef", "Cheddar", "Jalapeños", "Hot sauce", "Brioche"],
    addons: extras,
  },
  {
    id: "smoke-show",
    name: "The Smoke Show",
    category: "Signature Burgers",
    description:
      "Double smash beef, smoked cheddar, crisp onions, pickles and sweet barbecue sauce.",
    price: 1750,
    image: "/images/burger.webp",
    tag: "SWEET. SMOKY. STACKED.",
    ingredients: [
      "Beef",
      "Smoked cheddar",
      "Crisp onions",
      "Pickles",
      "Barbecue sauce",
      "Brioche",
    ],
    addons: extras,
  },
  {
    id: "classic-single",
    name: "The Easy Rider",
    category: "Signature Burgers",
    description:
      "One crisp-edged beef patty, cheddar, shredded lettuce, pickles and house sauce.",
    price: 1150,
    image: "/images/burger.webp",
    ingredients: [
      "Beef",
      "Cheddar",
      "Lettuce",
      "Pickles",
      "House sauce",
      "Brioche",
    ],
    addons: extras,
  },
  {
    id: "chicken",
    name: "Golden Hour Chicken",
    category: "Chicken",
    description:
      "Crispy golden chicken, crunchy slaw and pepper mayo on a soft toasted bun.",
    price: 1500,
    image: "/images/chicken.webp",
    ingredients: ["Chicken", "Slaw", "Pepper mayo", "Brioche"],
    addons: chickenExtras,
  },
  {
    id: "hot-honey-chicken",
    name: "Hot Honey Crunch",
    category: "Chicken",
    description:
      "Crispy chicken glazed with hot honey, finished with pickles, slaw and cool ranch sauce.",
    price: 1650,
    image: "/images/chicken.webp",
    tag: "SWEET HEAT",
    ingredients: [
      "Chicken",
      "Hot honey",
      "Pickles",
      "Slaw",
      "Ranch sauce",
      "Brioche",
    ],
    addons: chickenExtras,
  },
  {
    id: "pepper-chicken",
    name: "Black Pepper Bird",
    category: "Chicken",
    description:
      "Crispy chicken, sharp cheddar, shredded lettuce and cracked-pepper mayo.",
    price: 1550,
    image: "/images/chicken.webp",
    ingredients: ["Chicken", "Cheddar", "Lettuce", "Pepper mayo", "Brioche"],
    addons: chickenExtras,
  },
  {
    id: "fries",
    name: "Golden & Loaded",
    category: "Sides",
    description:
      "Golden fries with cheddar sauce, scallions and a generous drizzle of house sauce.",
    price: 750,
    image: "/images/fries.webp",
    tag: "SIDE WITH ATTITUDE",
    ingredients: ["Potato", "Cheddar sauce", "Scallions", "House sauce"],
    addons: sideExtras,
  },
  {
    id: "sea-salt-fries",
    name: "Sea Salt Fries",
    category: "Sides",
    description:
      "Thin, golden fries tossed with sea salt and served ready for dipping.",
    price: 500,
    image: "/images/fries.webp",
    ingredients: ["Potato", "Sea salt"],
    addons: sideExtras,
  },
  {
    id: "fire-fries",
    name: "Afterburner Fries",
    category: "Sides",
    description:
      "Golden fries layered with cheddar sauce, jalapeños and smoky hot sauce.",
    price: 800,
    image: "/images/fries.webp",
    tag: "EXTRA KICK",
    ingredients: ["Potato", "Cheddar sauce", "Jalapeños", "Hot sauce"],
    addons: sideExtras,
  },
  {
    id: "onion-crunch",
    name: "Crispy Onion Crunch",
    category: "Sides",
    description:
      "A shareable pile of crisp battered onion pieces with pepper mayo.",
    price: 650,
    image: "/images/fries.webp",
    ingredients: ["Onion", "Seasoned batter", "Pepper mayo"],
    addons: sideExtras.slice(1),
  },
  {
    id: "combo",
    name: "The Full Send",
    category: "Combos",
    description:
      "The Original Smash, a side of plain golden fries and a sparkling citrus drink. Big appetite, handled.",
    price: 2200,
    image: "/images/combo.webp",
    ingredients: [
      "Original Smash ingredients",
      "Potato",
      "Sparkling citrus drink",
    ],
    addons: extras,
  },
  {
    id: "chicken-combo",
    name: "The Golden Ticket",
    category: "Combos",
    description:
      "Golden Hour Chicken, plain sea salt fries and a sparkling citrus drink.",
    price: 2250,
    image: "/images/combo.webp",
    tag: "FULL MEAL ENERGY",
    ingredients: [
      "Golden Hour Chicken ingredients",
      "Potato",
      "Sparkling citrus drink",
    ],
    addons: chickenExtras,
  },
  {
    id: "heat-combo",
    name: "Turn Up the Heat",
    category: "Combos",
    description:
      "The Heat Seeker, Afterburner Fries and an ice-cold sparkling drink.",
    price: 2450,
    image: "/images/combo.webp",
    ingredients: [
      "Heat Seeker ingredients",
      "Afterburner Fries ingredients",
      "Sparkling drink",
    ],
    addons: extras,
  },
  {
    id: "citrus",
    name: "Citrus Fizz",
    category: "Drinks",
    description: "An ice-cold sparkling lemon and orange refresher.",
    price: 450,
    image: "/images/drink.webp",
    ingredients: ["Sparkling water", "Lemon", "Orange"],
    addons: [],
  },
  {
    id: "cherry-fizz",
    name: "Black Cherry Fizz",
    category: "Drinks",
    description: "Sparkling black cherry soda poured over plenty of ice.",
    price: 450,
    image: "/images/drink.webp",
    ingredients: ["Sparkling water", "Black cherry syrup", "Ice"],
    addons: [],
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Cloud Shake",
    category: "Drinks",
    description: "A thick vanilla shake with a soft whipped topping.",
    price: 700,
    image: "/images/drink.webp",
    ingredients: ["Vanilla ice cream", "Milk", "Whipped topping"],
    addons: [],
  },
  {
    id: "brownie",
    name: "The Last Bite",
    category: "Desserts",
    description:
      "A rich chocolate brownie with chocolate sauce. Save a little room.",
    price: 650,
    image: "/images/dessert.webp",
    ingredients: ["Chocolate", "Flour", "Butter", "Egg", "Sugar"],
    addons: [],
  },
  {
    id: "salted-caramel-brownie",
    name: "Salted Caramel Finish",
    category: "Desserts",
    description:
      "A chocolate brownie with warm caramel sauce and a pinch of sea salt.",
    price: 750,
    image: "/images/dessert.webp",
    ingredients: [
      "Chocolate",
      "Flour",
      "Butter",
      "Egg",
      "Sugar",
      "Caramel",
      "Sea salt",
    ],
    addons: [],
  },
  {
    id: "brownie-shake",
    name: "Brownie Break Shake",
    category: "Desserts",
    description:
      "A chocolate shake blended with brownie pieces and finished with chocolate sauce.",
    price: 850,
    image: "/images/dessert.webp",
    ingredients: ["Chocolate ice cream", "Milk", "Brownie", "Chocolate sauce"],
    addons: [],
  },
];
export const categories: Category[] = [
  "Signature Burgers",
  "Chicken",
  "Sides",
  "Combos",
  "Drinks",
  "Desserts",
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    cents / 100,
  );
export const disclaimer =
  "Independent fictional restaurant concept by Mackay Design. Demonstration only — no real orders or payments.";
