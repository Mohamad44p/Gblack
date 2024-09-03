'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles, Zap } from 'lucide-react'

interface Product {
  name: string
  brand: string
  price: string
  originalPrice?: string
  discount?: string
  rating: number
  image1: string
  image2: string
}

interface CarouselProps {
  title: string
  products: Product[]
  featuredImage: string
  featuredTitle: string
  featuredDescription: string
}

const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="h-full bg-gray-900 border-0 shadow-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 flex flex-col h-full relative">
        {/* CHANGE: Increased height from h-64 to h-96 for larger images */}
        <div className="relative w-full h-96 overflow-hidden">
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
              className="transition-transform duration-300 group-hover:scale-110"
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
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </motion.div>
          {product.discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full z-30">
              {product.discount}
            </span>
          )}
        </div>
        {/* CHANGE: Adjusted padding and layout for better balance with larger images */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-2 font-medium">{product.brand}</div>
            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-300 transition-colors duration-300">{product.name}</h3>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {product.originalPrice}
                </span>
              )}
            </div>
            {/* CHANGE: Increased button size for better proportion */}
            <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductCarousel({ title, products, featuredImage, featuredTitle, featuredDescription }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="container mx-auto px-4 py-12 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          {title}
        </h2>
        <Button variant="link" className="text-white text-lg hover:text-gray-300 transition-colors duration-300">
          Explore Collection &gt;
        </Button>
      </motion.div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_40%] mr-6"
            >
              <Card className="overflow-hidden h-[600px] border-0 shadow-2xl relative">
                <Image
                  src={featuredImage}
                  alt="Featured product"
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-white/20 z-10"></div>
                <CardContent className="p-10 relative h-full z-20 flex flex-col justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white text-sm font-semibold py-1 px-4 rounded-full"
                    >
                      <Sparkles className="inline-block mr-2 h-4 w-4" />
                      Featured
                    </motion.div>
                    <h3 className="text-6xl font-bold mb-4 text-white">{featuredTitle}</h3>
                    <p className="text-xl text-gray-200 mb-6">{featuredDescription}</p>
                  </div>
                  <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 w-fit">
                    <Zap className="mr-2 h-5 w-5" />
                    Explore Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_30%] mr-6"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {prevBtnEnabled && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white border-0 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {nextBtnEnabled && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white border-0 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                onClick={scrollNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}