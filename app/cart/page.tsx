'use client'

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, getCartCount } = useCart()

  const handleQuantityChange = useCallback((id: number, change: number) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      updateCartItemQuantity(id, item.quantity + change)
    }
  }, [cart, updateCartItemQuantity])

  const memoizedCart = useMemo(() => cart.map(item => ({
    ...item,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
  })), [cart])

  const cartTotal = useMemo(() => getCartTotal(), [getCartTotal])
  const cartCount = useMemo(() => getCartCount(), [getCartCount])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <header className="mb-6 md:mb-12">
          <Link href="/all" className="inline-flex items-center text-white hover:text-primary transition-colors">
            <ArrowLeft className="mr-2" size={16} />
            <span className="text-base md:text-lg font-medium">Continue Shopping</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 md:mt-6 flex items-center">
            <ShoppingCart className="mr-2 md:mr-4" size={32} /> Your Cart
          </h1>
        </header>

        {memoizedCart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 md:py-24"
          >
            <ShoppingBag size={80} className="mx-auto mb-6 md:mb-8 text-primary" />
            <p className="text-2xl md:text-3xl mb-6 md:mb-8 text-white">Your cart is empty</p>
            <Link href="/all">
              <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
                Explore Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] pr-4">
                <AnimatePresence>
                  {memoizedCart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItem
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={removeFromCart}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-2xl"
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Order Summary</h2>
                <div className="space-y-4 mb-6 md:mb-8">
                  <div className="flex justify-between text-base md:text-lg">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>{cartTotal.toFixed(2)} NIS</span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg">
                    <span>Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-4 mt-4">
                    <div className="flex justify-between text-xl md:text-2xl font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{cartTotal.toFixed(2)} NIS</span>
                    </div>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button variant={"default"} className="w-full mb-4 text-sm md:text-base py-4 md:py-6" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CartItem({ item, onQuantityChange, onRemove }:{
    item: { id: number, name: string, image: string, price: number, size?: string, quantity: number },
    onQuantityChange: (id: number, change: number) => void,
    onRemove: (id: number) => void
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 mb-4 md:mb-6 bg-zinc-900 rounded-xl transition-all hover:shadow-lg">
      <Image
        src={item.image}
        alt={item.name}
        width={1900}
        height={2000}
        loading="lazy"
        className="w-full md:w-28 h-40 md:h-28 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg md:text-xl truncate mb-2">{item.name}</h3>
        <p className="text-base md:text-lg text-primary mb-1">
          {item.price.toFixed(2)} NIS
        </p>
        {item.size && (
          <p className="text-sm text-zinc-400 mb-2 md:mb-3">Size: {item.size}</p>
        )}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            onClick={() => onQuantityChange(item.id, -1)}
          >
            <Minus size={16} />
          </Button>
          <span className="mx-4 font-medium text-base md:text-lg">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto space-y-0 md:space-y-4">
        <span className="font-semibold text-lg md:text-xl text-primary">
          {(item.price * item.quantity).toFixed(2)} NIS
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 size={24} />
        </Button>
      </div>
    </div>
  )
}