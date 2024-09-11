/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Star, ChevronRight, X, AlertCircle, ChevronDown, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Product {
  id: number
  name: string
  price: string
  regular_price: string
  categories: { id: number; name: string; slug: string }[]
  average_rating: string
  images: { src: string }[]
  description: string
  date_created: string
}

interface Category {
  id: number
  name: string
  slug: string
}

const QuickViewModal = ({ product, onClose }: {
  product: Product,
  onClose: () => void
}) => {
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
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={product.images[0]?.src || '/BlurImage.jpg'} alt={product.name} className="w-full h-auto rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4"
              style={{
                background: 'linear-gradient(to right, #fff, #888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >{product.name}</h2>
            <p className="text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: product.description }}></p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(product.average_rating)) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
              ))}
              <span className="ml-2 text-gray-400">{product.average_rating}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(to right, #fff, #888)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >${product.price}</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {product.categories[0]?.name || 'Uncategorized'}
              </Badge>
            </div>
            <div className="flex gap-4">
              <Button className="flex-1 bg-black hover:bg-white hover:text-black text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="px-3 border-white hover:bg-blue-50 hover:text-black">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const SkeletonProduct = () => {
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
  )
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('date')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?per_page=20'),
          fetch('/api/categories')
        ])

        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data')

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData.products)
        setCategories([{ id: 0, name: 'All', slug: 'all' }, ...categoriesData.categories])
      } catch (error) {
        setError('Error fetching data. Please try again later.')
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products
    .filter(product =>
      (selectedCategory === 'All' || product.categories.some(cat => cat.name === selectedCategory)) &&
      parseFloat(product.price) >= priceRange[0] &&
      parseFloat(product.price) <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price)
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
        default:
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
      }
    })

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    if (event.target.id === 'minPrice') {
      setPriceRange([value, Math.max(value, priceRange[1])])
    } else {
      setPriceRange([Math.min(value, priceRange[0]), value])
    }
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                selectedCategory === category.name
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-300">
              Min Price: ${priceRange[0]}
            </label>
            <input
              type="range"
              id="minPrice"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300">
              Max Price: ${priceRange[1]}
            </label>
            <input
              type="range"
              id="maxPrice"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="w-full bg-black bg-grid-gray-800 relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">All Products</h1>
            <div className="flex items-center space-x-4">
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
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
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

          <div className="flex flex-col md:flex-row gap-8">
            <div className="hidden md:block md:w-1/4 space-y-6 bg-gray-900 p-6 rounded-lg">
              <FilterContent />
            </div>

            <div className="flex-1">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
              >
                <AnimatePresence>
                  {loading ? (
                    [...Array(9)].map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SkeletonProduct />
                      </motion.div>
                    ))
                  ) : (
                    filteredProducts.map(product => (
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
                            <img src={product.images[0]?.src || '/BlurImage.jpg'} alt={product.name} className="w-full h-80 object-cover" />
                            <motion.div
                              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
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
                            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-3xl font-bold" style={{
                                background: 'linear-gradient(to right, #fff, #888)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>${product.price}</span>
                              <Badge variant="secondary" className="bg-white text-black px-3 py-1 rounded-full">
                                {product.categories[0]?.name || 'Uncategorized'}
                              </Badge>
                            </div>
                            <div className="flex items-center mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(product.average_rating)) ? 'text-yellow-400' : 'text-gray-600'} fill-current`} />
                              ))}
                              <span className="ml-2 text-gray-400">{product.average_rating}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <Button className="flex-1 mr-2 bg-white text-black hover:bg-gray-200">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Button variant="outline" className="px-3 border-white text-white hover:bg-white hover:text-black">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>

              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-200">No products found</h3>
                  <p className="mt-1 text-sm text-gray-400">Try changing your filters or search criteria.</p>
                </div>
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
  )
}