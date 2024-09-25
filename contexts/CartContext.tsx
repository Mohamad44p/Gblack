"use client";

import { useCartSheet } from "@/components/Cart/cart-sheet-context";
import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { openCart } = useCartSheet();

  useEffect(() => {
    const loadCart = () => {
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
      setIsLoaded(true);
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.size === item.size
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
    openCart();
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
