import { Suspense } from 'react';
import CarouselSkeleton from './CarouselSkeleton';
import ImprovedCarousel from './Carousel';

async function getCarouselItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carousel-items`, {
    next: { revalidate: 604800 }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch carousel items');
  }
  return res.json();
}

export default async function CarouselSSR() {
  const carouselItems = await getCarouselItems();

  return (
    <Suspense fallback={<CarouselSkeleton />}>
      <ImprovedCarousel initialItems={carouselItems} />
    </Suspense>
  );
}