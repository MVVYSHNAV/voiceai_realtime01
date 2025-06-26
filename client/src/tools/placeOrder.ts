// tools/placeOrder.ts
import { ToolDefinition, ToolHandler } from './types';
import { getCart } from '../app/cartStore';

export const placeOrderDefinition: ToolDefinition = {
  type: 'function',
  name: 'placeOrder',
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
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
      return {
        success: false,
        message: '❌ Cart is empty. Cannot place order.'
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
