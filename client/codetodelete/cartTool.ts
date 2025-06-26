// 📁 tools/cartTools.ts
import type { ToolDefinition, ToolHandler } from './types';
import { products } from '../data/products.json';
import { navigateTo } from '../utils/navigation';
import type { CartItem } from '../types/product';

// First, define the CartOperation type that was missing
type CartOperation = {
  type: 'add' | 'remove' | 'update';
  payload: CartItem | { id: number; quantity?: number };
};

// Cart Content Type
type CartContent = {
  items: CartItem[];
  total: number;
};

// Cart Tool System Implementation
class CartToolSystem {
  private static instance: CartToolSystem;
  private callbacks = {
    add: null as ((item: CartItem) => void) | null,
    remove: null as ((id: number) => void) | null,
    update: null as ((id: number, qty: number) => void) | null
  };
  private operationQueue: CartOperation[] = [];
  private isProcessing = false;
  private getCartCallback: (() => CartContent) | null = null;

  static getInstance() {
    if (!CartToolSystem.instance) {
      CartToolSystem.instance = new CartToolSystem();
    }
    return CartToolSystem.instance;
  }

  registerCallbacks(
    add: (item: CartItem) => void,
    remove?: (id: number) => void,
    update?: (id: number, qty: number) => void
  ) {
    this.callbacks.add = add;
    if (remove) this.callbacks.remove = remove;
    if (update) this.callbacks.update = update;
    this.processQueue();
  }

  registerGetCartFunction(callback: () => CartContent) {
    this.getCartCallback = callback;
  }

  getCartContent(): CartContent {
    if (!this.getCartCallback) {
      throw new Error('Cart callback not registered');
    }
    return this.getCartCallback();
  }

  private processQueue() {
    if (this.isProcessing || !this.callbacks.add) return;

    this.isProcessing = true;
    while (this.operationQueue.length > 0) {
      const op = this.operationQueue.shift()!;
      this.executeOperation(op);
    }
    this.isProcessing = false;
  }

  private executeOperation(op: CartOperation) {
    try {
      switch (op.type) {
        case 'add':
          if (this.callbacks.add) {
            this.callbacks.add(op.payload as CartItem);
          }
          break;
        case 'remove':
          if (this.callbacks.remove) {
            this.callbacks.remove((op.payload as { id: number }).id);
          }
          break;
        case 'update':
          if (this.callbacks.update && 'quantity' in op.payload) {
            this.callbacks.update(
              (op.payload as { id: number }).id,
              (op.payload as { quantity: number }).quantity!
            );
          }
          break;
      }
    } catch (error) {
      console.error('Cart operation failed:', error);
    }
  }

  queueOperation(op: CartOperation) {
    if (this.callbacks.add) {
      this.executeOperation(op);
    } else {
      this.operationQueue.push(op);
    }
  }
}

// Export singleton instance
export const cartToolSystem = CartToolSystem.getInstance();

// Public API functions
export const registerAddToCartFunction = (
  add: (item: CartItem) => void,
  remove?: (id: number) => void,
  update?: (id: number, qty: number) => void
) => {
  cartToolSystem.registerCallbacks(add, remove, update);
};

export const registerGetCartFunction = (callback: () => CartContent) => {
  cartToolSystem.registerGetCartFunction(callback);
};

export const getCartContent = (): CartContent => {
  return cartToolSystem.getCartContent();
};

// Tool Definitions
export const addToCartDefinition: ToolDefinition = {
  type: 'function',
  name: 'add_to_cart',
  description: 'Add, update, or remove a product from the cart using name, ID, brand, or category.',
  parameters: {
    type: 'object',
    properties: {
      searchQuery: {
        type: 'string',
        description: 'Product name, ID, brand, or category'
      },
      quantity: {
        type: 'number',
        description: 'Quantity to set or change by (default: 1)',
        default: 1
      },
      action: {
        type: 'string',
        description: 'Action: "add", "remove", "increase", "decrease"',
        enum: ['add', 'remove', 'increase', 'decrease'],
        default: 'add'
      },
      redirect: {
        type: 'boolean',
        description: 'Redirect to cart page after action',
        default: true
      }
    },
    required: ['searchQuery']
  }
};

// Tool Handler
export const addToCartHandler: ToolHandler = {
  execute: async ({ searchQuery, quantity = 1, action = 'add', redirect = true }) => {
    const query = searchQuery.toLowerCase().trim();
    let matchedProduct = null;

    // Match by ID if numeric
    const id = parseInt(query);
    if (!isNaN(id)) {
      matchedProduct = products.find(p => p.id === id);
    }

    // Exact name match
    if (!matchedProduct) {
      matchedProduct = products.find(p => p.name.toLowerCase() === query);
    }

    // Fuzzy match
    if (!matchedProduct) {
      matchedProduct = products.find(p =>
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query)
      );
    }

    if (!matchedProduct) {
      return {
        success: false,
        message: `🔍 Couldn't find any product matching "${searchQuery}".`,
        suggestions: products.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category
        }))
      };
    }

    const { id: productId, name, price, brand } = matchedProduct;

    // Execute action
    if (action === 'remove') {
      cartToolSystem.queueOperation({
        type: 'remove',
        payload: { id: productId }
      });
      return { success: true, message: `🗑️ Removed "${name}" from your cart.` };
    }

    if (action === 'increase' || action === 'decrease') {
      const change = action === 'increase' ? quantity : -quantity;
      cartToolSystem.queueOperation({
        type: 'update',
        payload: { id: productId, quantity: change }
      });
      return {
        success: true,
        message: `🔄 ${action === 'increase' ? 'Increased' : 'Decreased'} quantity of "${name}" by ${Math.abs(change)}.`
      };
    }

    // Default add operation
    const cartItem: CartItem = {
      ...matchedProduct,
      quantity
    };

    cartToolSystem.queueOperation({
      type: 'add',
      payload: cartItem
    });

    if (redirect) {
      navigateTo('Cart');
    }

    return {
      success: true,
      message: `✅ Added "${name}" (x${quantity}) to your cart.`,
      product: {
        id: productId,
        name,
        brand,
        price,
        quantity
      }
    };
  }
};