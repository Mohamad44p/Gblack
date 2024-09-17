"use client";

import { useState, useEffect } from "react";
import ImageGallery from "@/components/singel/ImageGallery";
import { Button } from "@/components/ui/button";
import { Star, Truck, Share2, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { openCart } from "@/lib/hooks/events";
import ProductReviews from "./ProductReviews";
import AlsoLikePr from "./AlsoLike/AlsoLikePr";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
}: {
  product: ProductProps;
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const { addToCart } = useCart();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/shipping-zones")
      .then((response) => response.json())
      .then((data) => setShippingZones(data))
      .catch((error) => console.error("Error fetching shipping zones:", error));
  }, []);

  const sizes =
    product.attributes.find((attr) => attr.name === "Size")?.options || [];
  const isOnSale =
    product.sale_price !== "" && product.sale_price !== product.regular_price;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
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
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.short_description,
          url: product.permalink,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      toast({
        title: "Share",
        description: "Copy this link: " + product.permalink,
      });
    }
  };

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
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold md:text-3xl">
                  ${isOnSale ? product.sale_price : product.regular_price}
                </span>
                {isOnSale && (
                  <span className="mb-0.5 text-red-500 line-through">
                    ${product.regular_price}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                Incl. VAT plus shipping
              </span>
            </motion.div>

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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        product.stock_quantity,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-16 text-center bg-transparent border-gray-600"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock_quantity, quantity + 1))
                  }
                >
                  +
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-2.5 mb-6">
              <Button
                className="flex-1 mr-2 bg-gradient-to-r from-gray-500 to-gray-50 hover:from-gray-100 hover:to-slate-600 text-white transition-all duration-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 transition-all duration-300"
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
            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                variant="ghost"
                className="transition-all duration-300"
              >
                Contact Our Experts
              </Button>
            </motion.div>
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
              {shippingZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <span className="text-gray-300">{zone.name}:</span>
                  <span className="text-gray-300">
                    ${zone.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <p className="mt-4 text-gray-300">
                Free standard shipping on orders over $100. Expedited and
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
