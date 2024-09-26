import { NextResponse } from "next/server";
import { cache } from "react";

const getPosts = cache(async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/posts?_embed=wp:featuredmedia,author`,
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
});

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}