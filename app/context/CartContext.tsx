"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the CartItem type and CartContextType interface directly here
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: Record<string, CartItem>;
  addItem: (item: CartItem) => void;
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart, [item.id]: item };
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
