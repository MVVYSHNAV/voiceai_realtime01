# GetContext Tool Documentation

## Overview

The `getContext` tool provides the AI assistant with complete situational awareness of the current application state. This enables the AI to give more relevant, contextual responses based on what the user is currently viewing and doing.

## Tool Definition

- **Name**: `getContext`
- **Description**: Get complete current context including page, products, filters, cart, and application state
- **Parameters**: None (no parameters required)
- **Returns**: Comprehensive context object with current application state

## Context Information Provided

### 1. **Base Context**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "currentPage": "products",
  "currentUrl": "http://localhost:5176/products?search=headphones",
  "urlParameters": {
    "search": "headphones",
    "category": "Audio"
  }
}
```

### 2. **Cart Information**
```json
{
  "cart": {
    "items": [
      {
        "id": 1,
        "name": "Sony WH-1000XM4",
        "brand": "Sony",
        "price": 299.99,
        "quantity": 1,
        "image": "..."
      }
    ],
    "totalPrice": 299.99,
    "itemCount": 1,
    "isEmpty": false
  }
}
```

### 3. **Page-Specific Context**

#### Homepage Context
```json
{
  "pageContext": {
    "type": "homepage",
    "description": "User is on the homepage/landing page",
    "availableActions": [
      "Navigate to products",
      "Use floating chat",
      "Browse categories"
    ]
  }
}
```

#### Products Page Context
```json
{
  "pageContext": {
    "type": "products",
    "description": "User is browsing the products page",
    "currentFilters": {
      "search": "headphones",
      "category": "Audio",
      "brand": "Sony",
      "minPrice": null,
      "maxPrice": null,
      "inStock": false,
      "sort": "featured"
    },
    "activeFiltersCount": 3,
    "products": {
      "total": 50,
      "filtered": 12,
      "showing": [
        {
          "id": 1,
          "name": "Sony WH-1000XM4",
          "brand": "Sony",
          "category": "Audio",
          "price": 299.99,
          "inStock": true,
          "rating": 4.8
        }
      ]
    },
    "availableFilters": {
      "categories": ["Audio", "Electronics", "Computers"],
      "brands": ["Sony", "Apple", "Samsung"],
      "priceRange": { "min": 25.99, "max": 2499.99 },
      "sortOptions": ["featured", "price-low", "price-high", "rating", "newest"]
    },
    "availableActions": [
      "Search for products",
      "Apply filters",
      "Sort products",
      "View product details",
      "Add products to cart"
    ]
  }
}
```

#### Product Detail Page Context
```json
{
  "pageContext": {
    "type": "product-detail",
    "description": "User is viewing product details for: Sony WH-1000XM4",
    "currentProduct": {
      "id": 1,
      "name": "Sony WH-1000XM4",
      "brand": "Sony",
      "category": "Audio",
      "price": 299.99,
      "originalPrice": 399.99,
      "inStock": true,
      "stockCount": 15,
      "rating": 4.8,
      "description": "Industry-leading noise canceling...",
      "features": ["30-hour battery", "Quick charge"],
      "specifications": { "Weight": "254g", "Connectivity": "Bluetooth 5.0" }
    },
    "relatedProducts": [
      { "id": 2, "name": "Bose QuietComfort", "brand": "Bose", "price": 279.99 }
    ],
    "isInCart": true,
    "availableActions": [
      "Add to cart",
      "Buy now",
      "View related products",
      "Go back to products",
      "Read reviews",
      "View specifications"
    ]
  }
}
```

### 4. **Application State**
```json
{
  "applicationState": {
    "hasItemsInCart": true,
    "isLoggedIn": false,
    "theme": "light",
    "screenSize": {
      "width": 1920,
      "height": 1080,
      "isMobile": false,
      "isTablet": false,
      "isDesktop": true
    },
    "browserInfo": {
      "userAgent": "Mozilla/5.0...",
      "language": "en-US",
      "platform": "MacIntel"
    }
  }
}
```

### 5. **Contextual Suggestions**
```json
{
  "suggestions": [
    "There are 2 items in the cart worth $579.98.",
    "Currently viewing Sony WH-1000XM4 by Sony.",
    "This product is in stock and can be added to cart."
  ]
}
```

### 6. **Context Summary**
```json
{
  "summary": "Current page: product-detail (Sony WH-1000XM4). Cart: 2 items ($579.98)"
}
```

## Usage Examples

### Example 1: AI Getting Context Before Responding
```javascript
// AI calls getContext before answering user questions
const context = await getContext();

// AI can now provide contextual responses like:
// "I see you're looking at the Sony WH-1000XM4 headphones. 
//  They're currently in stock for $299.99 (down from $399.99). 
//  You have 2 items in your cart already. Would you like to add these headphones too?"
```

### Example 2: Context-Aware Product Recommendations
```javascript
// Based on current page and cart contents
if (context.pageContext.type === 'product-detail') {
  const currentProduct = context.pageContext.currentProduct;
  // AI can suggest related products in the same category
  // or complementary products based on what's in the cart
}
```

### Example 3: Smart Navigation Assistance
```javascript
// AI can understand where the user is and suggest relevant actions
if (context.pageContext.type === 'products' && context.pageContext.products.filtered === 0) {
  // "It looks like your search didn't return any results. 
  //  Would you like me to help you find similar products or adjust your filters?"
}
```

## Integration with Other Tools

The `getContext` tool works seamlessly with other tools:

1. **searchProducts**: Can see current search terms and suggest refinements
2. **applyProductFilters**: Knows current filters and can suggest modifications
3. **viewProduct**: Understands if user is already viewing a product
4. **navigatePage**: Can suggest contextual navigation based on current state

## Benefits for AI Assistant

### 1. **Contextual Awareness**
- Knows exactly what the user is currently viewing
- Understands user's shopping journey stage
- Can reference specific products, filters, or cart contents

### 2. **Personalized Responses**
- Tailors responses based on current context
- Provides relevant suggestions and recommendations
- Avoids redundant or irrelevant information

### 3. **Proactive Assistance**
- Can anticipate user needs based on current state
- Suggests next logical actions
- Helps with decision-making based on context

### 4. **Enhanced User Experience**
- More natural, conversational interactions
- Reduced need for users to repeat information
- Smarter, more helpful responses

## Technical Implementation

### Tool Registration
```typescript
// In registry.ts
get_context: {
  definition: getContextDefinition,
  handler: getContextHandler
}
```

### Context Gathering Process
1. **URL Analysis**: Extracts current page and parameters
2. **Cart Reading**: Loads cart state from localStorage
3. **Product Filtering**: Applies current filters to product data
4. **State Aggregation**: Combines all context information
5. **Suggestion Generation**: Creates contextual suggestions
6. **Summary Creation**: Generates human-readable summary

### Error Handling
- Graceful fallback if localStorage is unavailable
- Safe property access for optional product fields
- Comprehensive error reporting

## Testing

Use the `testContext` tool to verify context functionality:

```javascript
// This tool calls getContext and formats the results for easy inspection
const result = await testContext();
console.log(result.report); // Formatted context report
console.log(result.fullContext); // Complete context object
```

## Future Enhancements

1. **User Preferences**: Track and include user browsing history
2. **Session Data**: Include session duration and interaction patterns
3. **Performance Metrics**: Add page load times and user engagement data
4. **A/B Testing**: Include current experiment variations
5. **Inventory Updates**: Real-time stock level monitoring
6. **Price Tracking**: Historical price data and trends

## Best Practices

1. **Call Early**: Get context at the beginning of AI interactions
2. **Cache Wisely**: Context can change frequently, don't cache too long
3. **Use Selectively**: Not every response needs full context
4. **Respect Privacy**: Be mindful of sensitive information in context
5. **Performance**: Context gathering is fast but avoid unnecessary calls

## Conclusion

The `getContext` tool transforms the AI assistant from a generic chatbot into a context-aware shopping companion. By understanding exactly what the user is doing, viewing, and planning, the AI can provide significantly more valuable and relevant assistance throughout the shopping experience. 