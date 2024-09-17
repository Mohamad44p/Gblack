"use client";

import React, { useState } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Star, Tag, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  brand?: string;
  average_rating: string;
  rating_count: number;
  rating?: number;
  short_description: string;
  salePrice?: string;
  attributes: { name: string; options: string[] }[];
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-16 text-white min-h-screen">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-50">
        My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="text-center min-h-[30vh] flex flex-col gap-y-5 items-center justify-center">
          <p className="text-xl mb-8">Your wishlist is empty.</p>
          <Link href="/all" passHref>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-purple-500/20 overflow-hidden group relative rounded-xl shadow-xl">
                <CardContent className="p-0 flex flex-col h-full relative">
                  <div
                    className="relative w-full h-[300px] overflow-hidden"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-all duration-300 filter group-hover:brightness-110"
                    />
                    {item.salePrice && (
                      <div className="absolute top-3 left-3 z-30 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <Tag className="w-3 h-3 mr-1" />
                        Sale
                      </div>
                    )}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 backdrop-blur-sm"
                        >
                          <Link href={`/product/${item.id}`} passHref>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                              View Product
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                className="bg-white text-purple-600 hover:bg-purple-100 transition-all duration-300 rounded-full"
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gradient-to-br from-gray-900 to-black text-white border border-purple-500/20 rounded-xl shadow-2xl max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold mb-4">
                                  {item.name}
                                </DialogTitle>
                                <div className="flex flex-col md:flex-row gap-8">
                                  <div className="w-full md:w-1/2">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={400}
                                      height={400}
                                      objectFit="cover"
                                      className="rounded-lg shadow-lg"
                                    />
                                  </div>
                                  <div className="w-full md:w-1/2 flex flex-col justify-between">
                                    <div>
                                      <p className="text-lg font-semibold mb-2 text-purple-400">
                                        {item.brand}
                                      </p>
                                      <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                              i <
                                              Math.round(
                                                parseFloat(item.average_rating)
                                              )
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-600"
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-400">
                                          ({item.rating_count} reviews)
                                        </span>
                                      </div>
                                      <p className="text-2xl font-bold mb-4">
                                        {item.salePrice ? (
                                          <>
                                            <span className="text-red-500 mr-2">
                                              ${item.salePrice}
                                            </span>
                                            <span className="text-gray-400 line-through">
                                              ${item.price}
                                            </span>
                                          </>
                                        ) : (
                                          <span>${item.price}</span>
                                        )}
                                      </p>
                                      <p
                                        className="text-gray-300 mb-6"
                                        dangerouslySetInnerHTML={{
                                          __html: item.short_description,
                                        }}
                                      ></p>
                                    </div>
                                    <Link href={`/product/${item.id}`} passHref>
                                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                                        View Full Details
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-purple-400 mb-1 font-medium">
                        {item.brand}
                      </p>
                      <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(parseFloat(item.average_rating))
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">
                          ({item.rating_count})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        {item.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-white">
                              ${item.salePrice}
                            </span>
                            <span className="text-sm text-red-500 line-through">
                              ${item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            ${item.price}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
