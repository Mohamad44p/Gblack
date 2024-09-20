"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Sparkles,
  Zap,
  Tag,
  Eye,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { WishlistButton } from "@/components/WishlistButton";
import { openCart } from "@/lib/hooks/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  images: { src: string }[];
  average_rating: string;
  rating_count: number;
  attributes?: Array<{ name: string; options: string[] }>;
}

interface AlsoLikePrProps {
  products: Product[];
  featuredImage: string;
  featuredTitle: string;
  featuredDescription: string;
}

const ProductCard = ({ product, handleAddToCart }: { product: Product; handleAddToCart: (product: Product, size?: string) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price!);
  const formattedPrice = `$${parseFloat(product.regular_price!).toFixed(2)}`;
  const formattedSalePrice = `$${parseFloat(product.sale_price || product.price).toFixed(2)}`;
  const sizeAttribute = product.attributes?.find((attr) => attr.name === "Size");

  const handleAddToCartClick = useCallback(() => {
    if (sizeAttribute && sizeAttribute.options.length > 0) {
      setIsModalOpen(true);
    } else {
      handleAddToCart(product);
    }
  }, [sizeAttribute, handleAddToCart, product]);

  const handleSizeSelection = useCallback(() => {
    if (selectedSize) {
      handleAddToCart(product, selectedSize);
      setIsModalOpen(false);
      setSelectedSize("");
    } else {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
    }
  }, [selectedSize, handleAddToCart, product]);

  return (
    <Card
      className="h-[400px] w-full bg-black border border-white/20 overflow-hidden relative rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 flex flex-col h-full relative">
        <Link
          href={`/product/${product.id}`}
          className="relative w-full h-[300px] overflow-hidden"
        >
          <Image
            src={product.images[0].src}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-300 hover:scale-105"
          />
          {isOnSale && (
            <div className="absolute top-2 left-2 z-30 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              Sale
            </div>
          )}
          {isHovered && (
            <Button
              size="sm"
              className="absolute top-2 right-2 bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          )}
        </Link>
        <div className="p-4 flex-grow flex flex-col justify-between bg-black">
          <div>
            <Link href={`/product/${product.id}`} className="block">
              <h3 className="text-lg font-semibold mb-2 text-white hover:text-white/80 transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(parseFloat(product.average_rating))
                    ? "text-yellow-400 fill-current"
                    : "text-white/20"
                    }`}
                />
              ))}
              <span className="ml-2 text-sm text-white/60">
                ({product.rating_count})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {isOnSale ? (
                <>
                  <span className="text-xl font-bold text-white">
                    {formattedSalePrice}
                  </span>
                  <span className="text-sm text-red-500 line-through">
                    {formattedPrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-white">
                  {formattedPrice}
                </span>
              )}
            </div>
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                price: isOnSale ? product.sale_price || product.price : product.regular_price,
                image: product.images[0].src,
                average_rating: product.average_rating,
                rating_count: product.rating_count,
                short_description: product.description,
              }}
            />
          </div>
          <Button
            size="sm"
            className="mt-2 bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full"
            onClick={handleAddToCartClick}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black text-white border border-white/20">
          <DialogHeader>
            <DialogTitle>Select a Size</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              {sizeAttribute &&
                sizeAttribute.options.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSizeSelection}>Add to Cart</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[700px] bg-black text-white border border-white/20">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square">
              <Image
                src={product.images[0].src}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-lg font-semibold mb-2">
                  {isOnSale ? (
                    <>
                      <span className="text-red-500 mr-2">
                        {formattedSalePrice}
                      </span>
                      <span className="text-white/60 line-through">
                        {formattedPrice}
                      </span>
                    </>
                  ) : (
                    <span>{formattedPrice}</span>
                  )}
                </p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(parseFloat(product.average_rating))
                        ? "text-yellow-400 fill-current"
                        : "text-white/20"
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-white/60">
                    ({product.rating_count})
                  </span>
                </div>
                <p className="text-white/80 mb-4">
                  {product.description}
                </p>
                {sizeAttribute && (
                  <div className="mb-4">
                    <Label className="mb-2 block">Size</Label>
                    <RadioGroup
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <div className="flex flex-wrap gap-2">
                        {sizeAttribute.options.map((size) => (
                          <div key={size} className="flex items-center">
                            <RadioGroupItem
                              value={size}
                              id={`quick-size-${size}`}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`quick-size-${size}`}
                              className="px-3 py-1 border border-white/20 rounded-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
                            >
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-white text-black hover:bg-white/80 transition-all duration-300"
                  onClick={() => {
                    handleAddToCartClick();
                    setIsQuickViewOpen(false);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Link href={`/product/${product.id}`} passHref>
                  <Button variant="outline" className="flex-1">
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default function AlsoLikePr({ products, featuredImage, featuredTitle, featuredDescription }: AlsoLikePrProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi, onScroll]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const { addToCart } = useCart();
  const handleAddToCart = useCallback(
    (product: Product, size?: string) => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images[0].src,
        quantity: 1,
        size: size,
      });
      openCart();
    },
    [addToCart]
  );

  const memoizedProducts = useMemo(
    () =>
      products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-2"
        >
          <ProductCard product={product} handleAddToCart={handleAddToCart} />
        </motion.div>
      )),
    [products, handleAddToCart]
  );

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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="overflow-hidden h-[500px] border-0 shadow-2xl relative rounded-lg">
            <Image
              src={featuredImage}
              alt="Featured product"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
            <CardContent className="p-10 relative h-full z-20 flex items-center">
              <div className="max-w-lg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4 bg-white/10 backdrop-filter backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full inline-block"
                >
                  <Sparkles
                    className="inline-block mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  <span>Featured Collection</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-6xl font-bold mb-4 text-white"
                >
                  {featuredTitle}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl text-white/80 mb-6"
                >
                  {featuredDescription}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full"
                  >
                    <Zap className="mr-2 h-5 w-5" aria-hidden="true" />
                    <span>Explore Now</span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full"
            onClick={scrollPrev}
            aria-label="Previous products"
          >
            <ChevronLeft className="h-6 w-6 mr-2" aria-hidden="true" />
            <span>Previous</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full"
            onClick={scrollNext}
            aria-label="Next products"
          >
            <span>Next</span>
            <ChevronRight className="h-6 w-6 ml-2" aria-hidden="true" />
          </Button>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">{memoizedProducts}</div>
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}