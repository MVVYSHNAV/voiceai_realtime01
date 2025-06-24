import { ToolDefinition, ToolHandler } from './types';
import { navigateTo } from '../utils/navigation';

interface SearchProductsArgs {
  search_term: string;
  category?: string;
  brand?: string;
  sort?: string;
}

// Tool definition for OpenAI
export const searchProductsDefinition: ToolDefinition = {
  type: 'function',
  name: 'search_products',
  description: 'Search for products by keyword and optionally filter by category, brand, or sort option. Navigates to products page with search results.',
  parameters: {
    type: 'object',
    properties: {
      search_term: {
        type: 'string',
        description: 'The search keyword or phrase to look for in product names and descriptions'
      },
      category: {
        type: 'string',
        description: 'Optional category filter',
        enum: ['Audio', 'Wearables', 'Photography', 'Furniture', 'Lighting', 'Computers', 'Phones', 'Electronics', 'Gaming', 'Accessories']
      },
      brand: {
        type: 'string',
        description: 'Optional brand filter',
        enum: ['Sony', 'Apple', 'Canon', 'Herman Miller', 'Dyson', 'JBL', 'Samsung', 'Bose', 'Nintendo', 'Tesla']
      },
      sort: {
        type: 'string',
        description: 'Optional sort order for results',
        enum: ['featured', 'price-low', 'price-high', 'rating', 'newest']
      }
    },
    required: ['search_term']
  }
};

// Tool handler implementation
export const searchProductsHandler: ToolHandler = {
  execute(args: SearchProductsArgs): any {
    console.log('🔍 Executing search_products with args:', args);
    
    try {
      // Build navigation parameters
      const params: Record<string, string> = {
        search: args.search_term
      };
      
      // Add optional filters
      if (args.category) params.category = args.category;
      if (args.brand) params.brand = args.brand;
      if (args.sort) params.sort = args.sort;
      
      // Navigate to products page with search parameters
      navigateTo('products', params);
      
      // Build result message
      let message = `Searching for "${args.search_term}"`;
      const filters = [];
      
      if (args.category) filters.push(`category: ${args.category}`);
      if (args.brand) filters.push(`brand: ${args.brand}`);
      if (args.sort) filters.push(`sorted by: ${args.sort}`);
      
      if (filters.length > 0) {
        message += ` with filters: ${filters.join(', ')}`;
      }
      
      message += '. Navigated to products page with search results.';
      
      return {
        result: 'Product search initiated successfully',
        message: message,
        searchTerm: args.search_term,
        appliedFilters: {
          category: args.category || null,
          brand: args.brand || null,
          sort: args.sort || 'featured'
        },
        navigatedTo: 'products',
        searchUrl: `/products?${new URLSearchParams(params).toString()}`
      };
    } catch (error) {
      console.error('Product search error:', error);
      return {
        result: 'Product search failed',
        error: `Failed to search products: ${error}`,
        searchTerm: args.search_term
      };
    }
  }
}; 