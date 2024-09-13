import { Suspense } from 'react'
import AllHome from "@/components/AllProductsHome/AllHome"
import { ProductShowcase } from "@/components/ProdcutsGrid/BentoGrid"
import SecSection from "@/components/Sec/SecSection"
import Carousel from "@/components/slider/Carousel"
import ImagesShow from "@/components/ThirdSec/ImagesShow"
import Loading from '@/components/Loading'
import { Product } from '@/types/product'

async function getProducts(perPage: number): Promise<{ products: Product[] }> {
  const res = await fetch(`http://localhost:3000/api/products?per_page=${perPage}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

function transformProduct(product: Product) {
  return {
    id: product.id,
    name: product.name,
    brand: product.categories[0]?.name || "Unknown Brand",
    price: parseFloat(product.regular_price),
    salePrice: parseFloat(product.price),
    rating: Math.floor(parseFloat(product.average_rating)),
    image1: product.images[0]?.src || "/BlurImage.jpg",
    image2: product.images[1]?.src || "/BlurImage.jpg",
    totalSales: product.total_sales
  }
}

async function ProductShowcases() {
  const productsData = await getProducts(14)

  const sortedByDate = [...productsData.products].sort((a, b) =>
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  )

  const sortedByTotalSales = [...productsData.products].sort((a, b) => 
    b.total_sales - a.total_sales
  )

  const newestProducts = sortedByDate.slice(0, 7).map(transformProduct)
  const bestSellers = sortedByTotalSales.slice(0, 7).map(transformProduct)

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