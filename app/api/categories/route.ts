import { NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET() {
  const response = {
    success: false,
    categories: [],
    error: null as string | null,
  };

  try {
    const { data } = await api.get("products/categories");

    response.success = true;
    response.categories = data;

    return NextResponse.json(response);
  } catch (error: any) {
    response.error = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(response, { status: 500 });
  }
}