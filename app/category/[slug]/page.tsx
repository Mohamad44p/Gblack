import { cache } from 'react'
import { Suspense } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Head from 'next/head'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Product } from "@/types/product";
import { unstable_noStore as noStore } from 'next/cache'

const CategoryPage = dynamic(() => import("@/components/Category/CategoryPage"), {
  loading: () => <div>Loading...</div>,
});

const ErrorFallback = dynamic(() => import('@/components/ErrorFallback'));

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

const getProductsCached = cache(async (
  slug: string,
  page: number,
  perPage: number
): Promise<{ products: Product[]; total: number }> => {
  noStore()
  try {
    const { data: categories } = await api.get("products/categories", { slug });

    if (categories.length === 0) {
      notFound();
    }

    const categoryId = categories[0].id;
    const { data: products, headers } = await api.get("products", {
      category: categoryId,
      per_page: perPage,
      page: page,
    });

    const total = parseInt(headers["x-wp-total"], 10);

    return { products, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
});


export default async function BrowseCategory({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  noStore()
  const page = parseInt(searchParams.page ?? "1", 10);
  const perPage = 9;

  try {
    const { products, total } = await getProductsCached(params.slug, page, perPage);

    return (
      <>
        <Head>
          <title>{`${params.slug} Products | Your Store Name`}</title>
          <meta name="description" content={`Browse our collection of ${params.slug} products.`} />
        </Head>
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryPage
            initialProducts={products}
            categorySlug={params.slug}
            currentPage={page}
            totalProducts={total}
            productsPerPage={perPage}
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return <ErrorFallback resetErrorBoundary={
      () => {
        
      }
    } error={new Error("Failed to load products. Please try again later.")} />;
  }
}