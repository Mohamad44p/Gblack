"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, X } from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { openCart } from "@/lib/hooks/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  attributes?: Array<{ name: string; options: string[] }>;
}

interface AlsoLikePrProps {
  products: Product[];
}

export default function AlsoLikePr({ products }: AlsoLikePrProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(0);
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

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

  const handleAddToCart = (product: Product) => {
    const sizeAttribute = product.attributes?.find(
      (attr) => attr.name.toLowerCase() === "size"
    );
    if (sizeAttribute && sizeAttribute.options.length > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      addToCartWithSize(product, null);
    }
  };

  const addToCartWithSize = (product: Product, size: string | null) => {
    const price = parseFloat(product.price);
    if (isNaN(price)) {
      toast({
        title: "Error",
        description: "Invalid price. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: price.toFixed(2),
      image: product.images[0]?.src || "/BlurImage.jpg",
      quantity: 1,
      size: size || undefined,
    });
    toast({
      title: "Added to cart",
      description: `1 x ${product.name}${size ? ` (Size: ${size})` : ''} added to your cart.`,
    });
    openCart();
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const handleSizeSelection = () => {
    if (selectedProduct && selectedSize) {
      addToCartWithSize(selectedProduct, selectedSize);
    } else {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">YOU MAY ALSO LIKE...</h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => {
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
                    <div className="relative bg-black p-4 rounded-lg overflow-hidden h-[400px]">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(#fff 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="relative w-full h-[200px] mb-4">
                          <Image
                            src={product.images[0]?.src || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {product.brand}
                        </p>
                        <div
                          className="text-sm mb-4 flex-grow overflow-hidden"
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
                            className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                            onClick={() => handleAddToCart(product)}
                            disabled={!isValidPrice}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <WishlistButton
                            product={{
                              id: product.id,
                              name: product.name,
                              price: isValidPrice ? price.toFixed(2) : "0.00",
                              image: product.images[0]?.src || "/BlurImage.jpg",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={prevSlide}
            className="mx-2 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="mx-2 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black text-white border border-white/20">
          <DialogHeader>
            <DialogTitle>Select a Size</DialogTitle>
            <DialogDescription>
              Please select a size before adding the item to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              {selectedProduct?.attributes
                ?.find((attr) => attr.name.toLowerCase() === "size")
                ?.options.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSizeSelection}>
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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