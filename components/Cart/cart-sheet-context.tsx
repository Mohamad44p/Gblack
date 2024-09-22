'use client'

import React, { createContext, useContext, useState } from 'react'

interface CartSheetContextType {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartSheetContext = createContext<CartSheetContextType | undefined>(undefined)

export const CartSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartSheetContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </CartSheetContext.Provider>
  )
}

export const useCartSheet = () => {
  const context = useContext(CartSheetContext)
  if (context === undefined) {
    throw new Error('useCartSheet must be used within a CartSheetProvider')
  }
  return context
}