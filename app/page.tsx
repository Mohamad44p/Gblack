'use client'

import { Suspense, lazy, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { unstable_noStore as noStore } from 'next/cache'
import { Product } from '@/types/product'
import Loading from '@/components/Loading'
import { Skeleton } from "@/components/ui/skeleton"
import { ProductShowcase } from '@/components/ProdcutsGrid/BentoGrid'

const SecSection = lazy(() => import("@/components/Sec/SecSection"))
const ImagesShow = lazy(() => import("@/components/ThirdSec/ImagesShow"))
const ImprovedAllHome = lazy(() => import('@/components/AllProductsHome/AllHome'))
const CarouselSSR = lazy(() => import('@/components/slider/CarouselSSR'))

async function getProducts(perPage: number): Promise<{ products: Product[] }> {
  noStore()
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?per_page=${perPage}`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [] }
  }
}

async function getProductRatings(productIds: number[]): Promise<{ [key: number]: { average_rating: string, rating_count: number } }> {
  noStore()
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-ratings?ids=${productIds.join(',')}`, {
      next: { revalidate: 3600 }
    })
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

function ProductShowcases() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
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

        setProducts([...newestProducts, ...bestSellers])
      } catch (error) {
        console.error('Error fetching product data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <ProductShowcaseSkeleton />
  }

  return (
    <>
      <ProductShowcase
        title="Newest Products"
        products={products.slice(0, 7)}
        featuredImage="/images/Rotated/img-1.jpg"
        featuredTitle="Latest Arrivals"
        featuredDescription="Discover our freshest styles"
      />
      <ProductShowcase
        title="Best Sellers"
        products={products.slice(7)}
        featuredImage="/images/Rotated/img-3.jpg"
        featuredTitle="Top Picks"
        featuredDescription="Our most popular items"
      />
    </>
  )
}

function ProductShowcaseSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="bg-gray-800 p-6 rounded-lg">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="sr-only">Welcome to GBLACK - Your Fashion Destination</h1>
      <Suspense fallback={<Loading />}>
        <CarouselSSR />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <SecSection />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ImagesShow />
      </Suspense>
      <Suspense fallback={<ProductShowcaseSkeleton />}>
        <ProductShowcases />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ImprovedAllHome />
      </Suspense>
    </motion.main>
  )
}