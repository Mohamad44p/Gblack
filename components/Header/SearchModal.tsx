'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/lib/hooks/use-debounce"

// Simulated product data (replace with actual data or API call)
const products = [
  { id: 1, name: "T-Shirt", category: "Clothing" },
  { id: 2, name: "Jeans", category: "Clothing" },
  { id: 3, name: "Sneakers", category: "Footwear" },
  { id: 4, name: "Watch", category: "Accessories" },
  { id: 5, name: "Backpack", category: "Bags" },
]

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
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
    if (debouncedSearch) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filteredResults = products.filter(product =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        setResults(filteredResults)
        setIsLoading(false)
      }, 500)
    } else {
      setResults([])
    }
  }, [debouncedSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your search submission logic here
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
                ) : results.length > 0 ? (
                  <ul className="space-y-2">
                    {results.map((product) => (
                      <motion.li
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <a href={`/product/${product.id}`} className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md mr-3"></div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
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