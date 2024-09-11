import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const per_page = searchParams.get("per_page") || "10";

  const response = {
    success: false,
    products: [],
    error: null as string | null,
  };

  try {
    const { data } = await api.get("products", {
      search: search,
      per_page: parseInt(per_page, 10),
      status: "publish",
    });

    response.success = true;
    response.products = data;

    return NextResponse.json(response);
  } catch (error: any) {
    response.error =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(response, { status: 500 });
  }
}
