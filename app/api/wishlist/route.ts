import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Adjust this endpoint based on your WooCommerce Wishlist plugin
    const response = await api.get(`wishlist/get_by_user/${userId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
  }

  try {
    // Adjust this endpoint based on your WooCommerce Wishlist plugin
    const response = await api.post('wishlist/add_to_wishlist', { user_id: userId, product_id: productId });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
  }

  try {
    // Adjust this endpoint based on your WooCommerce Wishlist plugin
    const response = await api.delete(`wishlist/remove_from_wishlist`, { data: { user_id: userId, product_id: productId } });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}