import { products } from '../data/products.json';
import { navigateTo } from '../utils/navigation';
import type { ToolDefinition } from './types';

export const getSpecificationDefinition: ToolDefinition = {
  type: 'function',
  name: 'getSpecification',
  description: 'Navigate to a product and get its technical specifications by ID or name.',
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

export const getSpecificationHandler = {
  execute: async ({ identifier }: { identifier: string }) => {
    try {
      let product = null;

      // Match by ID
      const numericId = parseInt(identifier);
      if (!isNaN(numericId)) {
        product = products.find(p => p.id === numericId);
      }

      // Match by name
      if (!product) {
        product = products.find(p =>
          p.name.toLowerCase().includes(identifier.toLowerCase()) ||
          identifier.toLowerCase().includes(p.name.toLowerCase())
        );
      }

      if (!product) {
        return {
          success: false,
          message: `No product found for identifier "${identifier}".`,
          suggestions: products.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
        };
      }

      // Navigate to product detail page
      navigateTo(`product?id=${product.id}`);

      // Compose a specs object for UI
      const defaultSpecs = {
        Brand: product.brand,
        Category: product.category,
        Model: product.name,
        Price: `$${product.price}`,
        Availability: product.inStock ? 'In Stock' : 'Out of Stock'
      };

      const specifications = {
        ...defaultSpecs,
        ...(product as any).specifications || {}
      };

      return {
        success: true,
        message: `Navigated to product: ${product.name}`,
        productId: product.id,
        productName: product.name,
        specifications
      };
    } catch (error) {
      return {
        success: false,
        message: `Error getting specification: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};
