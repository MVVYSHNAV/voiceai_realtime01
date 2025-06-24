# New Navigation & Product Tools

This document describes the four new tools added to Tomorrow's voice agent for enhanced navigation and product interaction capabilities.

## Tools Overview

### 1. `navigate_page` - Page Navigation
**Purpose**: Navigate to different pages in the application  
**File**: `client/src/tools/navigatePage.ts`

**Parameters**:
- `page` (required): Target page ("", "products", "util")
- `params` (optional): Query parameters for the page

**Usage Examples**:
- "Go to the products page"
- "Navigate to home" 
- "Take me to the utilities page"
- "Go to products with search for headphones"

**Implementation**: Uses `navigateTo()` from navigation utilities

---

### 2. `get_available_pages` - Page Discovery
**Purpose**: Get information about all available pages and current location  
**File**: `client/src/tools/getAvailablePages.ts`

**Parameters**: None

**Usage Examples**:
- "What pages are available?"
- "Where am I currently?"
- "Show me all available pages"
- "What can I do on this site?"

**Returns**: Complete page information including features, categories, brands, and sort options

---

### 3. `search_products` - Product Search
**Purpose**: Search for products and navigate to results  
**File**: `client/src/tools/searchProducts.ts`

**Parameters**:
- `search_term` (required): Keyword to search for
- `category` (optional): Filter by category
- `brand` (optional): Filter by brand  
- `sort` (optional): Sort order for results

**Usage Examples**:
- "Search for headphones"
- "Find Sony audio products"
- "Search for cameras sorted by price"
- "Look for Apple products in the newest order"

**Implementation**: Builds search URL and navigates to products page

---

### 4. `apply_product_filters` - Advanced Filtering
**Purpose**: Apply comprehensive filters to the products page  
**File**: `client/src/tools/applyProductFilters.ts`

**Parameters**:
- `search` (optional): Search term
- `category` (optional): Product category
- `brand` (optional): Product brand
- `min_price` (optional): Minimum price (USD)
- `max_price` (optional): Maximum price (USD)
- `sort` (optional): Sort order
- `page` (optional): Page number

**Usage Examples**:
- "Show me Apple products under $500"
- "Filter products by Audio category"
- "Show expensive products over $1000"
- "Sort products by rating"
- "Find photography gear between $200 and $800"

**Implementation**: Builds comprehensive filter URL and navigates to products page

## Supported Values

### Categories
- Audio, Wearables, Photography, Furniture, Lighting
- Computers, Phones, Electronics, Gaming, Accessories

### Brands  
- Sony, Apple, Canon, Herman Miller, Dyson
- JBL, Samsung, Bose, Nintendo, Tesla

### Sort Options
- `featured` - Default featured products
- `price-low` - Price: Low to High
- `price-high` - Price: High to Low  
- `rating` - Highest Rated
- `newest` - Newest Products

### Price Range
- Minimum: $0
- Maximum: $2000
- Can set any range within these bounds

## Tool Integration

All tools are registered in `client/src/tools/registry.ts` and automatically available to the OpenAI model. They integrate seamlessly with:

- **Navigation System**: Uses utilities from `client/src/utils/navigation.ts`
- **URL Parameters**: Supports all product filter parameters
- **Error Handling**: Graceful error handling with meaningful feedback
- **Type Safety**: Full TypeScript support with proper interfaces

## User Experience Flow

1. **Discovery**: User asks "what pages are available?" → `get_available_pages`
2. **Navigation**: User says "go to products" → `navigate_page`
3. **Search**: User requests "search for headphones" → `search_products`
4. **Filtering**: User asks "show Apple products under $500" → `apply_product_filters`

## Example Voice Commands

### Navigation
- "Take me to the home page"
- "Go to products"
- "Navigate to utilities"

### Discovery
- "What pages can I visit?"
- "Where am I right now?"
- "What features are available?"

### Product Search
- "Search for wireless headphones"
- "Find Canon cameras"
- "Look for gaming products"
- "Search Sony audio equipment"

### Advanced Filtering
- "Show me products under $200"
- "Find Apple products sorted by price"
- "Display photography equipment over $500"
- "Show audio products from Sony and Bose"
- "Filter by wearables category with highest ratings"

## Technical Implementation

Each tool follows the established pattern:

1. **Type Definition**: Interface for parameters
2. **Tool Definition**: OpenAI function schema with validation
3. **Handler Implementation**: Execute function with error handling
4. **Registry Registration**: Added to central tool registry
5. **Documentation**: Usage examples and parameter descriptions

The tools leverage the existing navigation utilities and maintain consistency with the application's routing system, ensuring seamless integration with the user interface. 