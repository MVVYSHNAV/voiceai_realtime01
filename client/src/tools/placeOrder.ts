// tools/placeOrder.ts
import { ToolDefinition, ToolHandler } from './types';
import type { CartItem } from '../types/product';

let getCartCallback: (() => { items: CartItem[]; total: number }) | null = null;

// Register function from CartContext
export const registerPlaceOrderCartFunction = (
  fn: () => { items: CartItem[]; total: number }
) => {
  getCartCallback = fn;
};

export const placeOrderDefinition: ToolDefinition = {
  type: 'function',
  name: 'place_order',
  description: 'Place an order using name, email, address, and items in the cart.',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' }
    },
    required: ['name', 'email', 'address']
  }
};

export const placeOrderHandler: ToolHandler = {
  execute: async ({ name, email, address }) => {
    if (!getCartCallback) {
      return {
        success: false,
        message: '❌ Cart context not available. Cannot place order.',
      };
    }

    const { items: cart, total } = getCartCallback();

    if (!Array.isArray(cart) || cart.length === 0) {
      return {
        success: false,
        message: '❌ Cart is empty. Cannot place order.',
      };
    }

    return {
      success: true,
      message: `✅ Order placed for ${name}. Total: ₹${total.toLocaleString()}`,
      order: {
        customer: { name, email, address },
        items: cart,
        total
      }
    };
  }
};
