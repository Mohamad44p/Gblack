import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { NextResponse } from 'next/server';
import { cache } from 'react'

const getCategories = cache(async () => {
  const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
    consumerKey: process.env.WP_CONSUMER_KEY!,
    consumerSecret: process.env.WP_CONSUMER_SECRET!,
    version: "wc/v3",
  });

  const { data } = await api.get("products/categories");
  return data;
});

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export const revalidate = 3600;