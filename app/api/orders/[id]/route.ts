import { NextRequest, NextResponse } from "next/server"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await api.get(`orders/${params.id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 })
  }
}