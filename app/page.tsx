import AllHome from "@/components/AllProductsHome/AllHome";
import BentoGrid from "@/components/ProdcutsGrid/BentoGrid";
import SecSection from "@/components/Sec/SecSection";
import Carousel from "@/components/slider/Carousel";
import ImagesShow from "@/components/ThirdSec/ImagesShow";
import Image from "next/image";

const newestProducts = [
  {
    name: "Hudson Baby Infant Boy Plush Sleep and Play",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Women.jpg",
    image2: "/images/Man.jpg",
  },
  {
    name: "Hudson Baby",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Man.jpg",
    image2: "/images/Women.jpg",
  },
  {
    name: "Hudson Baby Infant Boy Plush Sleep and Play",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Women.jpg",
    image2: "/images/Man.jpg",
  },
  {
    name: "Hudson Baby",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Man.jpg",
    image2: "/images/Women.jpg",
  },
  {
    name: "Hudson Baby",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Man.jpg",
    image2: "/images/Women.jpg",
  },
  {
    name: "Hudson Baby",
    brand: "BABY SKINCARE",
    price: "$16.99",
    rating: 5,
    image1: "/images/Man.jpg",
    image2: "/images/Women.jpg",
  },
]

export default function Home() {
  return (
    <main className="h-screen">
      <Carousel />
      <SecSection />
      <ImagesShow />
      <BentoGrid
        title="Newest Products"
        products={newestProducts}
        featuredImage="/images/Rotated/img-1.jpg"
        featuredTitle="Latest Arrivals"
        featuredDescription="Discover our freshest styles"
      />
      <BentoGrid
        title="Best Sellers"
        products={newestProducts}
        featuredImage="/images/Rotated/img-3.jpg"
        featuredTitle="Latest Arrivals"
        featuredDescription="Discover our freshest styles"
      />

      <AllHome />

    </main>
  );
}
