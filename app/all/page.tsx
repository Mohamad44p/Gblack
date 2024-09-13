import ProductList from '@/components/AllPage/ProductList'
import { Suspense } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getProducts(perPage: number) {
  const res = await fetch(`${API_BASE_URL}/api/products?per_page=${perPage}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export default async function ProductsPage() {
  const [productsData, categoriesData] = await Promise.all([getProducts(100), getCategories()])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList initialProducts={productsData.products} initialCategories={categoriesData.categories} />
    </Suspense>
  )
}