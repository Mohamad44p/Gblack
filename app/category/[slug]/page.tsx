import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/Category/CategoryPage";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Product } from "@/types/product";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

async function getProducts(slug: string): Promise<Product[]> {
  try {
    const { data: categories } = await api.get("products/categories", { slug });

    if (categories.length === 0) {
      notFound();
    }

    const categoryId = categories[0].id;
    const { data: products } = await api.get("products", {
      category: categoryId,
      per_page: 20,
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export default async function BrowseCategory({
  params,
}: {
  params: { slug: string };
}) {
  const products = await getProducts(params.slug);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPage initialProducts={products} categorySlug={params.slug} />
    </Suspense>
  );
}
