export interface Product {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  type: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<any>
  images: Array<{
    id: number
    src: string
    name: string
    alt: string
  }>
  attributes: Array<{
    id: number
    name: string
    position: number
    visible: boolean
    variation: boolean
    options: string[]
  }>
  average_rating: string
  ratingCount: number
  stock_status: string
  brand?: string
  salePrice?: number
  rating?: number
  image1?: string
  image2?: string
}