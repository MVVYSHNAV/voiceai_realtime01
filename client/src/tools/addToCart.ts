
import { ToolDefinition, ToolHandler } from './types';

interface AddToCartArgs {
  id: number;
  quantity: number;
}

export const addToCartDefinition: ToolDefinition = {
  type: 'function',
  name: 'add_to_cart',
  description: 'Add an item to the cart by ID and quantity.',
  parameters: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the menu item'
      },
      quantity: {
        type: 'number',
        description: 'Quantity of the item'
      }
    },
    required: ['id', 'quantity']
  }
};

export const addToCartHandler: ToolHandler = {
  async execute(args: AddToCartArgs) {
    try {
      const { id, quantity } = args;

      const menu = await import('../menu.json').then(mod => mod.default);
      const item = menu.find(i => i.id === id);

      if (!item) {
        return { result: 'error', message: `Item with ID ${id} not found.` };
      }

      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return { result: 'error', message: 'localStorage is not available.' };
      }

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((i: any) => i.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...item, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      if ((window as any).update_cart) {
        (window as any).update_cart();
      }

      return {
        result: 'success',
        message: `Added ${quantity} x ${item.name} to the cart.`
      };
    } catch (error) {
      console.error('❌ Error in addToCartHandler:', error);
      return { result: 'error', message: String(error) };
    }
  }
};
