/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { OPEN_CART_EVENT } from '@/lib/hooks/events'

export default function CartSheet() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, getCartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleQuantityChange = (id: number, change: number) => {
    const item = cart.find(item => item.id === id)
    if (item) {
      updateCartItemQuantity(id, item.quantity + change)
    }
  }

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true)
    window.addEventListener(OPEN_CART_EVENT, handleOpenCart)
    return () => window.removeEventListener(OPEN_CART_EVENT, handleOpenCart)
  }, [])

  const handleClose = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    scrollPositionRef.current = window.scrollY
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current)
      }, 0)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          scrollPositionRef.current = window.scrollY
          setTimeout(() => setIsOpen(false), 0)
        } else {
          setIsOpen(true)
        }
      }}
    >
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-primary text-primary-foreground focus:outline-none"
        >
          <ShoppingBag size={24} />
          {mounted && (
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </motion.button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-background text-foreground flex flex-col h-full">
        <SheetHeader className="space-y-2 mb-4">
          <SheetTitle className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-2" /> Your Cart
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-lg">
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={64} className="text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add some items to get started!</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 bg-secondary/10 p-4 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">${parseFloat(item.price).toFixed(2)}</p>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="mx-3 font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
        <div className="mt-6 space-y-4 border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-2xl">${getCartTotal().toFixed(2)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full text-lg py-6" disabled={cart.length === 0}>
              Proceed to Checkout
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Continue Shopping
            </Button>
            {cart.length > 0 && (
              <Button variant="destructive" className="flex-1" onClick={clearCart}>
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}