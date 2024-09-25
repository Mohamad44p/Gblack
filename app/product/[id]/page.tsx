import { notFound } from "next/navigation";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import SingleProductPage from "@/components/singel/ProductPage";
import ProductImageSlider from "@/components/singel/image-slider";
import { cache } from "react";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

const getProduct = cache(async (id: string) => {
  try {
    const { data } = await api.get(`products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
});

const getReviews = cache(async (productId: number) => {
  try {
    const { data } = await api.get(`products/reviews`, {
      product: productId,
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
});

const getRelatedProducts = cache(
  async (categoryId: number, currentProductId: number) => {
    try {
      const { data } = await api.get("products", {
        category: categoryId,
        exclude: [currentProductId],
        per_page: 4,
      });
      return data;
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  }
);

const getShippingZones = cache(async () => {
  try {
    const response = await api.get("shipping/zones");
    const zones = await Promise.all(
      response.data.map(async (zone: any) => {
        const methodsResponse = await api.get(
          `shipping/zones/${zone.id}/methods`
        );
        const price = methodsResponse.data[0]?.settings?.cost?.value || 0;
        return {
          id: zone.id,
          name: zone.name,
          price: parseFloat(price),
        };
      })
    );
    return zones;
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return [];
  }
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.short_description.replace(/<[^>]*>/g, ""),
    openGraph: {
      images: [{ url: product.images[0]?.src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, reviews, shippingZones] = await Promise.all([
    getProduct(params.id),
    getReviews(parseInt(params.id)),
    getShippingZones(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categories[0]?.id,
    product.id
  );

  const totalRating = reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0
  );
  const averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : "0.00";
  const ratingCount = reviews.length;

  const updatedProduct = {
    ...product,
    average_rating: averageRating,
    rating_count: ratingCount,
  };

  const formattedProducts = relatedProducts.map((product: any) => ({
    id: product.id,
    name: product.name,
    brand: product.categories[0]?.name || "",
    description: product.short_description,
    price: product.price,
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    images: product.images,
    average_rating: product.average_rating,
    rating_count: product.rating_count,
    attributes: product.attributes,
  }));

  return (
    <section className="min-h-screen w-full">
      <SingleProductPage
        product={updatedProduct}
        shippingZones={shippingZones}
      />
      <section className="min-h-screen w-full">
        <h1 className="text-5xl text-center my-10">You might also like</h1>
        <ProductImageSlider products={formattedProducts} />
      </section>
    </section>
  );
}
