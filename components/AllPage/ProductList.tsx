"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  X,
  AlertCircle,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCart } from "@/contexts/CartContext";
import { openCart } from "@/lib/hooks/events";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "../WishlistButton";

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  categories: { id: number; name: string; slug: string }[];
  average_rating: string;
  images: { src: string }[];
  description: string;
  short_description: string;
  date_created: string;
  stock_status: string;
  attributes: { name: string; options: string[] }[];
  ratingCount: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 12;

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const QuickViewModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const sizeAttribute = product.attributes.find((attr) => attr.name === "Size");

  const handleAddToCart = useCallback(() => {
    if (sizeAttribute && sizeAttribute.options.length > 0 && !selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0]?.src || "/placeholder.svg",
      quantity: 1,
      size: selectedSize,
    });
    onClose();
    openCart();
  }, [addToCart, onClose, product, selectedSize, sizeAttribute]);

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
          aria-label="Close quick view"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Image
              src={product.images[0]?.src || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-80 object-cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(600, 400)
              )}`}
            />
          </div>
          <div className="md:w-1/2">
            <Link href={`/product/${product.id}`} className="cursor-pointer">
              <h2
                className="text-xl font-bold mb-4"
                style={{
                  background: "linear-gradient(to right, #fff, #888)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {product.name}
              </h2>
            </Link>
            <p
              className="text-gray-300 mb-4 md:line-clamp-2 line-clamp-1"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            ></p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(parseFloat(product.average_rating))
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
              {product.on_sale ? (
                <div>
                  <span className="text-3xl font-bold text-red-500">
                    {product.sale_price} NIS
                  </span>
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    {product.regular_price} NIS
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">{product.price} NIS</span>
              )}
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {product.categories[0]?.name || "Uncategorized"}
              </Badge>
            </div>
            {sizeAttribute && sizeAttribute.options.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="size-select"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Select Size
                </label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a size</option>
                  {sizeAttribute.options.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-gray-200 text-black"
                disabled={product.stock_status === "onbackorder"}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="px-3 border-white hover:bg-white hover:text-black"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-5">
              <Link href={`/product/${product.id}`} className="cursor-pointer">
                <Button
                  variant="outline"
                  className="px-3 w-full border-white hover:bg-white hover:text-black"
                >
                  View Product Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const SkeletonProduct = () => {
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

export default function ProductList({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: "All", slug: "all" },
    ...initialCategories,
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGender, setSelectedGender] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [saleFilter, setSaleFilter] = useState("All");
  const [openAccordionItems, setOpenAccordionItems] = useState(["category"]);
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      const sizeAttribute = product.attributes.find(
        (attr) => attr.name === "Size"
      );
      if (sizeAttribute && sizeAttribute.options.length > 0) {
        setSelectedProduct(product);
      } else {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.sale_price || product.price,
          image: product.images[0]?.src,
          quantity: 1,
        });
        openCart();
      }
    },
    [addToCart]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const categoryMatch =
          selectedCategory === "All" ||
          product.categories.some((cat) => cat.name === selectedCategory);

        const productPrice = parseFloat(product.sale_price || product.price);
        const priceMatch =
          productPrice >= priceRange[0] && productPrice <= priceRange[1];

        const genderMatch =
          selectedGender === "All" ||
          product.attributes.some(
            (attr) =>
              attr.name === "Gender" && attr.options.includes(selectedGender)
          );

        const stockMatch =
          stockFilter === "All" ||
          (stockFilter === "In Stock" && product.stock_status === "instock") ||
          (stockFilter === "Out of Stock" &&
            product.stock_status === "outofstock");
        const saleMatch =
          saleFilter === "All" ||
          (saleFilter === "On Sale" && product.on_sale) ||
          (saleFilter === "Regular Price" && !product.on_sale);

        return (
          categoryMatch && priceMatch && genderMatch && stockMatch && saleMatch
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (
              parseFloat(a.sale_price || a.price) -
              parseFloat(b.sale_price || b.price)
            );
          case "price-desc":
            return (
              parseFloat(b.sale_price || b.price) -
              parseFloat(a.sale_price || a.price)
            );
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
  }, [
    products,
    selectedCategory,
    priceRange,
    selectedGender,
    stockFilter,
    saleFilter,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);
      if (event.target.id === "minPrice") {
        setPriceRange([value, Math.max(value, priceRange[1])]);
      } else {
        setPriceRange([Math.min(value, priceRange[0]), value]);
      }
    },
    [priceRange]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setPriceRange([0, 1000]);
    setSelectedGender("All");
    setStockFilter("All");
    setSaleFilter("All");
    setSortBy("date");
    setCurrentPage(1);
  }, []);

  const FilterContent = () => (
    <Accordion
      type="multiple"
      value={openAccordionItems}
      onValueChange={setOpenAccordionItems}
      className="w-full"
    >
      <AccordionItem value="category" className="border-b border-gray-700">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-lg font-semibold">Category</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`block w-full text-left px-3 py-2 rounded-md ${selectedCategory === category.name
                  ? "bg-white text-black font-bold"
                  : "text-gray-300 hover:bg-gray-300 hover:text-black"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price" className="border-b border-gray-700">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-lg font-semibold">Price Range</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium text-gray-300"
              >
                Min Price: {priceRange[0]} NIS
              </label>
              <input
                type="range"
                id="minPrice"
                min="0"
                max="10000"
                step="100"
                value={priceRange[0]}
                onChange={handlePriceChange}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="maxPrice"
                className="block text-sm font-medium text-gray-300"
              >
                Max Price: {priceRange[1]} NIS
              </label>
              <input
                type="range"
                id="maxPrice"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="gender" className="border-b border-gray-700">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-lg font-semibold">Gender</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["All", "Men", "Women", "Both"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`block w-full text-left px-3 py-2 rounded-md ${selectedGender === gender
                  ? "bg-white text-black font-bold"
                  : "text-gray-300 hover:bg-gray-300 hover:text-black"
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="stock" className="border-b border-gray-700">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-lg font-semibold">Stock Status</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["All", "In Stock", "Out of Stock"].map((status) => (
              <button
                key={status}
                onClick={() => setStockFilter(status)}
                className={`block w-full text-left px-3 py-2 rounded-md ${stockFilter === status
                  ? "bg-white text-black font-bold"
                  : "text-gray-300 hover:bg-gray-300 hover:text-black"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sale" className="border-b border-gray-700">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-lg font-semibold">Sale Status</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["All", "On Sale", "Regular Price"].map((status) => (
              <button
                key={status}
                onClick={() => setSaleFilter(status)}
                className={`block w-full text-left px-3 py-2 rounded-md ${saleFilter === status
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-gray-300 hover:text-black"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="w-full bg-black bg-grid-gray-800 relative">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold md:block hidden">Filters</h2>
            <h1 className="md:text-4xl font-bold text-center text-xl">
              All Products
            </h1>
            <div className="flex items-center">
              <select
                className="px-4 py-2 border rounded-full bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Newest</option>
                <option value="name">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <Sheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] bg-black overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Apply filters to refine your product search.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block lg:w-1/4 space-y-6 bg-black p-6 rounded-lg border border-gray-700">
              <FilterContent />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
              >
                <AnimatePresence>
                  {loading
                    ? [...Array(9)].map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SkeletonProduct />
                      </motion.div>
                    ))
                    : paginatedProducts.map((product) => (
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
                              src={
                                product.images[0]?.src ||
                                "/placeholder.svg?height=400&width=600"
                              }
                              alt={product.name}
                              width={600}
                              height={400}
                              className="w-full h-80 object-cover"
                              placeholder="blur"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer(600, 400)
                              )}`}
                            />
                            {product.on_sale && (
                              <div className="absolute text-[10px] top-0 left-0 bg-red-500 text-white px-1 py-1 m-2 rounded-md">
                                On Sale
                              </div>
                            )}
                            <motion.div
                              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity:
                                  hoveredProduct === product.id ? 1 : 0,
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
                            <div className="flex justify-between items-center mb-2">
                              <Link
                                href={`/product/${product.id}`}
                                className="block"
                              >
                                <h3 className="text-sm font-bold hover:text-gray-300 transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                              <Badge>
                                {product.stock_status === "instock"
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </Badge>
                            </div>
                            <p
                              className="text-sm text-gray-400 mb-4 line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: product.short_description,
                              }}
                            ></p>
                            <div className="flex justify-between items-center mb-4">
                              {product.on_sale ? (
                                <div>
                                  <span className="text-xl font-bold text-white">
                                    {product.sale_price} NIS
                                  </span>
                                  <span className="ml-2 text-lg text-red-500 line-through">
                                    {product.regular_price} NIS
                                  </span>
                                </div>
                              ) : (
                                <span className="text-3xl font-bold">
                                  {product.price} NIS
                                </span>
                              )}
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${i <
                                      Math.floor(
                                        parseFloat(product.average_rating)
                                      )
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
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                                disabled={
                                  product.stock_status === "outofstock"
                                }
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <WishlistButton
                                product={{
                                  id: product.id,
                                  name: product.name,
                                  average_rating: product.average_rating,
                                  price: product.price,
                                  image: product.images[0]?.src,
                                  rating_count: product.ratingCount,
                                  short_description:
                                    product.short_description,
                                  attributes: product.attributes,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>

              {!loading && paginatedProducts.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-200">
                    No products found
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Try adjusting your search or filter to find what you&apos;re
                    looking for.
                  </p>
                  <Button className="mt-6" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
