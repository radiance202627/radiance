'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, QuoteItem } from '@/lib/types';

interface ToastState {
  show: boolean;
  message: string;
  productName?: string;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (product: Product, selectedFinish?: string, selectedSize?: string, selectedMaterial?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearQuote: () => void;
  totalItemsCount: number;
  toast: ToastState;
  hideToast: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'b2b_hardware_quote_list_v1';

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });

  // Load quote list from LocalStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load quote items from storage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to LocalStorage whenever quote items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist quote items to storage:', e);
    }
  }, [items, isInitialized]);

  const triggerToast = (message: string, productName?: string) => {
    setToast({ show: true, message, productName });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3500);
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  const addItem = (
    product: Product,
    selectedFinish?: string,
    selectedSize?: string,
    selectedMaterial?: string,
    quantity: number = 1
  ) => {
    const finish = selectedFinish || product.finishes[0] || 'Standard Finish';
    const size = selectedSize || product.sizes[0] || 'Standard Size';
    const material = selectedMaterial || product.material || 'Standard';

    const itemId = `${product.id}-${finish}-${size}-${material}`.replace(/\s+/g, '-').toLowerCase();

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: QuoteItem = {
          id: itemId,
          product,
          selectedFinish: finish,
          selectedSize: size,
          selectedMaterial: material,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });

    triggerToast('Added to your quote', product.name);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearQuote = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        totalItemsCount,
        toast,
        hideToast,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
