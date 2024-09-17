import { Suspense } from 'react'
import AllHome from "@/components/AllProductsHome/AllHome"
import { ProductShowcase } from "@/components/ProdcutsGrid/BentoGrid"
import SecSection from "@/components/Sec/SecSection"
import Carousel from "@/components/slider/Carousel"
import ImagesShow from "@/components/ThirdSec/ImagesShow"
import Loading from '@/components/Loading'
import { Product } from '@/types/product'

async function getProducts(perPage: number): Promise<{ products: Product[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?per_page=${perPage}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

async function getProductRatings(productIds: number[]): Promise<{ [key: number]: { average_rating: string, rating_count: number } }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-ratings?ids=${productIds.join(',')}`, { cache: 'no-store' })
    if (!res.ok) {
      console.error('Failed to fetch product ratings:', await res.text())
      return {}
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching product ratings:', error)
    return {}
  }
}

function transformProduct(product: Product, ratings: { [key: number]: { average_rating: string, rating_count: number } }): Product {
  const productRating = ratings[product.id] || { average_rating: "0", rating_count: 0 }
  return {
    ...product,
    brand: product.categories[0]?.name || "Unknown Brand",
    salePrice: parseFloat(product.sale_price || product.price),
    rating: parseFloat(productRating.average_rating),
    ratingCount: productRating.rating_count,
    image1: product.images[0]?.src || "/BlurImage.jpg",
    image2: product.images[1]?.src || "/BlurImage.jpg",
  }
}

async function ProductShowcases() {
  const productsData = await getProducts(14)
  const productIds = productsData.products.map(product => product.id)
  const ratingsData = await getProductRatings(productIds)

  const sortedByDate = [...productsData.products].sort((a, b) =>
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  )

  const sortedByTotalSales = [...productsData.products].sort((a, b) =>
    b.total_sales - a.total_sales
  )

  const newestProducts = sortedByDate.slice(0, 7).map(product => transformProduct(product, ratingsData))
  const bestSellers = sortedByTotalSales.slice(0, 7).map(product => transformProduct(product, ratingsData))

  return (
    <>
      <ProductShowcase
        title="Newest Products"
        products={newestProducts}
        featuredImage="/images/Rotated/img-1.jpg"
        featuredTitle="Latest Arrivals"
        featuredDescription="Discover our freshest styles"
      />
      <ProductShowcase
        title="Best Sellers"
        products={bestSellers}
        featuredImage="/images/Rotated/img-3.jpg"
        featuredTitle="Top Picks"
        featuredDescription="Our most popular items"
      />
    </>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Carousel />
      <SecSection />
      <ImagesShow />
      <Suspense fallback={<Loading />}>
        <ProductShowcases />
      </Suspense>
      <AllHome />
    </main>
  )
}