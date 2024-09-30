import { cache } from "react";
import { Product } from "@/types/product";
import SecSection from "@/components/Sec/SecSection";
import ImagesShow from "@/components/ThirdSec/ImagesShow";
import CarouselSSR from "@/components/slider/CarouselSSR";
import ClientHome from "@/components/ClientHome";
import ServerImages from "@/components/ThirdSec/ServerImages";

const getProducts = cache(
  async (perPage: number): Promise<{ products: Product[] }> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?per_page=${perPage}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  }
);

const getProductRatings = cache(
  async (
    productIds: number[]
  ): Promise<{
    [key: number]: { average_rating: string; rating_count: number };
  }> => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/product-ratings?ids=${productIds.join(",")}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      console.error("Failed to fetch product ratings:", await res.text());
      return {};
    }
    return res.json();
  }
);

function transformProduct(
  product: Product,
  ratings: { [key: number]: { average_rating: string; rating_count: number } }
): Product {
  const productRating = ratings[product.id] || {
    average_rating: "0",
    rating_count: 0,
  };
  return {
    ...product,
    brand: product.categories[0]?.name || "Unknown Brand",
    salePrice: parseFloat(product.sale_price || product.price),
    rating: parseFloat(productRating.average_rating),
    ratingCount: productRating.rating_count,
    image1: product.images[0]?.src || "/BlurImage.jpg",
    image2: product.images[1]?.src || "/BlurImage.jpg",
  };
}

export default async function Home() {
  const productsData = await getProducts(14);
  const productIds = productsData.products.map((product) => product.id);
  const ratingsData = await getProductRatings(productIds);

  const transformedProducts = productsData.products.map((product) =>
    transformProduct(product, ratingsData)
  );

  return (
    <main className="min-h-screen">
      <h1 className="sr-only">Welcome to GBLACK - Your Fashion Destination</h1>
      <CarouselSSR />
      <SecSection />
      <section className="min-h-screen">
        <ServerImages />
      </section>
      <ClientHome initialProducts={transformedProducts} />
    </main>
  );
}