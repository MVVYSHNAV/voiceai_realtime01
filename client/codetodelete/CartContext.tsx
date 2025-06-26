// context/CartContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  type ReactNode
} from 'react';
import { registerAddToCartFunction } from '../tools/addToCart';
import type { CartItem } from '../types/product';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const syncLocalStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      const updated = existing
        ? prev.map(p =>
            p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
          )
        : [...prev, item];

      syncLocalStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prev => {
      const updated = prev.filter(p => p.id !== id);
      syncLocalStorage(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setCartItems(prev => {
        const updated = prev.map(p =>
          p.id === id ? { ...p, quantity } : p
        );
        syncLocalStorage(updated);
        return updated;
      });
    },
    [removeFromCart]
  );

  const getCartTotal = useCallback(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // ✅ Register full set of functions for tooling
  useEffect(() => {
    registerAddToCartFunction(addToCart, removeFromCart, updateQuantity);
  }, [addToCart, removeFromCart, updateQuantity]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
