import { NextResponse } from "next/server";
import { cache } from "react";

const getPosts = cache(async (page = 1, perPage = 10) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/posts?_embed=wp:featuredmedia,author&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WP_CONSUMER_KEY}:${process.env.WP_CONSUMER_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return an empty array if fetch fails
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '10');

  try {
    const posts = await getPosts(page, perPage);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}