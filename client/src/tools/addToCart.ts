import type { ToolDefinition, ToolHandler } from './types';
import { products } from '../data/products.json';
import { navigateTo } from '../utils/navigation';
import type { CartItem } from '../types/product';

let addToCartCallback: ((item: CartItem) => void) | null = null;
let removeFromCartCallback: ((id: number) => void) | null = null;
let updateQuantityCallback: ((id: number, quantity: number) => void) | null = null;

export const registerAddToCartFunction = (
  add: (item: CartItem) => void,
  remove?: (id: number) => void,
  updateQty?: (id: number, quantity: number) => void
) => {
  addToCartCallback = add;
  if (remove) removeFromCartCallback = remove;
  if (updateQty) updateQuantityCallback = updateQty;
};

// ✅ Use clear and correct tool name unless `asaddcart` is intentional
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

export const addToCartHandler: ToolHandler = {
  execute: async ({ searchQuery, quantity = 1, action = 'add', redirect = true }) => {
    const query = searchQuery.toLowerCase().trim();
    let matchedProduct = null;

    // Match by ID
    const id = parseInt(query);
    if (!isNaN(id)) {
      matchedProduct = products.find(p => p.id === id);
    }

    // Exact match by name
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
        message: `🔍 No product found matching "${searchQuery}".`,
        suggestions: products.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category
        }))
      };
    }

    const { id: productId, name, price, brand } = matchedProduct;

    // 🔁 Handle remove
    if (action === 'remove') {
      if (!removeFromCartCallback) {
        return { success: false, message: `❌ Remove callback not registered.` };
      }
      removeFromCartCallback(productId);
      return { success: true, message: `🗑️ Removed "${name}" from your cart.` };
    }

    // 🔁 Handle quantity updates
    if (action === 'increase' || action === 'decrease') {
      if (!updateQuantityCallback) {
        return { success: false, message: `❌ Quantity update callback not registered.` };
      }
      const delta = action === 'increase' ? quantity : -quantity;
      updateQuantityCallback(productId, delta);
      return {
        success: true,
        message: `🔄 ${action === 'increase' ? 'Increased' : 'Decreased'} quantity of "${name}" by ${Math.abs(delta)}.`
      };
    }

    // ✅ Handle add to cart
    if (!addToCartCallback) {
      return { success: false, message: `❌ Add-to-cart callback not registered.` };
    }

    const cartItem: CartItem = {
      ...matchedProduct,
      quantity
    };

    addToCartCallback(cartItem);

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
