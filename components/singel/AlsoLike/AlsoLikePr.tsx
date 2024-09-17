"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

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

export default function AlsoLikePr({ products }: AlsoLikePrProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGradientAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">YOU MAY ALSO LIKE...</h2>
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              className="flex"
              initial={{ opacity: 0, x: 1000 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -1000 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {products.slice(currentIndex, currentIndex + 4).map((product) => {
                const price = parseFloat(product.price);
                const isValidPrice = !isNaN(price);
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 px-2"
                  >
                    <div
                      className="relative p-[2px] rounded-lg overflow-hidden group"
                      style={{
                        background: `linear-gradient(${gradientAngle}deg, #483C32, #FFDF01, #FFECD1, #ECC402)`,
                        backgroundSize: "400% 400%",
                        animation: "gradientShift 15s ease infinite",
                      }}
                    >
                      <div className="relative bg-zinc-900 p-4 rounded-lg overflow-hidden h-[450px]">
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage:
                              "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "10px 10px",
                          }}
                        ></div>
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="relative w-full h-[200px] mb-4 overflow-hidden rounded-lg">
                            <Image
                              src={product.images[0]?.src || "/placeholder.svg"}
                              alt={product.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <h3 className="text-xl font-bold mb-1 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {product.brand}
                          </p>
                          <div
                            className="text-sm mb-4 flex-grow overflow-hidden line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          />
                          <div className="flex justify-between items-end mb-4">
                            {isValidPrice ? (
                              <p className="text-2xl font-bold">
                                ${price.toFixed(2)}
                              </p>
                            ) : (
                              <p className="text-2xl font-bold text-red-500">
                                Price unavailable
                              </p>
                            )}
                            {product.weight && (
                              <p className="text-sm text-gray-400">
                                {product.weight}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <Button
                              className="flex-1 mr-2 bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                              asChild
                            >
                              <Link href={`/product/${product.id}`}>
                                See More
                              </Link>
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
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="mx-2 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="mx-2 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}