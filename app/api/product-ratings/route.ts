import { NextResponse } from 'next/server'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3"
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = searchParams.get('ids')

  if (!ids) {
    return NextResponse.json({ error: 'Product IDs are required' }, { status: 400 })
  }

  const productIds = ids.split(',').map(Number)

  try {
    const ratingsPromises = productIds.map(id => 
      api.get(`products/reviews`, { product: id })
        .then(({ data }) => {
          const totalRating = data.reduce((sum: number, review: any) => sum + review.rating, 0)
          const averageRating = data.length > 0 ? (totalRating / data.length).toFixed(2) : "0.00"
          return { 
            id, 
            average_rating: averageRating, 
            rating_count: data.length 
          }
        })
    )

    const ratings = await Promise.all(ratingsPromises)

    const ratingsObject = ratings.reduce((acc, rating) => {
      acc[rating.id] = { 
        average_rating: rating.average_rating, 
        rating_count: rating.rating_count 
      }
      return acc
    }, {} as { [key: number]: { average_rating: string, rating_count: number } })

    return NextResponse.json(ratingsObject)
  } catch (error) {
    console.error('Error fetching product ratings:', error)
    return NextResponse.json({ error: 'Error fetching product ratings' }, { status: 500 })
  }
}