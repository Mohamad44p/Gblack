import { NextRequest, NextResponse } from 'next/server'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
    consumerKey: process.env.WP_CONSUMER_KEY!,
    consumerSecret: process.env.WP_CONSUMER_SECRET!,
    version: "wc/v3"
})

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    try {
        const { data } = await api.get(`products/reviews`, {
            product: productId,
            per_page: limit,
            offset: offset
        })
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { productId, rating, review, reviewer, email } = body

    if (!productId || !rating || !review || !reviewer || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
        const { data } = await api.post('products/reviews', {
            product_id: productId,
            review: review,
            reviewer: reviewer,
            reviewer_email: email,
            rating: rating
        })
        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error submitting review:', error)
        return NextResponse.json({ error: 'Error submitting review' }, { status: 500 })
    }
}