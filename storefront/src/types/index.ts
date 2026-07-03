export interface MedusaPrice {
  amount: number
  currency_code: string
}

export interface MedusaVariant {
  id: string
  title: string
  prices: MedusaPrice[]
  inventory_quantity?: number
}

export interface MedusaImage {
  id: string
  url: string
}

export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: MedusaVariant[]
  images: MedusaImage[]
  collection?: { title: string }
}

export interface MedusaLineItem {
  id: string
  title: string
  thumbnail: string | null
  quantity: number
  unit_price: number
  variant?: MedusaVariant
}

export interface MedusaCart {
  id: string
  items: MedusaLineItem[]
  total?: number
}
