import type { ToolDefinition } from './types';
import { getContextHandler } from './getContext';

export const testContextDefinition: ToolDefinition = {
  type: 'function',
  name: 'testContext',
  description: 'Test the getContext tool and display current application state',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

export const testContextHandler = {
  execute: async () => {
    try {
      // Get the current context
      const contextResult = await getContextHandler.execute();
      
      if (!contextResult.success) {
        return {
          success: false,
          message: 'Failed to get context',
          error: contextResult.message
        };
      }

      const { context, summary } = contextResult;

      // Create a formatted report
      const report: any = {
        summary,
        currentPage: context.pageContext.type,
        pageDescription: context.pageContext.description,
        cartStatus: {
          hasItems: !context.cart.isEmpty,
          itemCount: context.cart.itemCount,
          totalValue: `$${context.cart.totalPrice.toFixed(2)}`
        },
        suggestions: context.suggestions,
        availableActions: context.pageContext.availableActions || []
      };

      // Add page-specific details
      if (context.pageContext.type === 'products') {
        report.productsPage = {
          totalProducts: context.pageContext.products.total,
          filteredProducts: context.pageContext.products.filtered,
          activeFilters: context.pageContext.currentFilters,
          activeFiltersCount: context.pageContext.activeFiltersCount
        };
      } else if (context.pageContext.type === 'product-detail') {
        report.productDetail = {
          productName: context.pageContext.currentProduct.name,
          brand: context.pageContext.currentProduct.brand,
          price: `$${context.pageContext.currentProduct.price}`,
          inStock: context.pageContext.currentProduct.inStock,
          isInCart: context.pageContext.isInCart
        };
      }

      return {
        success: true,
        message: 'Context retrieved successfully',
        report,
        fullContext: context // Include full context for debugging
      };

    } catch (error) {
      return {
        success: false,
        message: `Error testing context: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}; 