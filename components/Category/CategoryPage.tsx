"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { WishlistButton } from "../WishlistButton";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const sizeAttribute = product.attributes.find((attr) => attr.name === "Size");

  const handleAddToCart = () => {
    if (sizeAttribute && !selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    onAddToCart(product, selectedSize);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-black text-white p-8 rounded-2xl max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Image
              src={product.images[0]?.src || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2">
            <Link href={`/product/${product.id}`}>
              <h2
                className="text-3xl font-bold mb-4"
                style={{
                  background: "linear-gradient(to right, #fff, #888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {product.name}
              </h2>
            </Link>
            <div
              className="text-gray-300 mb-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(parseFloat(product.average_rating))
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } fill-current`}
                />
              ))}
              <span className="ml-2 text-gray-400">
                {product.average_rating}
              </span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(to right, #fff, #888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {product.price} NIS
              </span>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {product.categories[0]?.name || "Uncategorized"}
              </Badge>
            </div>
            {sizeAttribute && (
              <div className="mb-4">
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeAttribute.options.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-white text-black hover:bg-gray-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="px-3 border-white hover:bg-blue-50 hover:text-black"
              >
                <Heart className="w-4 h-4" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkeletonProduct: React.FC = () => {
  return (
    <div className="bg-white bg-opacity-5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm animate-pulse">
      <div className="relative overflow-hidden">
        <div className="w-full h-80 bg-gray-700" />
      </div>
      <div className="p-6">
        <div className="h-8 bg-gray-700 rounded mb-2" />
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-24 bg-gray-700 rounded" />
          <div className="h-6 w-20 bg-gray-700 rounded-full" />
        </div>
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-700 rounded-full mr-1" />
            ))}
          </div>
          <div className="ml-2 h-4 w-8 bg-gray-700 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-10 w-32 bg-gray-700 rounded" />
          <div className="h-10 w-10 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

interface CategoryPageProps {
  initialProducts: Product[];
  categorySlug: string;
  currentPage: number;
  totalProducts: number;
  productsPerPage: number;
}

export default function CategoryPage({
  initialProducts,
  categorySlug,
  currentPage,
  totalProducts,
  productsPerPage,
}: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
      default:
        return (
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
        );
    }
  });

  const handleAddToCart = useCallback((product: Product, size: string) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.src || "/placeholder.svg",
      quantity: 1,
      size: size,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [addToCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <SkeletonProduct key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="w-full bg-black bg-grid-gray-800 relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold capitalize">
              {categorySlug.replace("-", " ")}
            </h1>
            <div>
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                className="px-4 py-2 border rounded-full bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Newest</option>
                <option value="name">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              <AnimatePresence>
                {sortedProducts.map((product, index) => (
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
                        <Image
                          src={product.images[0]?.src || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-80 object-cover"
                          priority={index === 0}
                        />
                        <motion.div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: hoveredProduct === product.id ? 1 : 0,
                          }}
                        >
                          <Button
                            className="bg-white text-black hover:bg-gray-200"
                            onClick={() => setSelectedProduct(product)}
                          >
                            Quick View
                          </Button>
                        </motion.div>
                      </div>
                      <div className="p-6">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-2xl font-bold mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex justify-between items-center mb-4">
                          <span
                            className="text-3xl font-bold"
                            style={{
                              background:
                                "linear-gradient(to right, #fff, #888)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {product.price} NIS
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-white text-black px-3 py-1 rounded-full"
                          >
                            {product.categories[0]?.name || "Uncategorized"}
                          </Badge>
                        </div>
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i <
                                Math.floor(parseFloat(product.average_rating))
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              } fill-current`}
                            />
                          ))}
                          <span className="ml-2 text-gray-400">
                            {product.average_rating}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <WishlistButton
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image:
                                product.images[0]?.src || "/placeholder.svg",
                              average_rating: product.average_rating,
                              rating_count: product.ratingCount,
                              attributes: product.attributes,
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
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-200">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Try changing your filters or search criteria.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => {
                const newPage = currentPage - 1;
                window.location.href = `?page=${newPage}`;
              }}
              disabled={currentPage === 1}
              className="mr-2"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => {
                  const newPage = index + 1;
                  window.location.href = `?page=${newPage}`;
                }}
                className={`mx-1 ${
                  currentPage === index + 1 ? "bg-white text-black" : ""
                }`}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => {
                const newPage = currentPage + 1;
                window.location.href = `?page=${newPage}`;
              }}
              disabled={currentPage === totalPages}
              className="ml-2"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}