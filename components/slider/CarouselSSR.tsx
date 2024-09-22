// app/page.tsx
import { Suspense } from "react";
import CarouselSkeleton from "./CarouselSkeleton";
import { cache } from "react";
import ImprovedCarousel from "./Carousel";

export const revalidate = 604800; // Revalidate every week (7 days)

const getCarouselItems = cache(async () => {
  const wordpressSiteUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;

  if (!wordpressSiteUrl) {
    throw new Error("WordPress site URL is not configured");
  }

  const response = await fetch(
    `${wordpressSiteUrl}/wp-json/carousel/v1/items`,
    { next: { revalidate: 604800 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch carousel items");
  }

  return response.json();
});

export default async function CarouselSSR() {
  try {
    const carouselItems = await getCarouselItems();

    return (
      <Suspense fallback={<CarouselSkeleton />}>
        <ImprovedCarousel initialItems={carouselItems} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return <div>Error loading carousel. Please try again later.</div>;
  }
}
