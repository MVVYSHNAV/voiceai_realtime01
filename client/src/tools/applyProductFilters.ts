import { ToolDefinition, ToolHandler } from './types';
import { navigateTo } from '../utils/navigation';

interface ApplyProductFiltersArgs {
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
}

// Tool definition for OpenAI
export const applyProductFiltersDefinition: ToolDefinition = {
  type: 'function',
  name: 'apply_product_filters',
  description: 'Apply comprehensive filters to the products page including search, category, brand, price range, sorting, and pagination. Navigates to products page with applied filters.',
  parameters: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'Search term to filter products by name or description'
      },
      category: {
        type: 'string',
        description: 'Filter products by category',
        enum: ['Audio', 'Wearables', 'Photography', 'Furniture', 'Lighting', 'Computers', 'Phones', 'Electronics', 'Gaming', 'Accessories']
      },
      brand: {
        type: 'string',
        description: 'Filter products by brand',
        enum: ['Sony', 'Apple', 'Canon', 'Herman Miller', 'Dyson', 'JBL', 'Samsung', 'Bose', 'Nintendo', 'Tesla']
      },
      min_price: {
        type: 'number',
        description: 'Minimum price filter (in USD)',
        minimum: 0
      },
      max_price: {
        type: 'number',
        description: 'Maximum price filter (in USD)',
        maximum: 2000
      },
      sort: {
        type: 'string',
        description: 'Sort order for products',
        enum: ['featured', 'price-low', 'price-high', 'rating', 'newest']
      },
      page: {
        type: 'number',
        description: 'Page number for pagination (starts from 1)',
        minimum: 1
      }
    },
    required: []
  }
};

// Tool handler implementation
export const applyProductFiltersHandler: ToolHandler = {
  execute(args: ApplyProductFiltersArgs): any {
    console.log('🎛️ Executing apply_product_filters with args:', args);
    
    try {
      // Build navigation parameters, only including provided values
      const params: Record<string, string | number> = {};
      
      if (args.search) params.search = args.search;
      if (args.category) params.category = args.category;
      if (args.brand) params.brand = args.brand;
      if (args.min_price !== undefined) params.minPrice = args.min_price;
      if (args.max_price !== undefined) params.maxPrice = args.max_price;
      if (args.sort) params.sort = args.sort;
      if (args.page && args.page > 1) params.page = args.page;
      
      // Navigate to products page with filters
      navigateTo('products', params);
      
      // Build detailed result message
      const appliedFilters = [];
      
      if (args.search) appliedFilters.push(`search: "${args.search}"`);
      if (args.category) appliedFilters.push(`category: ${args.category}`);
      if (args.brand) appliedFilters.push(`brand: ${args.brand}`);
      if (args.min_price !== undefined || args.max_price !== undefined) {
        const priceRange = `$${args.min_price || 0} - $${args.max_price || 2000}`;
        appliedFilters.push(`price range: ${priceRange}`);
      }
      if (args.sort) appliedFilters.push(`sort: ${args.sort}`);
      if (args.page && args.page > 1) appliedFilters.push(`page: ${args.page}`);
      
      let message = 'Applied product filters';
      if (appliedFilters.length > 0) {
        message += `: ${appliedFilters.join(', ')}`;
      } else {
        message = 'Navigated to products page with no specific filters (showing all products)';
      }
      message += '. Products page loaded with applied filters.';
      
      // Build URL for reference
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.set(key, value.toString());
      });
      const searchUrl = `/products${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      
      return {
        result: 'Product filters applied successfully',
        message: message,
        appliedFilters: {
          search: args.search || null,
          category: args.category || null,
          brand: args.brand || null,
          minPrice: args.min_price || null,
          maxPrice: args.max_price || null,
          sort: args.sort || 'featured',
          page: args.page || 1
        },
        filterCount: appliedFilters.length,
        navigatedTo: 'products',
        searchUrl: searchUrl
      };
    } catch (error) {
      console.error('Apply filters error:', error);
      return {
        result: 'Failed to apply product filters',
        error: `Failed to apply filters: ${error}`,
        requestedFilters: args
      };
    }
  }
}; 