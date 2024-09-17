'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/lib/hooks/use-debounce"
import Image from "next/image"

interface Product {
  id: number
  name: string
  categories: { id: number; name: string }[]
  images: { id: number; src: string }[]
}

interface Category {
  id: number
  name: string
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      if (debouncedSearch) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search-products?per_page=10&search=${encodeURIComponent(debouncedSearch)}`)
          const data = await response.json()
          if (data.success) {
            setProducts(data.products)
          }
        } catch (error) {
          console.error('Error fetching products:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setProducts([])
      }
    }

    fetchProducts()
  }, [debouncedSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search submitted:", searchQuery)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="focus:outline-none text-white"
        onClick={() => setIsOpen(true)}
      >
        <Search size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Search Products</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </Button>
                </div>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Search size={18} />
                  </Button>
                </form>
              </div>
              <div className="px-4 pb-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : products.length > 0 ? (
                  <ul className="space-y-2">
                    {products.map((product) => (
                      <motion.li
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <a href={`/product/${product.id}`} className="flex items-center">
                          <div className="w-16 h-16 mr-3 relative overflow-hidden rounded-md">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0].src}
                                alt={product.name}
                                width={64}
                                height={64}
                                objectFit="cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.categories.map(cat => cat.name).join(', ')}
                            </p>
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                ) : searchQuery && (
                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">No results found</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}