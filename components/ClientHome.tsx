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
        featuredImage="/images/Rotated/img-1.jpg"
        featuredTitle="Fresh Finds, Just for You!"
        featuredDescription="Discover our freshest styles"
      />
      <ProductShowcase
        title="Best Sellers"
        products={bestSellers}
        featuredImage="/images/Rotated/img-3.jpg"
        featuredTitle="Bestsellers Everyone’s Talking About!"
        featuredDescription="Our most popular items"
      />
      <DynamicImprovedAllHome />
    </>
  );
}