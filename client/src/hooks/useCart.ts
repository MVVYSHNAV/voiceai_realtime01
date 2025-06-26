// 📁 hooks/useCart.ts
import { useCartContext } from '../context/CartContext';

export const useCart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCartContext();

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  };
};
