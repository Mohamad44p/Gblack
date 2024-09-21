import { NextResponse } from "next/server";

export async function GET() {
  const wordpressSiteUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;

  if (!wordpressSiteUrl) {
    return NextResponse.json(
      { error: "WordPress site URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${wordpressSiteUrl}/wp-json/carousel/v1/items`,
      {
        next: { revalidate: 604800 },
      }
    );
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch carousel items" },
      { status: 500 }
    );
  }
}
