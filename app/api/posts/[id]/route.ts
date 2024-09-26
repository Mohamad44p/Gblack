import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/posts/${id}?_embed`
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
    }

    const post = await res.json();

    const featuredImageUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      extractFirstImageFromContent(post.content.rendered);

    post.featuredImage = featuredImageUrl;
    const dom = new JSDOM(post.content.rendered);
    const images = dom.window.document.querySelectorAll("img");
    images.forEach(
      (img: {
        setAttribute: (arg0: string, arg1: string) => void;
        classList: { add: (arg0: string, arg1: string) => void };
      }) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
        img.classList.add("w-full", "h-auto");
      }
    );
    post.content.rendered = dom.window.document.body.innerHTML;

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function extractFirstImageFromContent(content: string): string | null {
  const match = content.match(/<img.+?src=["'](.+?)["']/);
  return match ? match[1] : null;
}
