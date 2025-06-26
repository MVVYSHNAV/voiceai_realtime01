import { products } from '../data/products.json';
import type { ToolDefinition } from './types';

export const showProductCardDefinition: ToolDefinition = {
  type: 'function',
  name: 'showProductCard',
  description: 'Display a product as a card in the AI conversation by ID or name.',
  parameters: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description: 'Product ID (number) or product name.'
      }
    },
    required: ['identifier']
  }
};

export const showProductCardHandler = {
  execute: async ({ identifier }: { identifier: string }) => {
    try {
      let product = null;

      const numericId = parseInt(identifier);
      if (!isNaN(numericId)) {
        product = products.find(p => p.id === numericId);
      }

      if (!product) {
        product = products.find(p =>
          p.name.toLowerCase().includes(identifier.toLowerCase()) ||
          identifier.toLowerCase().includes(p.name.toLowerCase())
        );
      }

      if (!product) {
        return {
          success: false,
          message: `No product found for "${identifier}".`,
          suggestions: products.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
        };
      }

      // Construct product card response
      return {
        success: true,
        productCard: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          inStock: product.inStock,
          shortDescription: product.description,
          features: product.features
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Error showing product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};
