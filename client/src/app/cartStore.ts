import type { CartItem } from '../types/product';

class CartStore {
  private cart: CartItem[] = [];
  private listeners: Set<() => void> = new Set();

  getCart(): Readonly<CartItem[]> {
    return [...this.cart];
  }

  addToCart(item: CartItem): void {
    const index = this.cart.findIndex(p => p.id === item.id);
    if (index >= 0) {
      this.cart[index].quantity += item.quantity;
    } else {
      this.cart.push({ ...item });
    }
    this.notify();
  }

  removeFromCart(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
    this.notify();
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) return this.removeFromCart(id);
    const index = this.cart.findIndex(item => item.id === id);
    if (index >= 0) {
      this.cart[index].quantity = quantity;
      this.notify();
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  clearCart(): void {
    this.cart = [];
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }
}

const instance = new CartStore();

export const getCart = () => instance.getCart();
export const addToCart = (item: CartItem) => instance.addToCart(item);
export const removeFromCart = (id: number) => instance.removeFromCart(id);
export const updateQuantity = (id: number, quantity: number) => instance.updateQuantity(id, quantity);
export const getCartTotal = () => instance.getCartTotal();
export const clearCart = () => instance.clearCart();
export const subscribe = (fn: () => void) => instance.subscribe(fn);
