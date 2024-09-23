import { notFound } from "next/navigation";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import SingleProductPage from "@/components/singel/ProductPage";
import { unstable_noStore as noStore } from "next/cache";
import ProductImageSlider from "@/components/singel/image-slider";

interface WooCommerceProduct {
  id: number;
  name: string;
  short_description: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  categories: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ id: number; src: string; alt: string }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  variations: number[];
  average_rating: string;
  rating_count: number;
}

interface Review {
  id: number;
  review: string;
  rating: number;
  reviewer: string;
  date_created: string;
}

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

async function getProduct(id: string) {
  noStore();
  try {
    const { data } = await api.get(`products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getReviews(productId: number) {
  noStore();
  try {
    const { data } = await api.get(`products/reviews`, {
      product: productId,
    });
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

async function getRelatedProducts(
  categoryId: number,
  currentProductId: number
) {
  noStore();
  try {
    const { data } = await api.get("products", {
      category: categoryId,
      exclude: [currentProductId],
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(product.id);

  const totalRating = reviews.reduce(
    (sum: number, review: Review) => sum + review.rating,
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

  const relatedProducts = await getRelatedProducts(
    product.categories[0]?.id,
    product.id
  );

  const formattedProducts = relatedProducts.map(
    (product: WooCommerceProduct) => ({
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
    })
  );

  return (
    <section className="min-h-screen w-full">
      <section>
        <SingleProductPage product={updatedProduct} />
      </section>
      <section className="min-h-screen w-full">
        <h1 className="text-5xl text-center my-10">You might also like</h1>
        <ProductImageSlider products={formattedProducts} />
      </section>
    </section>
  );
}
