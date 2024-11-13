"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Bell,
  Share2,
  Star,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { openCart } from "@/lib/hooks/events";
import ProductReviews from "./ProductReviews";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ShippingZone {
  id: number;
  name: string;
  price: number;
}

interface ProductProps {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  description: string;
  short_description: string;
  average_rating: string;
  rating_count: number;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  stock_quantity: number;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  manage_stock: boolean;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number;
  sold_individually: boolean;
}

function ImageGallery({
  images,
  isOnSale,
}: {
  images: ProductImage[];
  isOnSale: boolean;
}) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set([images[0].id])
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLastImageReached, setIsLastImageReached] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Added state for sidebar visibility
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((image) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = image.src;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(image.id));
            resolve();
          };
        });
      });
      await Promise.all(imagePromises);
    };
    preloadImages();
  }, [images]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = imageRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setCurrentIndex(index);
            setIsLastImageReached(index === images.length - 1);
          }
        }
      });
    }, options);

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current && sidebarRef.current) {
        const galleryRect = galleryRef.current.getBoundingClientRect();
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const lastImageRect =
          imageRefs.current[images.length - 1]?.getBoundingClientRect();

        if (lastImageRect) {
          const maxScrollPosition =
            lastImageRect.bottom - sidebarRect.height - window.innerHeight / 2;
          const newPosition = Math.min(
            Math.max(0, window.scrollY - galleryRect.top),
            maxScrollPosition
          );
          setSidebarPosition(newPosition);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current && imageRefs.current[images.length - 1]) {
        const lastImageRect =
          imageRefs.current[images.length - 1]?.getBoundingClientRect();
        const windowHeight = window.innerHeight - 150;
        if (lastImageRect) {
          setIsSidebarVisible(lastImageRect.bottom > windowHeight);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const scrollToImage = useCallback((index: number) => {
    if (galleryRef.current) {
      const imageElement = galleryRef.current.children[index] as HTMLElement;
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  return (
    <div className="relative">
      <div ref={galleryRef} className="space-y-0">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            className="relative h-screen"
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className={cn(
                "transition-opacity duration-300",
                loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
              )}
            />
            {isOnSale && index === 0 && (
              <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm font-bold tracking-wider text-white shadow-md">
                SALE
              </span>
            )}
            <button
              className="absolute right-2 top-2 bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
              onClick={() => openModal(index)}
            >
              <ZoomIn size={24} className="text-white" />
            </button>
          </motion.div>
        ))}
      </div>
      <motion.div
        ref={sidebarRef}
        className={cn(
          "fixed left-4 top-1/2 transform -translate-y-1/2 space-y-4",
          isSidebarVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )} // Updated className to use isSidebarVisible
        initial={{ opacity: 1 }}
        animate={{ opacity: isSidebarVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "w-16 h-16 cursor-pointer transition-all duration-300",
              index === currentIndex
                ? "ring-2 ring-primary scale-110"
                : "opacity-70 hover:opacity-100"
            )}
            onClick={() => scrollToImage(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={64}
              height={64}
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                onClick={prevImage}
              >
                <ChevronLeft size={48} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                onClick={nextImage}
              >
                <ChevronRight size={48} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EnhancedProductPage({
  product,
  shippingZones,
}: {
  product: ProductProps;
  shippingZones: ShippingZone[];
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isLowStock, setIsLowStock] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const productInfoRef = useRef<HTMLDivElement>(null);

  const sizes =
    product.attributes.find((attr) => attr.name === "Size")?.options || [];
  const isOnSale =
    product.sale_price !== "" && product.sale_price !== product.regular_price;

  useEffect(() => {
    if (product.manage_stock) {
      setIsLowStock(product.stock_quantity <= product.low_stock_amount);
      setIsOutOfStock(product.stock_quantity === 0);
    }
  }, [product.manage_stock, product.stock_quantity, product.low_stock_amount]);

  const handleAddToCart = useCallback(() => {
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    if (product.sold_individually && quantity > 1) {
      toast({
        title: "Quantity Limit",
        description: "This product can only be purchased one at a time.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: isOnSale ? product.sale_price : product.regular_price,
      image: product.images[0]?.src || "/BlurImage.jpg",
      quantity: quantity,
      size: selectedSize,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (Size: ${
        selectedSize || "N/A"
      }) added to your cart.`,
    });
    openCart();
  }, [
    addToCart,
    isOnSale,
    product,
    quantity,
    selectedSize,
    sizes.length,
    isOutOfStock,
  ]);

  const handleShare = useCallback(() => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.short_description,
          url: productUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      toast({
        title: "Share",
        description: "Copy this link: " + productUrl,
      });
    }
  }, [product.id, product.name, product.short_description]);

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (product.sold_individually) {
        setQuantity(1);
        return;
      }
      setQuantity((prevQuantity) => {
        if (product.stock_quantity === null) {
          return Math.max(1, newQuantity);
        }
        return Math.max(1, Math.min(product.stock_quantity, newQuantity));
      });
    },
    [product.stock_quantity, product.sold_individually]
  );

  const handleNotifyMe = useCallback(() => {
    toast({
      title: "Notification Set",
      description: "We'll notify you when this product is back in stock.",
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full min-h-screen flex md:flex-row flex-col items-start justify-between">
        <div className="w-full md:w-1/2">
          <ImageGallery images={product.images} isOnSale={isOnSale} />
        </div>
        <div className="w-full md:w-1/2 p-8 sticky top-0">
          <div ref={productInfoRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm text-gray-500">
                {product.categories.map((cat) => cat.name).join(" > ")}
              </span>
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold">
                  {isOnSale ? product.sale_price : product.regular_price} NIS
                </span>
                {isOnSale && (
                  <span className="text-sm text-red-500 line-through">
                    {product.regular_price} NIS
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2">
                <span className="text-lg font-semibold mr-2">
                  {product.stock_quantity} in stock
                </span>
                <Badge variant="secondary" className="text-sm">
                  SKU: {product.sku}
                </Badge>
              </div>
              <p
                className="text-sm text-gray-600 mt-4"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              ></p>

              {isLowStock && !isOutOfStock && (
                <Alert variant="default" className="mt-4">
                  <AlertTitle>Low Stock</AlertTitle>
                  <AlertDescription>
                    Only {product.stock_quantity} items left in stock!
                  </AlertDescription>
                </Alert>
              )}

              {isOutOfStock && (
                <Alert variant="default" className="mt-4">
                  <AlertTitle>Out of Stock</AlertTitle>
                  <AlertDescription>
                    This product is currently unavailable.
                  </AlertDescription>
                </Alert>
              )}

              {sizes.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Select Size</h2>

                  <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="flex flex-wrap  gap-2"
                  >
                    {sizes.map((size) => (
                      <div key={size}>
                        <RadioGroupItem
                          value={size.toLowerCase()}
                          id={`size-${size.toLowerCase()}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size.toLowerCase()}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-gray-100 cursor-pointer transition-all duration-300"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Quantity</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={isOutOfStock || product.sold_individually}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock_quantity || undefined}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center"
                    disabled={isOutOfStock || product.sold_individually}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isOutOfStock || product.sold_individually}
                  >
                    +
                  </Button>
                </div>
                {product.sold_individually && (
                  <p className="text-sm text-gray-500 mt-2">
                    This product can only be purchased one at a time.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 mt-6">
                <Button
                  variant={"default"}
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isOutOfStock}
                >
                  Buy now
                </Button>
                <WishlistButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: isOnSale
                      ? product.sale_price
                      : product.regular_price,
                    image: product.images[0]?.src || "/BlurImage.jpg",
                    average_rating: product.average_rating,
                    rating_count: product.rating_count,
                    attributes: product.attributes,
                    short_description: product.short_description,
                  }}
                />
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {isOutOfStock && (
                <div className="mt-6">
                  <Button onClick={handleNotifyMe} className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me When Available
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <div className="w-full my-[20vh]">
        <Tabs
          defaultValue="Description"
          className="w-full max-w-screen-xl mx-auto"
        >
          <TabsList className="w-full border-b border-gray-200 bg-transparent">
            {["Description", "Details", "Reviews", "Shipping"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 py-4 text-sm font-semibold uppercase tracking-wide text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Description" className="mt-6 p-4">
            <div className="space-y-4">
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Details" className="mt-6 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>SKU: {product.sku}</li>
                <li>Weight: {product.weight}</li>
                <li>
                  Dimensions: {product.dimensions.length} x{" "}
                  {product.dimensions.width} x {product.dimensions.height}
                </li>
                {product.attributes.map((attr) => (
                  <li key={attr.id}>
                    {attr.name}: {attr.options.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="Reviews" className="mt-6 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Reviews</h3>
              <ProductReviews productId={product.id} />
            </div>
          </TabsContent>
          <TabsContent value="Shipping" className="mt-6 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping & Returns</h3>
              <h4 className="text-md font-semibold">
                Shipping Zones and Rates:
              </h4>
              {shippingZones && shippingZones.length > 0 ? (
                shippingZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                  >
                    <span>{zone.name}:</span>
                    <span>
                      {typeof zone.price === "number"
                        ? zone.price.toFixed(2)
                        : "N/A"}{" "}
                      NIS
                    </span>
                  </div>
                ))
              ) : (
                <p>No shipping zones available.</p>
              )}
              <p className="mt-4">
                Free standard shipping on orders over 100 NIS. Expedited and
                international shipping options available at checkout. Please
                allow 1-3 business days for processing.
              </p>
              <h4 className="text-md font-semibold mt-6">Returns Policy</h4>
              <p>
                We offer a 30-day return policy for most items. Please refer to
                our full returns policy for more details and exclusions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
