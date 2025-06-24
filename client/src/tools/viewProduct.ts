import { navigateTo } from '../utils/navigation';
import { products } from '../data/products.json';
import type { ToolDefinition } from './types';

export const viewProductDefinition: ToolDefinition = {
  type: 'function',
  name: 'viewProduct',
  description: 'Navigate to a specific product detail page by product ID or name',
  parameters: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description: 'Product ID (number) or product name to view'
      }
    },
    required: ['identifier']
  }
};

export const viewProductHandler = {
  execute: async ({ identifier }: { identifier: string }) => {
    try {
      let productId: number | null = null;

      // Check if identifier is a number (product ID)
      const numericId = parseInt(identifier);
      if (!isNaN(numericId)) {
        const product = products.find(p => p.id === numericId);
        if (product) {
          productId = numericId;
        }
      }

      // If not found by ID, search by name
      if (productId === null) {
        const product = products.find(p => 
          p.name.toLowerCase().includes(identifier.toLowerCase()) ||
          identifier.toLowerCase().includes(p.name.toLowerCase())
        );
        if (product) {
          productId = product.id;
        }
      }

      if (productId === null) {
        return {
          success: false,
          message: `Product not found: "${identifier}". Please check the product name or ID.`,
          availableProducts: products.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
        };
      }

      // Navigate to product detail page
      navigateTo(`product?id=${productId}`);

      const product = products.find(p => p.id === productId);
      return {
        success: true,
        message: `Navigated to product: ${product?.name}`,
        productId,
        productName: product?.name,
        productPrice: product?.price
      };
    } catch (error) {
      return {
        success: false,
        message: `Error viewing product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}; 