import AllHome from "@/components/AllProductsHome/AllHome";
import { ProductShowcase } from "@/components/ProdcutsGrid/BentoGrid";
import SecSection from "@/components/Sec/SecSection";
import Carousel from "@/components/slider/Carousel";
import ImagesShow from "@/components/ThirdSec/ImagesShow";

async function getProducts(perPage: number) {
  const res = await fetch(`http://localhost:3000/api/products?per_page=${perPage}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

function transformProduct(product: any) {
  return {
    name: product.name,
    brand: product.categories[0]?.name || "Unknown Brand",
    price: `$${product.regular_price}`,
    salePrice: `$${product.price}`,
    rating: Math.floor(parseFloat(product.average_rating)),
    image1: product.images[0]?.src || "/BlurImage.jpg",
    image2: product.images[1]?.src || "/BlurImage.jpg",
  };
}

export default async function Home() {
  const productsData = await getProducts(14);

  const sortedByDate = [...productsData.products].sort((a, b) =>
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  );

  const sortedBySales = [...productsData.products].sort((a, b) =>
    b.total_sales - a.total_sales
  );

  const newestProducts = sortedByDate.slice(0, 7).map(transformProduct);
  const bestSellers = sortedBySales.slice(0, 7).map(transformProduct);

  return (
    <main className="min-h-screen">
      <Carousel />
      <SecSection />
      <ImagesShow />
      <ProductShowcase
        title="Newest Products"
        products={newestProducts}
        featuredImage="/images/Rotated/img-1.jpg"
        featuredTitle="Latest Arrivals"
        featuredDescription="Discover our freshest styles"
      />
      <ProductShowcase
        title="Best Sellers"
        products={bestSellers}
        featuredImage="/images/Rotated/img-3.jpg"
        featuredTitle="Top Picks"
        featuredDescription="Our most popular items"
      />
      <AllHome />
    </main>
  );
}