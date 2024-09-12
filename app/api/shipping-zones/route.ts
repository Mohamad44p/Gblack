import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET() {
  try {
    const response = await api.get("shipping/zones");
    const zones = await Promise.all(response.data.map(async (zone: any) => {
      const methodsResponse = await api.get(`shipping/zones/${zone.id}/methods`);
      const price = methodsResponse.data[0]?.settings?.cost?.value || 0;
      return {
        id: zone.id,
        name: zone.name,
        price: parseFloat(price),
      };
    }));
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json({ error: 'Failed to fetch shipping zones' }, { status: 500 });
  }
}