'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Star, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { WishlistButton } from '../WishlistButton'
import { openCart } from '@/lib/hooks/events'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: number
  name: string
  price: string
  regular_price: string
  sale_price: string
  categories: { id: number; name: string; slug: string }[]
  average_rating: string
  images: { src: string }[]
  description: string
  attributes: { name: string; options: string[] }[]
  ratingCount: number;
  short_description: string;
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
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const isOnSale = product.sale_price !== '' && product.sale_price !== product.regular_price
  const sizeAttribute = product.attributes.find(attr => attr.name === 'Size')

  const handleAddToCart = () => {
    if (sizeAttribute && sizeAttribute.options.length > 0 && !selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: isOnSale ? product.sale_price : product.regular_price,
      image: product.images[0]?.src || '/BlurImage.jpg',
      quantity: 1,
      size: selectedSize
    })
    onClose()
  }

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
            <Image src={product.images[0]?.src || '/BlurImage.jpg'} alt={product.name} width={400} height={400} className="w-full h-auto rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4"
              style={{
                background: 'linear-gradient(to right, #fff, #888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >{product.name}</h2>
            <p className="text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }}></p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(product.average_rating)) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
              ))}
              <span className="ml-2 text-gray-400">{product.average_rating}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              {isOnSale ? (
                <div>
                  <span className="text-3xl font-bold mr-2"
                    style={{
                      background: 'linear-gradient(to right, #fff, #888)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >{product.sale_price} NIS</span>
                  <span className="text-xl text-gray-400 line-through">${product.regular_price}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(to right, #fff, #888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >{product.regular_price} NIS</span>
              )}
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {product.categories[0]?.name || 'Uncategorized'}
              </Badge>
            </div>
            {sizeAttribute && sizeAttribute.options.length > 0 && (
              <div className="mb-6">
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-400 mb-2">
                  Select Size
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeAttribute.options.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-4 mb-4">
              <Button
                className="flex-1 bg-white hover:bg-gray-200 text-black"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <WishlistButton product={{
                id: product.id,
                name: product.name,
                price: isOnSale ? product.sale_price : product.regular_price,
                image: product.images[0]?.src || '/BlurImage.jpg',
                average_rating: product.average_rating,
                rating_count: product.ratingCount,
                short_description: product.short_description
              }} />
            </div>
            <Link href={`/product/${product.id}`} passHref>
              <Button
                className="w-full bg-transparent hover:bg-white hover:text-black text-white border border-white"
                onClick={onClose}
              >
                View All Details
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )


}

const ProductSkeleton = () => (
  <div className="bg-white bg-opacity-5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm p-6">
    <Skeleton className="w-full h-80 mb-4" />
    <Skeleton className="w-3/4 h-8 mb-2" />
    <Skeleton className="w-1/2 h-6 mb-4" />
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="w-1/3 h-8" />
      <Skeleton className="w-1/4 h-6 rounded-full" />
    </div>
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-5 h-5 mr-1" />
      ))}
      <Skeleton className="w-10 h-5 ml-2" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="w-2/3 h-10" />
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
)

export default function AllHome() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCart = (product: Product) => {
    const isOnSale = product.sale_price !== '' && product.sale_price !== product.regular_price
    const sizeAttribute = product.attributes.find(attr => attr.name === 'Size')

    if (sizeAttribute && sizeAttribute.options.length > 0) {
      setSelectedProduct(product)
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: isOnSale ? product.sale_price : product.regular_price,
        image: product.images[0]?.src || '/BlurImage.jpg',
        quantity: 1
      })
      openCart()
    }
  }

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.categories.some(cat => cat.name === selectedCategory))

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="w-full bg-black bg-grid-gray-800 relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-dot-white/[0.2] -z-10" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            className="text-7xl font-extrabold mb-12 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {loading ? (
              <Skeleton className="w-3/4 h-20 mx-auto" />
            ) : (
              <h1 style={{
                background: 'linear-gradient(to right, #fff, #888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Future Tech Emporium
              </h1>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center space-x-4 mb-16 flex-wrap"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loading ? (
              [...Array(5)].map((_, index) => (
                <Skeleton key={index} className="w-24 h-10 rounded-full mb-2" />
              ))
            ) : (
              categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 mb-2 ${selectedCategory === category.name
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                    }`}
                >
                  {category.name}
                </Button>
              ))
            )}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            layout
          >
            <AnimatePresence>
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductSkeleton />
                  </motion.div>
                ))
              ) : (
                filteredProducts.map(product => {
                  const isOnSale = product.sale_price !== '' && product.sale_price !== product.regular_price
                  return (
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
                          <Image src={product.images[0]?.src || '/BlurImage.jpg'} alt={product.name} width={400} height={320} className="w-full h-80 object-cover" />
                          {isOnSale && (
                            <Badge className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full">
                              Sale
                            </Badge>
                          )}
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
                            {isOnSale ? (
                              <div>
                                <span className="text-3xl font-bold mr-2" style={{
                                  background: 'linear-gradient(to right, #fff, #888)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }}>${product.sale_price}</span>
                                <span className="text-xl text-gray-400 line-through">{product.regular_price} NIS</span>
                              </div>
                            ) : (
                              <span className="text-3xl font-bold" style={{
                                background: 'linear-gradient(to right, #fff, #888)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>{product.regular_price} NIS</span>
                            )}
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
                            <Button
                              className="flex-1 mr-2 bg-white text-black hover:bg-gray-200"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <WishlistButton product={{
                              id: product.id,
                              name: product.name,
                              price: isOnSale ? product.sale_price : product.regular_price,
                              image: product.images[0]?.src,
                              average_rating: product.average_rating,
                              rating_count: product.ratingCount,
                              short_description: product.short_description
                            }} />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="px-8 py-3 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full">
              <Link href="/all">
                View All Products
              </Link>
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
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