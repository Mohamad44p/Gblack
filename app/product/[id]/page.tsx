import { notFound } from "next/navigation";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import SingleProductPage from "@/components/singel/ProductPage";
import AlsoLikePr from "@/components/singel/AlsoLike/AlsoLikePr";

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
}

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

async function getProduct(id: string) {
  try {
    const { data } = await api.get(`products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId: number, currentProductId: number) {
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
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categories[0]?.id, product.id);

const formattedProducts = relatedProducts.map((product: WooCommerceProduct) => ({
    id: product.id,
    name: product.name,
    brand: product.categories[0]?.name || '',
    description: product.short_description,
    price: product.price,
    images: product.images
}));

  return (
    <section className="min-h-screen w-full">
      <section>
        <SingleProductPage product={product} />
      </section>
      <section>
        <AlsoLikePr products={formattedProducts} />
      </section>
    </section>
  );
}