/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle, ChevronDown, ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  priceRange: [number, number];
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const products = [
  {
    id: 1,
    name: "Classic Tee",
    price: 29.99,
    size: "S",
    category: "T-Shirts",
    image: "/assets/img1.jpeg",
  },
  {
    id: 2,
    name: "Vintage Shirt",
    price: 39.99,
    size: "M",
    category: "T-Shirts",
    image: "/assets/img2.jpeg",
  },
  {
    id: 3,
    name: "Casual Polo",
    price: 34.99,
    size: "L",
    category: "T-Shirts",
    image: "/assets/img3.jpeg",
  },
  {
    id: 4,
    name: "Cozy Hoodie",
    price: 49.99,
    size: "M",
    category: "Hoodies",
    image: "/assets/img4.jpeg",
  },
  {
    id: 5,
    name: "Soft Sweatshirt",
    price: 39.99,
    size: "L",
    category: "Sweatshirts",
    image: "/assets/img5.jpeg",
  },
  {
    id: 6,
    name: "Stylish Cap",
    price: 19.99,
    size: "One Size",
    category: "Accessories",
    image: "/assets/img6.jpeg",
  },
  {
    id: 7,
    name: "Trendy Jacket",
    price: 59.99,
    size: "M",
    category: "Jackets",
    image: "/assets/img7.jpeg",
  },
  {
    id: 8,
    name: "Comfy Socks",
    price: 9.99,
    size: "One Size",
    category: "Accessories",
    image: "/assets/img8.jpeg",
  },
  {
    id: 9,
    name: "Elegant Scarf",
    price: 24.99,
    size: "One Size",
    category: "Accessories",
    image: "/assets/img9.jpeg",
  },
];

const categories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Accessories",
  "Jackets",
];
const sizes = ["XS", "S", "M", "L", "XL", "One Size"];

export default function Component() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [error, setError] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = products
    .filter(
      (product) =>
        (selectedCategory === "All" || product.category === selectedCategory) &&
        (!selectedSize || product.size === selectedSize) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    const filters = [];
    if (selectedCategory !== "All") filters.push(selectedCategory);
    if (selectedSize) filters.push(selectedSize);
    if (priceRange[0] > 0 || priceRange[1] < 100)
      filters.push(`$${priceRange[0]}-$${priceRange[1]}`);
    setActiveFilters(filters);
  }, [selectedCategory, selectedSize, priceRange]);

  function removeFilter(filter: string) {
    if (categories.includes(filter)) setSelectedCategory("All");
    else if (sizes.includes(filter)) setSelectedSize("");
    else if (filter.startsWith("$")) setPriceRange([0, 100]);
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    if (event.target.id === "minPrice") {
      setPriceRange([value, Math.max(value, priceRange[1])]);
    } else {
      setPriceRange([Math.min(value, priceRange[0]), value]);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="bg-black shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">All Products</h1>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border rounded-full bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              className="md:hidden px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              Filters <ChevronDown className="inline-block ml-1" size={16} />
            </button>
          </div>
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 max-w-7xl mx-auto">
            {activeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => removeFilter(filter)}
                className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm flex items-center hover:bg-gray-700 transition-colors"
              >
                {filter} <X size={14} className="ml-1" />
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 shadow-lg p-6 overflow-y-auto md:hidden"
            >
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:block w-64 bg-black p-6 overflow-y-auto">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div
              className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-200">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Try changing your filters or search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-black px-4 py-2 rounded-full mr-2 hover:bg-gray-200 transition-colors">
                        <ShoppingCart size={20} className="inline-block mr-1" />{" "}
                        Add to Cart
                      </button>
                      <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                        <Heart size={20} className="inline-block mr-1" />{" "}
                        Wishlist
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-300 mb-2">
                      {product.category} • Size {product.size}
                    </p>
                    <p className="text-lg font-bold text-gray-100">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  priceRange,
  handlePriceChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 text-white">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-white">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
              className={`px-3 py-2 border rounded-md ${
                size === selectedSize
                  ? "bg-gray-700 text-white border-gray-600"
                  : "text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-white">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-300"
            >
              Min Price: ${priceRange[0]}
            </label>
            <input
              type="range"
              id="minPrice"
              min="0"
              max="100"
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
              Max Price: ${priceRange[1]}
            </label>
            <input
              type="range"
              id="maxPrice"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
