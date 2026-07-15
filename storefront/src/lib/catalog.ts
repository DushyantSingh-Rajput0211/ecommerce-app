import type {
  Catalog,
  CatalogParent,
  CatalogProduct,
} from "@/types/catalog"

// Bumped to v3 so cached catalogs re-seed with variant inventory quantities.
export const CATALOG_STORAGE_KEY = "catalog_v3"

/** Product-card image dimensions (3:4 portrait). */
export const PRODUCT_IMAGE_WIDTH = 1920
export const PRODUCT_IMAGE_HEIGHT = 2560

// Seed images request the exact 1920x2560 (3:4) crop from Unsplash.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${PRODUCT_IMAGE_WIDTH}&h=${PRODUCT_IMAGE_HEIGHT}&q=80`

const price = (amount: number) => [{ amount, currency_code: "usd" }]

const variant = (
  id: string,
  title: string,
  amount: number,
  inventory_quantity: number
) => ({ id, title, prices: price(amount), inventory_quantity })

/** URL-safe slug from a title (used for parent/product handles). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Ensure a handle is unique within a list of existing handles. */
export function uniqueHandle(base: string, existing: string[]): string {
  let handle = base || "item"
  let n = 2
  while (existing.includes(handle)) {
    handle = `${base}-${n++}`
  }
  return handle
}

/** Read an uploaded File as a base64 data URL (for localStorage-backed images). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Downscale/compress an image File to a JPEG data URL, capped to `maxSize` on
 * the longest edge. Keeps localStorage usage sane for uploaded product photos.
 */
export async function fileToCompressedDataUrl(
  file: File,
  maxSize = 1000,
  quality = 0.82
): Promise<string> {
  const dataUrl = await fileToDataUrl(file)
  if (typeof document === "undefined") return dataUrl

  return new Promise((resolve) => {
    const image = new window.Image()
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      const w = Math.round(image.width * scale)
      const h = Math.round(image.height * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(dataUrl)
      ctx.drawImage(image, 0, 0, w, h)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    image.onerror = () => resolve(dataUrl)
    image.src = dataUrl
  })
}

/**
 * Cover-crop an uploaded image to exact `targetW`x`targetH` (JPEG data URL),
 * so every product-card image is a uniform 1920x2560 (3:4). Scales to fill
 * then centers the crop — same visual result as CSS object-cover, baked in.
 */
export async function fileToCoverCropDataUrl(
  file: File,
  targetW = PRODUCT_IMAGE_WIDTH,
  targetH = PRODUCT_IMAGE_HEIGHT,
  quality = 0.85
): Promise<string> {
  const dataUrl = await fileToDataUrl(file)
  if (typeof document === "undefined") return dataUrl

  return new Promise((resolve) => {
    const image = new window.Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(dataUrl)

      // Scale to cover, then center.
      const scale = Math.max(targetW / image.width, targetH / image.height)
      const drawW = image.width * scale
      const drawH = image.height * scale
      const dx = (targetW - drawW) / 2
      const dy = (targetH - drawH) / 2
      ctx.drawImage(image, dx, dy, drawW, drawH)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    image.onerror = () => resolve(dataUrl)
    image.src = dataUrl
  })
}

let idCounter = 0
/** Deterministic-enough unique id without Date.now()/Math.random(). */
export function makeId(prefix: string): string {
  idCounter += 1
  return `${prefix}_${idCounter}_${idCounter * 2654435761 % 100000}`
}

/** The default seed catalog: 4 parent categories populated with sample subs. */
export function defaultCatalog(): Catalog {
  const now = 0
  const parents: CatalogParent[] = [
    {
      id: "parent_audio",
      handle: "audio",
      title: "Audio",
      description: "Headphones, speakers, and everything that sounds good.",
      image: img("1505740420928-5e560c06d30e"),
      createdAt: now,
    },
    {
      id: "parent_wearables",
      handle: "wearables",
      title: "Wearables",
      description: "Smartwatches and tech you wear every day.",
      image: img("1523275335684-37898b6baf30"),
      createdAt: now,
    },
    {
      id: "parent_footwear",
      handle: "footwear",
      title: "Footwear",
      description: "Performance and everyday sneakers.",
      image: img("1542291026-7eec264c27ff"),
      createdAt: now,
    },
    {
      id: "parent_accessories",
      handle: "accessories",
      title: "Accessories",
      description: "Bags, eyewear, keyboards, and finishing touches.",
      image: img("1553062407-98eeb64c6a62"),
      createdAt: now,
    },
  ]

  const products: CatalogProduct[] = [
    {
      id: "prod_sony",
      handle: "sony-wh-1000xm4-headphones",
      title: "Sony WH-1000XM4 Wireless Headphones",
      description:
        "Industry-leading noise cancellation with up to 30-hour battery life, touch controls, and speak-to-chat.",
      parentId: "parent_audio",
      thumbnail: img("1505740420928-5e560c06d30e"),
      collection: { title: "Audio" },
      images: [
        { id: "s1", url: img("1505740420928-5e560c06d30e") },
        { id: "s2", url: img("1484704849700-f032a568e944") },
      ],
      variants: [
        variant("sony_black", "Black", 34800, 14),
        variant("sony_silver", "Silver", 34800, 0),
      ],
      createdAt: now,
    },
    {
      id: "prod_watch",
      handle: "apple-watch-series-9",
      title: "Apple Watch Series 9 (GPS, 45mm)",
      description:
        "The S9 chip, a brighter display, and the new double tap gesture. Comprehensive health and fitness tracking.",
      parentId: "parent_wearables",
      thumbnail: img("1523275335684-37898b6baf30"),
      collection: { title: "Wearables" },
      images: [
        { id: "w1", url: img("1523275335684-37898b6baf30") },
        { id: "w2", url: img("1546868871-7041f2a55e12") },
      ],
      variants: [
        variant("watch_mid", "Midnight", 39900, 30),
        variant("watch_star", "Starlight", 39900, 8),
      ],
      createdAt: now,
    },
    {
      id: "prod_nike",
      handle: "nike-air-zoom-pegasus-40",
      title: "Nike Air Zoom Pegasus 40",
      description:
        "A responsive everyday running shoe with Nike React foam and Zoom Air units.",
      parentId: "parent_footwear",
      thumbnail: img("1542291026-7eec264c27ff"),
      collection: { title: "Footwear" },
      images: [
        { id: "n1", url: img("1542291026-7eec264c27ff") },
        { id: "n2", url: img("1600185365483-26d7a4cc7519") },
      ],
      variants: [
        variant("nike_8", "US 8", 12995, 3),
        variant("nike_9", "US 9", 12995, 12),
        variant("nike_10", "US 10", 12995, 0),
        variant("nike_11", "US 11", 12995, 6),
      ],
      createdAt: now,
    },
    {
      id: "prod_kanken",
      handle: "fjallraven-kanken-backpack",
      title: "Fjällräven Kånken Classic Backpack",
      description:
        "The iconic Swedish backpack in hard-wearing Vinylon F fabric with a timeless design.",
      parentId: "parent_accessories",
      thumbnail: img("1553062407-98eeb64c6a62"),
      collection: { title: "Accessories" },
      images: [{ id: "k1", url: img("1553062407-98eeb64c6a62") }],
      variants: [
        variant("kanken_graphite", "Graphite", 8000, 20),
        variant("kanken_ochre", "Ochre", 8000, 5),
      ],
      createdAt: now,
    },
    {
      id: "prod_rayban",
      handle: "ray-ban-original-wayfarer",
      title: "Ray-Ban Original Wayfarer Sunglasses",
      description:
        "The most recognizable style in the history of sunglasses, with 100% UV protection.",
      parentId: "parent_accessories",
      thumbnail: img("1511499767150-a48a237f0083"),
      collection: { title: "Accessories" },
      images: [{ id: "r1", url: img("1511499767150-a48a237f0083") }],
      variants: [
        variant("rayban_black", "Black / Green", 16100, 40),
      ],
      createdAt: now,
    },
    {
      id: "prod_logi",
      handle: "logitech-mx-keys-keyboard",
      title: "Logitech MX Keys Advanced Wireless Keyboard",
      description:
        "Comfortable, precise typing with smart illumination. Connects to three devices, charges via USB-C.",
      parentId: "parent_accessories",
      thumbnail: img("1541140532154-b024d705b90a"),
      collection: { title: "Accessories" },
      images: [{ id: "l1", url: img("1541140532154-b024d705b90a") }],
      variants: [
        variant("logi_graphite", "Graphite", 11999, 2),
      ],
      createdAt: now,
    },
  ]

  return { parents, products }
}

/** Load the catalog from localStorage, falling back to the default seed. */
export function loadCatalog(): Catalog {
  if (typeof window === "undefined") return defaultCatalog()
  try {
    const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY)
    if (!raw) return defaultCatalog()
    const parsed = JSON.parse(raw) as Catalog
    if (!parsed.parents || !parsed.products) return defaultCatalog()
    return parsed
  } catch {
    return defaultCatalog()
  }
}

export function saveCatalog(catalog: Catalog): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog))
}
