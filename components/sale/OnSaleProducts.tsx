"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { WishlistButton } from "@/components/WishlistButton";
import { openCart } from "@/lib/hooks/events";
import { OptimizedImage } from "@/components/OptimizedImage";

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: { id: number; name: string; slug: string }[];
  average_rating: string;
  images: { src: string }[];
  short_description: string;
  stock_status: string;
  ratingCount: number;
}

export default function OnSaleProducts({ products }: { products: Product[] }) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price,
      image: product.images[0]?.src || "/BlurImage.jpg",
      quantity: 1,
    });
    openCart();
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
      layout
    >
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative group"
            onHoverStart={() => setHoveredProduct(product.id)}
            onHoverEnd={() => setHoveredProduct(null)}
          >
            <motion.div
              className="bg-white bg-opacity-5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden">
                <OptimizedImage
                  src={product.images[0]?.src || "/BlurImage.jpg"}
                  alt={product.name}
                  width={400}
                  height={320}
                  className="w-full h-80 object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                  }}
                >
                  <Link href={`/product/${product.id}`} passHref>
                    <Button className="bg-white text-black hover:bg-gray-200">
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                   <Link href={`/product/${product.id}`}>
                   <h3 className="text-2xl font-bold">{product.name}</h3>
                   </Link>
                  <Badge>
                    {product.stock_status === "instock"
                      ? "In Stock"
                      : "Out of Stock"}
                  </Badge>
                </div>
                <p
                  className="text-gray-400 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                ></p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span
                      className="text-3xl font-bold mr-2"
                      style={{
                        background: "linear-gradient(to right, #fff, #888)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {product.sale_price} NIS
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {product.regular_price} NIS
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(parseFloat(product.average_rating))
                            ? "text-yellow-400"
                            : "text-gray-600"
                        } fill-current`}
                      />
                    ))}
                    <span className="ml-2 text-gray-400">
                      {product.average_rating}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_status !== "instock"}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <WishlistButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.sale_price,
                      image: product.images[0]?.src,
                      average_rating: product.average_rating,
                      rating_count: product.ratingCount,
                      short_description: product.short_description,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
