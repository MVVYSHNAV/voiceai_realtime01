import { getQueryParam, getCurrentPath } from '../utils/navigation';
import { products } from '../data/products.json';
import type { ToolDefinition } from './types';

export const getContextDefinition: ToolDefinition = {
  type: 'function',
  name: 'get_context',
  description: 'Use to get complete current context including page, products, filters, cart, and application state when user asks a query to better answer them.',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

export const getContextHandler = {
  execute: async () => {
    try {
      const currentPath = getCurrentPath();
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Get cart items from localStorage
      let cartItems = [];
      let cartTotal = 0;
      let cartItemCount = 0;
      
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          cartItems = JSON.parse(savedCart);
          cartTotal = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
          cartItemCount = cartItems.reduce((count: number, item: any) => count + item.quantity, 0);
        }
      } catch (error) {
        console.error('Error reading cart from localStorage:', error);
      }

      // Base context
      const context: any = {
        timestamp: new Date().toISOString(),
        currentPage: currentPath,
        currentUrl,
        urlParameters: Object.fromEntries(urlParams.entries()),
        cart: {
          items: cartItems,
          totalPrice: cartTotal,
          itemCount: cartItemCount,
          isEmpty: cartItems.length === 0
        }
      };

      // Page-specific context
      switch (currentPath) {
        case '':
        case 'home':
          context.pageContext = {
            type: 'homepage',
            description: 'User is on the homepage/landing page',
            availableActions: ['Navigate to products', 'Use floating chat', 'Browse categories']
          };
          break;

        case 'products':
          // Get current filters and search
          const search = getQueryParam('search') || '';
          const category = getQueryParam('category') || '';
          const brand = getQueryParam('brand') || '';
          const minPrice = getQueryParam('minPrice') || '';
          const maxPrice = getQueryParam('maxPrice') || '';
          const sort = getQueryParam('sort') || 'featured';
          const inStock = getQueryParam('inStock') === 'true';

          // Filter products based on current parameters
          let filteredProducts = products;
          
          if (search) {
            filteredProducts = filteredProducts.filter(p => 
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description.toLowerCase().includes(search.toLowerCase()) ||
              p.brand.toLowerCase().includes(search.toLowerCase())
            );
          }
          
          if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
          }
          
          if (brand) {
            filteredProducts = filteredProducts.filter(p => p.brand === brand);
          }
          
          if (minPrice) {
            filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
          }
          
          if (maxPrice) {
            filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
          }
          
          if (inStock) {
            filteredProducts = filteredProducts.filter(p => p.inStock);
          }

          // Get available filter options from all products
          const availableCategories = [...new Set(products.map(p => p.category))];
          const availableBrands = [...new Set(products.map(p => p.brand))];
          const priceRange = {
            min: Math.min(...products.map(p => p.price)),
            max: Math.max(...products.map(p => p.price))
          };

          context.pageContext = {
            type: 'products',
            description: 'User is browsing the products page',
            currentFilters: {
              search: search || null,
              category: category || null,
              brand: brand || null,
              minPrice: minPrice ? parseFloat(minPrice) : null,
              maxPrice: maxPrice ? parseFloat(maxPrice) : null,
              inStock: inStock || false,
              sort: sort
            },
            activeFiltersCount: [search, category, brand, minPrice, maxPrice, inStock].filter(Boolean).length,
            products: {
              total: products.length,
              filtered: filteredProducts.length,
              showing: filteredProducts.slice(0, 20).map(p => ({
                id: p.id,
                name: p.name,
                brand: p.brand,
                category: p.category,
                price: p.price,
                inStock: p.inStock,
                rating: p.rating
              }))
            },
            availableFilters: {
              categories: availableCategories,
              brands: availableBrands,
              priceRange,
              sortOptions: ['featured', 'price-low', 'price-high', 'rating', 'newest']
            },
            availableActions: [
              'Search for products',
              'Apply filters',
              'Sort products',
              'View product details',
              'Add products to cart'
            ]
          };
          break;

        case 'product':
          const productId = parseInt(getQueryParam('id') || '0');
          const currentProduct = products.find(p => p.id === productId);
          
          if (currentProduct) {
            // Get related products (same category, different product)
            const relatedProducts = products
              .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
              .slice(0, 4);

            context.pageContext = {
              type: 'product-detail',
              description: `User is viewing product details for: ${currentProduct.name}`,
                             currentProduct: {
                 id: currentProduct.id,
                 name: currentProduct.name,
                 brand: currentProduct.brand,
                 category: currentProduct.category,
                 price: currentProduct.price,
                 originalPrice: currentProduct.originalPrice,
                 inStock: currentProduct.inStock,
                 stockCount: (currentProduct as any).stockCount || null,
                 rating: currentProduct.rating,
                 description: currentProduct.description,
                 features: currentProduct.features,
                 specifications: (currentProduct as any).specifications || null
               },
              relatedProducts: relatedProducts.map(p => ({
                id: p.id,
                name: p.name,
                brand: p.brand,
                price: p.price
              })),
              isInCart: cartItems.some((item: any) => item.id === productId),
              availableActions: [
                'Add to cart',
                'Buy now',
                'View related products',
                'Go back to products',
                'Read reviews',
                'View specifications'
              ]
            };
          } else {
            context.pageContext = {
              type: 'product-not-found',
              description: 'User is on a product page but the product was not found',
              requestedProductId: productId,
              availableActions: ['Go back to products', 'Search for products']
            };
          }
          break;

        case 'util':
          context.pageContext = {
            type: 'utility',
            description: 'User is on the utility/tools page',
            availableActions: ['Use various utility tools', 'Test functionality']
          };
          break;

        default:
          context.pageContext = {
            type: 'unknown',
            description: `User is on an unknown page: ${currentPath}`,
            availableActions: ['Navigate to homepage', 'Navigate to products']
          };
      }

      // Add general application state
      context.applicationState = {
        hasItemsInCart: cartItems.length > 0,
        isLoggedIn: false, // This would be dynamic in a real app
        theme: 'light', // This would be dynamic in a real app
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight,
          isMobile: window.innerWidth < 768,
          isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
          isDesktop: window.innerWidth >= 1024
        },
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        }
      };

      // Add suggestions based on context
      context.suggestions = generateContextualSuggestions(context);

      return {
        success: true,
        context,
        summary: generateContextSummary(context)
      };

    } catch (error) {
      return {
        success: false,
        message: `Error getting context: ${error instanceof Error ? error.message : 'Unknown error'}`,
        context: {
          timestamp: new Date().toISOString(),
          error: true
        }
      };
    }
  }
};

function generateContextualSuggestions(context: any): string[] {
  const suggestions: string[] = [];

  // Cart-based suggestions
  if (context.cart.isEmpty) {
    suggestions.push("The cart is empty. I can help you find products to add.");
  } else {
    suggestions.push(`There are ${context.cart.itemCount} items in the cart worth $${context.cart.totalPrice.toFixed(2)}.`);
  }

  // Page-specific suggestions
  switch (context.pageContext.type) {
    case 'homepage':
      suggestions.push("I can help you navigate to products or answer questions about shopping.");
      break;
    
    case 'products':
      if (context.pageContext.currentFilters.search) {
        suggestions.push(`Currently searching for "${context.pageContext.currentFilters.search}".`);
      }
      if (context.pageContext.products.filtered < context.pageContext.products.total) {
        suggestions.push(`Showing ${context.pageContext.products.filtered} of ${context.pageContext.products.total} products with current filters.`);
      }
      suggestions.push("I can help you refine your search, apply filters, or find specific products.");
      break;
    
    case 'product-detail':
      suggestions.push(`Currently viewing ${context.pageContext.currentProduct.name} by ${context.pageContext.currentProduct.brand}.`);
      if (context.pageContext.currentProduct.inStock) {
        suggestions.push("This product is in stock and can be added to cart.");
      } else {
        suggestions.push("This product is currently out of stock.");
      }
      break;
  }

  return suggestions;
}

function generateContextSummary(context: any): string {
  let summary = `Current page: ${context.pageContext.type}`;
  
  if (context.pageContext.type === 'products') {
    summary += ` (showing ${context.pageContext.products.filtered} products)`;
  } else if (context.pageContext.type === 'product-detail') {
    summary += ` (${context.pageContext.currentProduct.name})`;
  }
  
  summary += `. Cart: ${context.cart.itemCount} items ($${context.cart.totalPrice.toFixed(2)})`;
  
  if (context.pageContext.currentFilters) {
    const activeFilters = Object.entries(context.pageContext.currentFilters)
      .filter(([_, value]) => value !== null && value !== false && value !== '')
      .map(([key, _]) => key);
    
    if (activeFilters.length > 0) {
      summary += `. Active filters: ${activeFilters.join(', ')}`;
    }
  }
  
  return summary;
} 