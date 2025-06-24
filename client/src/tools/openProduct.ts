import { navigateTo } from '../utils/navigation';
import { products } from '../data/products.json';
import type { ToolDefinition } from './types';

export const openProductDefinition: ToolDefinition = {
  type: 'function',
  name: 'openProduct',
  description: `Open/view a specific product detail page. This tool can find products by:
- Product ID (exact match)
- Product name (partial or full match)
- Brand name (e.g., "Apple", "Sony", "Canon")
- Category (e.g., "Audio", "Photography", "Computers")
- Combined search (e.g., "Apple Watch", "Sony headphones", "Canon lens")

USAGE EXAMPLES:
- openProduct("1") - Opens product with ID 1
- openProduct("iPhone 15 Pro Max") - Finds by exact name
- openProduct("iPhone") - Finds first iPhone product
- openProduct("Apple Watch") - Finds Apple Watch products
- openProduct("Sony headphones") - Finds Sony audio products
- openProduct("Canon lens") - Finds Canon photography products

The tool will attempt to find the best match and navigate to the product detail page.`,
  parameters: {
    type: 'object',
    properties: {
      searchQuery: {
        type: 'string',
        description: 'Search query: product ID, name, brand, category, or combination (e.g., "iPhone 15", "Apple Watch", "Sony headphones", "Canon lens", "Herman Miller chair")'
      }
    },
    required: ['searchQuery']
  }
};

export const openProductHandler = {
  execute: async ({ searchQuery }: { searchQuery: string }) => {
    try {
      const query = searchQuery.toLowerCase().trim();
      let matchedProducts: typeof products = [];

      // 1. Try exact ID match first
      const numericId = parseInt(query);
      if (!isNaN(numericId)) {
        const exactProduct = products.find(p => p.id === numericId);
        if (exactProduct) {
          navigateTo(`product?id=${exactProduct.id}`);
          return {
            success: true,
            message: `Opened product: ${exactProduct.name}`,
            product: {
              id: exactProduct.id,
              name: exactProduct.name,
              brand: exactProduct.brand,
              category: exactProduct.category,
              price: exactProduct.price,
              inStock: exactProduct.inStock
            },
            matchType: 'exact_id'
          };
        }
      }

      // 2. Try exact name match
      const exactNameMatch = products.find(p => 
        p.name.toLowerCase() === query
      );
      if (exactNameMatch) {
        matchedProducts = [exactNameMatch];
      }

      // 3. If no exact match, try partial name match
      if (matchedProducts.length === 0) {
        matchedProducts = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          query.includes(p.name.toLowerCase())
        );
      }

      // 4. If still no match, try brand + category combination
      if (matchedProducts.length === 0) {
        const words = query.split(' ');
        matchedProducts = products.filter(p => {
          const productText = `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
          return words.every(word => productText.includes(word));
        });
      }

      // 5. If still no match, try brand match
      if (matchedProducts.length === 0) {
        matchedProducts = products.filter(p =>
          p.brand.toLowerCase().includes(query) ||
          query.includes(p.brand.toLowerCase())
        );
      }

      // 6. If still no match, try category match
      if (matchedProducts.length === 0) {
        matchedProducts = products.filter(p =>
          p.category.toLowerCase().includes(query) ||
          query.includes(p.category.toLowerCase())
        );
      }

      // 7. Last resort: search in description and features
      if (matchedProducts.length === 0) {
        matchedProducts = products.filter(p => {
          const searchText = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.features?.join(' ') || ''}`.toLowerCase();
          return searchText.includes(query);
        });
      }

      if (matchedProducts.length === 0) {
        // Provide helpful suggestions
        const suggestions = products
          .slice(0, 8)
          .map(p => `"${p.name}" (ID: ${p.id}, Brand: ${p.brand}, Category: ${p.category})`);

        return {
          success: false,
          message: `No products found for "${searchQuery}". Try being more specific or use different keywords.`,
          suggestions: suggestions,
          availableBrands: [...new Set(products.map(p => p.brand))].slice(0, 10),
          availableCategories: [...new Set(products.map(p => p.category))],
          searchTips: [
            'Use product ID for exact match (e.g., "1", "15")',
            'Use brand names (e.g., "Apple", "Sony", "Canon")',
            'Use category names (e.g., "Audio", "Photography", "Computers")',
            'Combine brand + product type (e.g., "Apple Watch", "Sony headphones")',
            'Use partial product names (e.g., "iPhone", "MacBook", "headphones")'
          ]
        };
      }

      // Take the first/best match
      const selectedProduct = matchedProducts[0];
      
      // Navigate to the product
      navigateTo(`product?id=${selectedProduct.id}`);

      const matchType = matchedProducts.length === 1 ? 'single_match' : 'best_match';
      const response: any = {
        success: true,
        message: `Opened product: ${selectedProduct.name}`,
        product: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          brand: selectedProduct.brand,
          category: selectedProduct.category,
          price: selectedProduct.price,
          originalPrice: selectedProduct.originalPrice,
          rating: selectedProduct.rating,
          inStock: selectedProduct.inStock,
          description: selectedProduct.description
        },
        matchType
      };

      // If multiple matches, show alternatives
      if (matchedProducts.length > 1) {
        response.message += `. Found ${matchedProducts.length} matches, showing the first one.`;
        response.alternatives = matchedProducts.slice(1, 4).map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price
        }));
        response.note = 'If this is not the product you wanted, you can specify the exact ID or be more specific in your search.';
      }

      return response;

    } catch (error) {
      return {
        success: false,
        message: `Error opening product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        searchQuery
      };
    }
  }
}; 