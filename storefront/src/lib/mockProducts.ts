/**
 * Mock product catalog for UI/UX testing when the Medusa backend has no
 * products (or the publishable key isn't set yet). These match the shape the
 * storefront components expect. Real API products always take precedence —
 * see the fallback logic in the page components.
 *
 * Images are from Unsplash (allowed by next.config.ts). Prices are in cents,
 * as Medusa stores them.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`

function priced(amount: number) {
  return [{ amount, currency_code: "usd" }]
}

export const mockProducts: any[] = [
  {
    id: "mock_1",
    handle: "sony-wh-1000xm4-headphones",
    title: "Sony WH-1000XM4 Wireless Headphones",
    description:
      "Industry-leading noise cancellation with Dual Noise Sensor technology. Up to 30-hour battery life with quick charging. Touch sensor controls and speak-to-chat.",
    thumbnail: img("1505740420928-5e560c06d30e"),
    collection: { title: "Audio" },
    images: [
      { id: "m1i1", url: img("1505740420928-5e560c06d30e") },
      { id: "m1i2", url: img("1484704849700-f032a568e944") },
      { id: "m1i3", url: img("1583394838336-acd977736f90") },
    ],
    variants: [
      { id: "mock_1_v1", title: "Black", prices: priced(34800) },
      { id: "mock_1_v2", title: "Silver", prices: priced(34800) },
    ],
  },
  {
    id: "mock_2",
    handle: "apple-watch-series-9",
    title: "Apple Watch Series 9 (GPS, 45mm)",
    description:
      "The most advanced Apple Watch yet. Features the S9 chip, a brighter display, and the new double tap gesture. Comprehensive health and fitness tracking.",
    thumbnail: img("1523275335684-37898b6baf30"),
    collection: { title: "Wearables" },
    images: [
      { id: "m2i1", url: img("1523275335684-37898b6baf30") },
      { id: "m2i2", url: img("1546868871-7041f2a55e12") },
    ],
    variants: [
      { id: "mock_2_v1", title: "Midnight", prices: priced(39900) },
      { id: "mock_2_v2", title: "Starlight", prices: priced(39900) },
      { id: "mock_2_v3", title: "Product Red", prices: priced(42900) },
    ],
  },
  {
    id: "mock_3",
    handle: "nike-air-zoom-pegasus-40",
    title: "Nike Air Zoom Pegasus 40",
    description:
      "A responsive everyday running shoe with Nike React foam and Zoom Air units. Breathable engineered mesh upper keeps you cool mile after mile.",
    thumbnail: img("1542291026-7eec264c27ff"),
    collection: { title: "Footwear" },
    images: [
      { id: "m3i1", url: img("1542291026-7eec264c27ff") },
      { id: "m3i2", url: img("1600185365483-26d7a4cc7519") },
      { id: "m3i3", url: img("1595950653106-6c9ebd614d3a") },
    ],
    variants: [
      { id: "mock_3_v1", title: "US 8", prices: priced(12995) },
      { id: "mock_3_v2", title: "US 9", prices: priced(12995) },
      { id: "mock_3_v3", title: "US 10", prices: priced(12995) },
      { id: "mock_3_v4", title: "US 11", prices: priced(12995) },
    ],
  },
  {
    id: "mock_4",
    handle: "fjallraven-kanken-backpack",
    title: "Fjällräven Kånken Classic Backpack",
    description:
      "The iconic Swedish backpack in hard-wearing Vinylon F fabric. Spacious main compartment, seat pad, and a timeless design that goes with everything.",
    thumbnail: img("1553062407-98eeb64c6a62"),
    collection: { title: "Bags" },
    images: [
      { id: "m4i1", url: img("1553062407-98eeb64c6a62") },
      { id: "m4i2", url: img("1548036328-c9fa89d128fa") },
    ],
    variants: [
      { id: "mock_4_v1", title: "Graphite", prices: priced(8000) },
      { id: "mock_4_v2", title: "Ochre", prices: priced(8000) },
    ],
  },
  {
    id: "mock_5",
    handle: "ray-ban-original-wayfarer",
    title: "Ray-Ban Original Wayfarer Sunglasses",
    description:
      "The most recognizable style in the history of sunglasses. Crystal green G-15 lenses with 100% UV protection and a durable acetate frame.",
    thumbnail: img("1511499767150-a48a237f0083"),
    collection: { title: "Accessories" },
    images: [
      { id: "m5i1", url: img("1511499767150-a48a237f0083") },
      { id: "m5i2", url: img("1572635196237-14b3f281503f") },
    ],
    variants: [{ id: "mock_5_v1", title: "Black / Green", prices: priced(16100) }],
  },
  {
    id: "mock_6",
    handle: "logitech-mx-keys-keyboard",
    title: "Logitech MX Keys Advanced Wireless Keyboard",
    description:
      "A comfortable, precise typing experience with smart illumination and spherically dished keys. Connects to up to three devices and charges via USB-C.",
    thumbnail: img("1541140532154-b024d705b90a"),
    collection: { title: "Accessories" },
    images: [
      { id: "m6i1", url: img("1541140532154-b024d705b90a") },
      { id: "m6i2", url: img("1587829741301-dc798b83add3") },
    ],
    variants: [{ id: "mock_6_v1", title: "Graphite", prices: priced(11999) }],
  },
]
