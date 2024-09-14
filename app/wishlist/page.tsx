'use client'

import React, { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Eye, Star, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  rating?: number;
  salePrice?: string;
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-black text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-center text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-black border border-white/20 overflow-hidden group relative rounded-lg">
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
                      <div className="absolute top-2 left-2 z-30 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
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
                          className="absolute inset-0 bg-black/80 flex items-center justify-center gap-4"
                        >
                          <Button
                            size="icon"
                            className="bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                className="bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full"
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black text-white border border-white/20">
                              <DialogHeader>
                                <DialogTitle>{item.name}</DialogTitle>
                                <DialogDescription>
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/2">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={400}
                                        height={400}
                                        objectFit="cover"
                                        className="rounded-lg"
                                      />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                      <p className="text-lg font-semibold mb-2">{item.brand}</p>
                                      <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-4 h-4 ${i < (item.rating || 0) ? "text-yellow-400 fill-current" : "text-white/20"}`} />
                                        ))}
                                      </div>
                                      <p className="text-xl font-bold mb-2">
                                        {item.salePrice ? (
                                          <>
                                            <span className="text-red-500 mr-2">${item.salePrice}</span>
                                            <span className="text-white/60 line-through">${item.price}</span>
                                          </>
                                        ) : (
                                          <span>${item.price}</span>
                                        )}
                                      </p>
                                      <Button
                                        className="w-full mt-4 bg-white text-black hover:bg-white/80 transition-all duration-300"
                                        onClick={() => handleAddToCart(item)}
                                      >
                                        Add to Cart
                                      </Button>
                                    </div>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-white/60 mb-1 font-medium">{item.brand}</p>
                      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-white/80 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < (item.rating || 0) ? "text-yellow-400 fill-current" : "text-white/20"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {item.salePrice ? (
                          <>
                            <span className="text-xl font-bold text-white">${item.salePrice}</span>
                            <span className="text-sm text-red-500 line-through">${item.price}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-white">${item.price}</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-red-500 transition-colors duration-300"
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