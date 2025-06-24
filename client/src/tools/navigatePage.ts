import { ToolDefinition, ToolHandler } from './types';
import { navigateTo } from '../utils/navigation';

interface NavigatePageArgs {
  page: string;
  params?: Record<string, string | number>;
}

// Tool definition for OpenAI
export const navigatePageDefinition: ToolDefinition = {
  type: 'function',
  name: 'navigate_page',
  description: 'Navigate to a specific page in the application. Available pages: home (empty string), products, util',
  parameters: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        description: 'The page to navigate to. Use empty string "" for home, "products" for products page, "util" for utilities page',
        enum: ['', 'products', 'util']
      },
      params: {
        type: 'object',
        description: 'Optional query parameters to include in the navigation (e.g., for filtering products)',
        properties: {
          search: { type: 'string', description: 'Search term for products' },
          category: { type: 'string', description: 'Product category filter' },
          brand: { type: 'string', description: 'Product brand filter' },
          minPrice: { type: 'number', description: 'Minimum price filter' },
          maxPrice: { type: 'number', description: 'Maximum price filter' },
          sort: { type: 'string', description: 'Sort option: featured, price-low, price-high, rating, newest' },
          page: { type: 'number', description: 'Page number for pagination' }
        }
      }
    },
    required: ['page']
  }
};

// Tool handler implementation
export const navigatePageHandler: ToolHandler = {
  execute(args: NavigatePageArgs): any {
    console.log('🧭 Executing navigate_page with args:', args);
    
    try {
      // Navigate to the specified page with optional parameters
      navigateTo(args.page, args.params);
      
      // Determine the page name for user feedback
      let pageName = 'Home';
      if (args.page === 'products') pageName = 'Products';
      else if (args.page === 'util') pageName = 'Utilities';
      
      let message = `Successfully navigated to ${pageName} page`;
      
      // Add parameter information if provided
      if (args.params && Object.keys(args.params).length > 0) {
        const paramsList = Object.entries(args.params)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        message += ` with parameters: ${paramsList}`;
      }
      
      return {
        result: 'Navigation successful',
        message: message,
        navigatedTo: args.page || 'home',
        parameters: args.params || {}
      };
    } catch (error) {
      console.error('Navigation error:', error);
      return {
        result: 'Navigation failed',
        error: `Failed to navigate: ${error}`,
        requestedPage: args.page
      };
    }
  }
}; 