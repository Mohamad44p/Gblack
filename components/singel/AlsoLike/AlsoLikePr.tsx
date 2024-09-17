"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  weight?: string;
  images: { src: string }[];
  sale_price?: string;
  regular_price?: string;
  average_rating: string;
  rating_count: number;
  attributes?: Array<{ name: string; options: string[] }>;
}

interface AlsoLikePrProps {
  products: Product[];
}

const ProductCard = ({
  product,
  index,
  total,
}: {
  product: Product;
  index: number;
  total: number;
}) => {
  const price = parseFloat(product.price);
  const isValidPrice = !isNaN(price);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 0.8,
        zIndex: total - index,
      }}
      animate={{
        opacity: 1,
        x: `${index * 30}px`,
        y: `${index * -15}px`,
        rotateY: 0,
        scale: 1,
        zIndex: total - index,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: index * 0.2,
        },
      }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        zIndex: total + 1,
        boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
        transition: { duration: 0.3 },
      }}
      className="absolute top-0 left-0 w-full sm:w-80 p-4"
      style={{
        transformOrigin: "center center",
      }}
    >
      <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
        <div className="relative h-48 overflow-hidden group">
          <Image
            src={product.images[0]?.src || "/placeholder.svg"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
              asChild
            >
              <Link href={`/product/${product.id}`}>Quick View</Link>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 truncate text-white">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mb-3">{product.brand}</p>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(parseFloat(product.average_rating))
                    ? "text-yellow-400 fill-current"
                    : "text-gray-600"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">
              ({product.rating_count})
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            {isValidPrice ? (
              <p className="text-xl font-bold text-white">
                ${price.toFixed(2)}
              </p>
            ) : (
              <p className="text-xl font-bold text-red-500">
                Price unavailable
              </p>
            )}
            {product.weight && (
              <p className="text-sm text-gray-400">{product.weight}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Button
              className="flex-1 mr-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href={`/product/${product.id}`}>See More</Link>
            </Button>
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                price: isValidPrice ? price.toFixed(2) : "0.00",
                image: product.images[0]?.src || "/BlurImage.jpg",
                average_rating: product.average_rating,
                rating_count: product.rating_count,
                attributes: product.attributes || [],
                short_description: product.description,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AlsoLikePr({ products }: AlsoLikePrProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-black text-white py-16 overflow-hidden relative min-h-screen">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-5xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover More...
        </motion.h2>
        <div className="relative h-[600px]">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ x: 0, y: 0, rotate: 0, scale: 0.8 }}
                animate={
                  isExpanded
                    ? {
                        x: `${index * 30}px`,
                        y: `${index * -15}px`,
                        rotate: index % 2 === 0 ? -2 : 2,
                        scale: hoveredIndex === index ? 1.05 : 1,
                        zIndex:
                          hoveredIndex === index
                            ? 999
                            : products.length - index,
                        transition: {
                          type: "spring",
                          damping: 20,
                          stiffness: 100,
                          delay: index * 0.1,
                        },
                      }
                    : {}
                }
                whileHover={{
                  scale: 1.05,
                  zIndex: 999,
                  boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <ProductCard
                  product={product}
                  index={index}
                  total={products.length}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
