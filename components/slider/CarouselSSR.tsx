import { cache } from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const ImprovedCarousel = dynamic(() => import("./Carousel"), {
  ssr: false,
  loading: () => <Loading />,
});

export const revalidate = 604800;

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
  const carouselItems = await getCarouselItems();

  return <ImprovedCarousel initialItems={carouselItems} />;
}
