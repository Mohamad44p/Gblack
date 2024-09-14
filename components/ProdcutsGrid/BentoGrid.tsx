'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles, Zap, Plus, Tag, Heart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { WishlistButton } from '../WishlistButton'
import { openCart } from '@/lib/hooks/events'

export interface Product {
  id: number
  name: string
  brand: string
  price: number
  salePrice: number
  rating: number
  image1: string
  image2: string
}

interface ShowcaseProps {
  title: string
  products: Product[]
  featuredImage: string
  featuredTitle: string
  featuredDescription: string
}

interface ProductCardProps {
  product: Product;
  handleAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, handleAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const isOnSale = product.salePrice !== product.price
  const formattedPrice = `$${product.price.toFixed(2)}`
  const formattedSalePrice = `$${product.salePrice.toFixed(2)}`

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="h-[400px] w-full bg-black border border-white/20 overflow-hidden group relative rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex flex-col h-full relative">
          <div className="relative w-full h-[300px] overflow-hidden">
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              <Image
                src={product.image1}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-300 filter group-hover:brightness-110"
              />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20"
            >
              <Image
                src={product.image2}
                alt={`${product.name} - alternate view`}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-300 filter group-hover:brightness-110"
              />
            </motion.div>
            {isOnSale && (
              <div className="absolute top-2 left-2 z-30 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                Sale
              </div>
            )}
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between bg-black">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-white/60 mb-1 font-medium"
              >
                {product.brand}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-lg font-semibold mb-2 text-white group-hover:text-white/80 transition-colors duration-300"
              >
                {product.name}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center mb-2"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-current" : "text-white/20"}`} />
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                {isOnSale ? (
                  <>
                    <span className="text-xl font-bold text-white">{formattedSalePrice}</span>
                    <span className="text-sm text-red-500 line-through">{formattedPrice}</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-white">{formattedPrice}</span>
                )}
              </div>
              <WishlistButton product={{
                id: product.id,
                name: product.name,
                price: isOnSale ? product.salePrice.toString() : product.price.toString(),
                image: product.image1
              }} />
            </motion.div>
          </div>
        </CardContent>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center"
            >
              <Button
                size="lg"
                className="bg-white z-[10000] text-black hover:bg-white/80 transition-all duration-300 rounded-full"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function ProductShowcase({ title, products, featuredImage, featuredTitle, featuredDescription }: ShowcaseProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true })
  const [scrollProgress, setScrollProgress] = useState(0)

  const onScroll = useCallback(() => {
    if (!emblaApi) return
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [emblaApi, setScrollProgress])

  useEffect(() => {
    if (!emblaApi) return
    onScroll()
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onScroll)
  }, [emblaApi, onScroll])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const { addToCart } = useCart()
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: (product.salePrice || product.price).toString(),
      image: product.image1,
      quantity: 1
    })
    openCart()
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">
          {title}
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden h-[500px] border-0 shadow-2xl relative rounded-lg">
            <Image
              src={featuredImage}
              alt="Featured product"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
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
                  <Sparkles className="inline-block mr-2 h-4 w-4" />
                  Featured Collection
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
                  <Button size="lg" className="bg-white text-black hover:bg-white/80 transition-all duration-300 rounded-full">
                    <Zap className="mr-2 h-5 w-5" />
                    Explore Now
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          size="lg"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full"
          onClick={scrollNext}
        >
          Next
          <ChevronRight className="h-6 w-6 ml-2" />
        </Button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-2"
            >
              <ProductCard product={product} handleAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </div>
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
  )
}