/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useState, useEffect } from "react";
import ImageGallery from "@/components/singel/ImageGallery";
import { Button } from "@/components/ui/button";
import { Star, Truck, Share2, ShoppingCart, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { openCart } from "@/lib/hooks/events";
import ProductReviews from "./ProductReviews";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface ProductImage {
  id: number;
  src: string;
  alt: string;
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SingleProductPage({
  product,
  shippingZones,
}: {
  product: ProductProps;
  shippingZones: ShippingZone[];
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const router = useRouter();
  const [isLowStock, setIsLowStock] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

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
    // Implement notification logic here
    toast({
      title: "Notification Set",
      description: "We'll notify you when this product is back in stock.",
    });
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      ref={ref}
      className="min-h-screen py-12 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <motion.div variants={fadeInUp}>
            <ImageGallery images={product.images} isOnSale={isOnSale} />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0"
          >
            <motion.div variants={fadeInUp} className="mb-2 md:mb-3">
              <span className="mb-0.5 inline-block text-gray-400">
                {product.categories.map((cat) => cat.name).join(" > ")}
              </span>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{
                  background: "linear-gradient(to right, #fff, #888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {product.name}
              </h1>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mb-6 flex items-center gap-3 md:mb-10"
            >
              <Button className="rounded-full gap-2" variant="outline">
                <span className="text-sm font-medium">
                  {product.average_rating}
                </span>
                <Star className="h-4 w-4 fill-current" />
              </Button>
              <span className="text-sm transition duration-100">
                {product.rating_count} Ratings
              </span>
              {product.sku && (
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold md:text-3xl">
                  {isOnSale ? product.sale_price : product.regular_price} NIS
                </span>
                {isOnSale && (
                  <span className="mb-0.5 text-red-500 line-through">
                    {product.regular_price} NIS
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                Incl. VAT plus shipping
              </span>
            </motion.div>

            {isLowStock && !isOutOfStock && (
              <Alert variant="default" className="mb-4">
                <AlertTitle>Low Stock</AlertTitle>
                <AlertDescription>
                  Only {product.stock_quantity} items left in stock!
                </AlertDescription>
              </Alert>
            )}

            {isOutOfStock && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Out of Stock</AlertTitle>
                <AlertDescription>
                  This product is currently unavailable.
                </AlertDescription>
              </Alert>
            )}

            {sizes.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Select Size</h2>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="flex gap-2"
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-sm font-semibold peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-gray-800 cursor-pointer transition-all duration-300"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            <motion.div variants={fadeInUp} className="mb-6">
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
                  className="w-16 text-center bg-transparent border-gray-600"
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
              {product.manage_stock && product.stock_quantity !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  {product.stock_quantity} in stock
                </p>
              )}
              {product.sold_individually && (
                <p className="text-sm text-muted-foreground mt-2">
                  This product can only be purchased one at a time.
                </p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-2.5 mb-6">
              <Button
                className="flex-1 mr-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 transition-all duration-300"
                disabled={isOutOfStock}
              >
                Buy now
              </Button>
              <WishlistButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: isOnSale ? product.sale_price : product.regular_price,
                  image: product.images[0]?.src || "/BlurImage.jpg",
                  average_rating: product.average_rating,
                  rating_count: product.rating_count,
                  attributes: product.attributes,
                  short_description: product.short_description,
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="hover:bg-gray-800 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>

            {isOutOfStock && (
              <motion.div variants={fadeInUp} className="mb-6">
                <Button onClick={handleNotifyMe} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me When Available
                </Button>
              </motion.div>
            )}

            {product.backorders_allowed && product.backorders !== "no" && (
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge variant="secondary">Backorder Available</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  This product can be backordered. We'll ship it as soon as it's
                  back in stock.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <motion.div variants={fadeInUp}>
        <Tabs
          defaultValue="details"
          className="w-full max-w-screen-lg mx-auto my-32 rounded-lg shadow-xl"
        >
          <TabsList className="w-full border-b border-gray-800 bg-transparent">
            {["details", "reviews", "shipping"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 py-4 text-sm font-semibold uppercase tracking-wide text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-white transition-colors"
              >
                {tab === "shipping" ? "Shipping & Returns" : tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="details" className="mt-6 p-6 rounded-b-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Description</h4>
                <div
                  className="text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 p-6 rounded-b-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Reviews</h3>
              <ProductReviews productId={product.id} />
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6 p-6 rounded-b-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping & Returns</h3>
              <h4 className="text-md font-semibold text-gray-300">
                Shipping Zones and Rates:
              </h4>
              {shippingZones && shippingZones.length > 0 ? (
                shippingZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-gray-300">{zone.name}:</span>
                    <span className="text-gray-300">
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
              <p className="mt-4 text-gray-300">
                Free standard shipping on orders over 100 NIS. Expedited and
                international shipping options available at checkout. Please
                allow 1-3 business days for processing.
              </p>
              <h4 className="text-md font-semibold mt-6 text-gray-300">
                Returns Policy
              </h4>
              <p className="text-gray-300">
                We offer a 30-day return policy for most items. Please refer to
                our full returns policy for more details and exclusions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
