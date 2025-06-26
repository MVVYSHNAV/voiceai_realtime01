// 📁 tools/getCartContents.ts
import type { ToolDefinition, ToolHandler } from './types';
import type { CartItem } from '../types/product';

let getCartCallback: (() => { items: CartItem[]; total: number }) | null = null;

export const registerGetCartFunction = (
  fn: () => { items: CartItem[]; total: number }
) => {
  getCartCallback = fn;
};

export const getCartContentsDefinition: ToolDefinition = {
  type: 'function',
  name: 'getCartContents',
  description: "Returns all items currently in the user's cart, along with the total amount.",
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

export const getCartContentsHandler: ToolHandler = {
  execute: async () => {
    if (!getCartCallback) {
      return {
        success: false,
        cart: [],
        total: 0,
        message: '❌ Cart context not connected.'
      };
    }

    const { items, total } = getCartCallback();

    return {
      success: true,
      cart: items,
      total,
      message: items.length
        ? `🛒 You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart. Total: ₹${total.toLocaleString()}`
        : `🛒 Your cart is empty.`
    };
  }
};
