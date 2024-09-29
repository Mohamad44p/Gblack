import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import dynamic from "next/dynamic";
import { SkeletonProduct } from "@/components/AllPage/ProductList";

const ProductList = dynamic(() => import("@/components/AllPage/ProductList"), {
  loading: () => <SkeletonProduct />,
  ssr: false,
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProducts(perPage: number) {
  noStore();
  const res = await fetch(`${API_BASE_URL}/api/products?per_page=${perPage}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

async function getCategories() {
  noStore();
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default async function ProductsPage() {
  const [productsData, categoriesData] = await Promise.all([
    getProducts(100),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<SkeletonProduct />}>
      <ProductList
        initialProducts={productsData.products}
        initialCategories={categoriesData.categories}
      />
    </Suspense>
  );
}
