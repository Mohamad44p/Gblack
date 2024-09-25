import { NextResponse } from 'next/server'
import { cache } from 'react'

const getProducts = cache(async (perPage: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wc/v3/products?per_page=${perPage}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.WP_CONSUMER_KEY}:${process.env.WP_CONSUMER_SECRET}`).toString('base64')}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const perPage = searchParams.get('per_page') || '20'
  const products = await getProducts(parseInt(perPage))
  return NextResponse.json({ products })
}

export const revalidate = 3600