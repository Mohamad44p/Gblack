import { Suspense } from 'react'
import OnSaleProducts from '@/components/sale/OnSaleProducts'
import { Pagination } from './pagination'
import React from 'react'
import Loading from '../loading'

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${baseUrl}/api/products?per_page=100`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`API response not OK: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.products
}

export default async function OnSalePage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="w-full bg-black bg-grid-gray-800 relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl font-extrabold mb-12 text-center" style={{
            background: "linear-gradient(to right, #fff, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            On-Sale Products
          </h1>
          <Suspense fallback={<Loading/>}>
            <ProductList currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function ProductList({ currentPage }: { currentPage: number }) {
  const products = await getProducts()
  const onSaleProducts = products.filter((product: { on_sale: any; sale_price: string; regular_price: string }) =>
    product.on_sale && product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price)
  )

  const productsPerPage = 10
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = onSaleProducts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(onSaleProducts.length / productsPerPage)

  return (
    <>
      <OnSaleProducts products={paginatedProducts} />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  )
}