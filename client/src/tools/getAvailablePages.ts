import { ToolDefinition, ToolHandler } from './types';
import { getCurrentPath } from '../utils/navigation';

// Tool definition for OpenAI
export const getAvailablePagesDefinition: ToolDefinition = {
  type: 'function',
  name: 'get_available_pages',
  description: 'Get a list of all available pages in the application and the current page',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

// Tool handler implementation
export const getAvailablePagesHandler: ToolHandler = {
  execute(): any {
    console.log('📄 Executing get_available_pages');
    
    try {
      const currentPath = getCurrentPath();
      
      const availablePages = [
        {
          path: '',
          name: 'Home',
          description: 'Main homepage with hero section, features, and voice agent interface',
          route: '/'
        },
        {
          path: 'products',
          name: 'Products',
          description: 'E-commerce products page with search, filters, and shopping cart functionality',
          route: '/products',
          features: [
            'Search products by name or description',
            'Filter by category, brand, and price range',
            'Sort by price, rating, or newest',
            'Add products to cart',
            'Pagination support'
          ],
          availableCategories: [
            'Audio', 'Wearables', 'Photography', 'Furniture', 
            'Lighting', 'Computers', 'Phones', 'Electronics', 
            'Gaming', 'Accessories'
          ],
          availableBrands: [
            'Sony', 'Apple', 'Canon', 'Herman Miller', 'Dyson', 
            'JBL', 'Samsung', 'Bose', 'Nintendo', 'Tesla'
          ],
          sortOptions: [
            'featured', 'price-low', 'price-high', 'rating', 'newest'
          ]
        },
        {
          path: 'util',
          name: 'Utilities',
          description: 'Developer utilities page for testing navigation and URL parameters',
          route: '/util',
          features: [
            'Test navigation functions',
            'Generate product filter URLs',
            'Copy URLs to clipboard',
            'Navigation presets'
          ]
        }
      ];
      
      return {
        result: 'Available pages retrieved successfully',
        currentPage: {
          path: currentPath,
          name: availablePages.find(page => page.path === currentPath)?.name || 'Unknown'
        },
        availablePages: availablePages,
        totalPages: availablePages.length,
        message: `Currently on ${availablePages.find(page => page.path === currentPath)?.name || 'Unknown'} page. ${availablePages.length} pages available.`
      };
    } catch (error) {
      console.error('Error getting available pages:', error);
      return {
        result: 'Failed to get available pages',
        error: `Error: ${error}`,
        availablePages: []
      };
    }
  }
}; 