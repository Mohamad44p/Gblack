import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/miucm/v1/images`, {
      next: { revalidate: 604800 },
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch images: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}