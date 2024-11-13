"use client";

import { useState, useEffect } from "react";
import { ProductShowcase } from "@/components/ProdcutsGrid/BentoGrid";
import { Product } from "@/types/product";
import dynamic from "next/dynamic";
import React from "react";

const DynamicImprovedAllHome = dynamic(
  () => import("@/components/AllProductsHome/AllHome"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

interface ClientHomeProps {
  initialProducts: Product[];
}

export default function ClientHome({ initialProducts }: ClientHomeProps) {
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    const sortedByDate = [...initialProducts].sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );

    const sortedByTotalSales = [...initialProducts].sort(
      (a, b) => b.total_sales - a.total_sales
    );

    setNewestProducts(sortedByDate.slice(0, 7));
    setBestSellers(sortedByTotalSales.slice(0, 7));
  }, [initialProducts]);

  return (
    <>
      <ProductShowcase
        title="Newest Products"
        products={newestProducts}
        featuredImage="/banners/Banner-10.jpg"
      />
      <ProductShowcase
        title="Best Sellers"
        products={bestSellers}
        featuredImage="/banners/Banner-4.jpg"
      />
      <DynamicImprovedAllHome />
    </>
  );
}