import type { ToolDefinition, ToolHandler } from './types';
import { navigateTo } from '../utils/navigation';

interface NavigatePageArgs {
  page: string;
  params?: Record<string, string | number>;
}

const PAGE_ALIASES: Record<string, string> = {
  home: '',
  '': '',
  products: 'products',
  util: 'util',
  cart: 'Cart',
  billing: 'Billing',
  toolcheck: 'ToolCheck',
  recommended: 'Recommended',
  product: 'product',
};

export const navigatePageDefinition: ToolDefinition = {
  type: 'function',
  name: 'navigate_page',
  description: 'Navigate to a specific page in the application.',
  parameters: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        description: 'Target page (e.g., home, products, cart, billing, util, toolcheck)',
        enum: Object.keys(PAGE_ALIASES)
      },
      params: {
        type: 'object',
        description: 'Optional query parameters',
        properties: {
          search: { type: 'string' },
          category: { type: 'string' },
          brand: { type: 'string' },
          minPrice: { type: 'number' },
          maxPrice: { type: 'number' },
          sort: { type: 'string' },
          page: { type: 'number' }
        }
      }
    },
    required: ['page']
  }
};
export const navigatePageHandler: ToolHandler = {
  execute(args: NavigatePageArgs) {
    try {
      const rawPage = args.page.toLowerCase();
      const resolvedPath = PAGE_ALIASES[rawPage] ?? rawPage;

      navigateTo(resolvedPath, args.params);

      const message = `✅ Navigated to "${rawPage}"${args.params ? ` with filters: ${JSON.stringify(args.params)}` : ''}`;
      
      return {
        success: true,
        result: 'Navigation successful',
        message,
        path: resolvedPath,
        originalPage: rawPage,
        params: args.params || {}
      };
    } catch (error) {
      return {
        success: false,
        result: 'Navigation failed',
        message: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
        page: args.page
      };
    }
  }
};
