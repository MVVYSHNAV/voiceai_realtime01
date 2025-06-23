# Utility Functions & /util Page Documentation

This document provides comprehensive details on the utility functions available in the voice-agent application, including navigation utilities, URL parameter handling, and the `/util` testing page.

## Table of Contents

1. [Navigation Utilities](#navigation-utilities)
2. [URL Parameter Functions](#url-parameter-functions)
3. [Util Page Features](#util-page-features)
4. [Code Examples](#code-examples)
5. [File References](#file-references)

---

## Navigation Utilities

### File Location
`client/src/utils/navigation.ts`

### Available Functions

#### `navigateTo(path, params?)`
Navigate to a specific route using proper URL routing.

**Parameters:**
- `path` (string): The path to navigate to (e.g., '', 'products', 'util')
- `params` (optional, Record<string, string | number>): Query parameters

**Examples:**
```typescript
import { navigateTo } from '../utils/navigation';

// Navigate to home page
navigateTo('');

// Navigate to products page
navigateTo('products');

// Navigate to products with filters
navigateTo('products', {
  search: 'headphones',
  category: 'Audio',
  sort: 'price-low'
});

// Navigate with price range
navigateTo('products', {
  minPrice: 100,
  maxPrice: 500,
  brand: 'Sony'
});
```

#### `getCurrentPath()`
Get the current route path without leading slash.

**Returns:** `string` - Current path

**Example:**
```typescript
import { getCurrentPath } from '../utils/navigation';

const currentPath = getCurrentPath();
console.log(currentPath); // 'products', 'util', or '' for home
```

#### `getSearchParams()`
Get current URL search parameters as URLSearchParams object.

**Returns:** `URLSearchParams` - URL search parameters

**Example:**
```typescript
import { getSearchParams } from '../utils/navigation';

const params = getSearchParams();
console.log(params.get('search')); // Get search parameter
console.log(params.has('category')); // Check if category exists
```

#### `getQueryParam(key)`
Get a specific query parameter value.

**Parameters:**
- `key` (string): The parameter key

**Returns:** `string | null` - Parameter value or null if not found

**Example:**
```typescript
import { getQueryParam } from '../utils/navigation';

const searchTerm = getQueryParam('search');
const category = getQueryParam('category');
const page = getQueryParam('page');
```

#### `goBack()` & `goForward()`
Navigate through browser history.

**Example:**
```typescript
import { goBack, goForward } from '../utils/navigation';

// Go back one page
goBack();

// Go forward one page
goForward();
```

#### `replacePath(path, params?)`
Replace the current route without adding to history stack.

**Parameters:**
- `path` (string): The path to replace with
- `params` (optional, Record<string, string | number>): Query parameters

**Example:**
```typescript
import { replacePath } from '../utils/navigation';

// Replace current URL without history entry
replacePath('products', { search: 'updated-search' });
```

#### `isCurrentPath(path)`
Check if the current path matches the given path.

**Parameters:**
- `path` (string): The path to check against

**Returns:** `boolean` - True if paths match

**Example:**
```typescript
import { isCurrentPath } from '../utils/navigation';

if (isCurrentPath('products')) {
  console.log('Currently on products page');
}
```

#### `onRouteChange(callback)`
Add a listener for route changes.

**Parameters:**
- `callback` (function): Function called when route changes

**Returns:** `function` - Cleanup function to remove listener

**Example:**
```typescript
import { onRouteChange } from '../utils/navigation';

const cleanup = onRouteChange((path) => {
  console.log('Route changed to:', path);
});

// Later, remove the listener
cleanup();
```

---

## URL Parameter Functions

### Supported Parameters for Products Page

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| `search` | string | Search term | "headphones", "camera", "laptop" |
| `category` | string | Product category | "Audio", "Wearables", "Photography" |
| `brand` | string | Product brand | "Sony", "Apple", "Canon" |
| `minPrice` | number | Minimum price filter | 100, 500, 1000 |
| `maxPrice` | number | Maximum price filter | 200, 1000, 2000 |
| `sort` | string | Sort option | "price-low", "price-high", "rating", "newest" |
| `page` | number | Page number for pagination | 1, 2, 3 |

### Available Categories
```typescript
const categories = [
  'Audio', 'Wearables', 'Photography', 'Furniture', 
  'Lighting', 'Computers', 'Phones', 'Electronics', 
  'Gaming', 'Accessories'
];
```

### Available Brands
```typescript
const brands = [
  'Sony', 'Apple', 'Canon', 'Herman Miller', 'Dyson', 
  'JBL', 'Samsung', 'Bose', 'Nintendo', 'Tesla'
];
```

### Sort Options
```typescript
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
];
```

---

## Util Page Features

### File Location
`client/src/components/Util.tsx`

### Accessing the Util Page
Navigate to `/util` in your browser or use:
```typescript
navigateTo('util');
```

### Features Available

#### 1. Navigation Utilities Testing
- **Basic Navigation**: Buttons to navigate to home, products, etc.
- **History Navigation**: Back/Forward buttons
- **Dynamic Navigation**: Input field for custom paths
- **Current Path Display**: Shows current route
- **Usage Examples**: Code snippets for reference

#### 2. Products Page URL Filter Testing

##### Quick Presets
Pre-configured filter combinations for common use cases:

| Preset | Configuration | Generated URL |
|--------|---------------|---------------|
| Audio Headphones | search: "headphones", category: "Audio", sort: "price-low" | `/products?search=headphones&category=Audio&sort=price-low` |
| Apple Products | brand: "Apple", sort: "newest" | `/products?brand=Apple&sort=newest` |
| Budget Under $200 | maxPrice: 200, sort: "price-low" | `/products?maxPrice=200&sort=price-low` |
| Premium Over $1000 | minPrice: 1000, sort: "price-high" | `/products?minPrice=1000&sort=price-high` |
| Photography Gear | category: "Photography", sort: "rating" | `/products?category=Photography&sort=rating` |

##### Manual Filter Controls
- **Search Term Input**: Free text search
- **Category Dropdown**: Select from available categories
- **Brand Dropdown**: Select from available brands
- **Price Range**: Min/Max price inputs
- **Sort Options**: Dropdown with all sort options
- **Page Number**: Pagination control

##### URL Generation & Testing
- **Live URL Preview**: Shows generated URL as you change filters
- **Navigate Button**: Direct navigation to products page with filters
- **Copy URL**: One-click URL copying to clipboard
- **Clear All**: Reset all filters

---

## Code Examples

### Basic Navigation
```typescript
import { navigateTo, getCurrentPath, isCurrentPath } from '../utils/navigation';

function MyComponent() {
  const handleNavigation = () => {
    // Navigate to products page
    navigateTo('products');
  };

  const checkCurrentPage = () => {
    if (isCurrentPath('products')) {
      console.log('On products page');
    }
  };

  return (
    <button onClick={handleNavigation}>
      Go to Products
    </button>
  );
}
```

### Products Page with Filters
```typescript
import { navigateTo } from '../utils/navigation';

function FilteredNavigation() {
  const searchAudioProducts = () => {
    navigateTo('products', {
      category: 'Audio',
      sort: 'price-low',
      maxPrice: 300
    });
  };

  const searchAppleProducts = () => {
    navigateTo('products', {
      brand: 'Apple',
      sort: 'newest'
    });
  };

  const searchWithKeyword = (keyword: string) => {
    navigateTo('products', {
      search: keyword,
      sort: 'rating'
    });
  };

  return (
    <div>
      <button onClick={searchAudioProducts}>
        Audio Under $300
      </button>
      <button onClick={searchAppleProducts}>
        Latest Apple Products
      </button>
      <button onClick={() => searchWithKeyword('camera')}>
        Search Cameras
      </button>
    </div>
  );
}
```

### Reading URL Parameters
```typescript
import { getQueryParam, getSearchParams } from '../utils/navigation';
import { useEffect, useState } from 'react';

function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'featured',
    page: 1
  });

  useEffect(() => {
    // Read URL parameters on component mount
    const search = getQueryParam('search') || '';
    const category = getQueryParam('category') || '';
    const brand = getQueryParam('brand') || '';
    const minPrice = getQueryParam('minPrice') || '';
    const maxPrice = getQueryParam('maxPrice') || '';
    const sort = getQueryParam('sort') || 'featured';
    const page = parseInt(getQueryParam('page') || '1');

    setFilters({
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page
    });
  }, []);

  return (
    <div>
      <h1>Products Page</h1>
      <p>Current filters: {JSON.stringify(filters)}</p>
    </div>
  );
}
```

### Route Change Listener
```typescript
import { onRouteChange } from '../utils/navigation';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const cleanup = onRouteChange((path) => {
      console.log('Route changed to:', path);
      
      // Perform actions based on route
      if (path === 'products') {
        // Load products data
      } else if (path === 'util') {
        // Initialize util page
      }
    });

    // Cleanup on component unmount
    return cleanup;
  }, []);

  return <div>App Content</div>;
}
```

---

## File References

### Core Files
- **Navigation Utilities**: `client/src/utils/navigation.ts`
- **Util Page Component**: `client/src/components/Util.tsx`
- **Navigation Example**: `client/src/components/NavigationExample.tsx`
- **Products Page**: `client/src/components/Products.tsx`
- **App Router**: `client/src/App.tsx`

### Usage Examples in Codebase
- **Homepage Navigation**: `client/src/components/Homepage.tsx`
- **Navigation Component**: `client/src/components/Navigation.tsx`
- **useRouter Hook**: `client/src/hooks/useRouter.ts`

### Related Documentation
- **Adding Tools**: `doc/KT/AddingTool.md`
- **Tailwind Setup**: `doc/tailwind-vite.md`

---

## Best Practices

1. **Always use `navigateTo()` instead of direct window.location manipulation**
2. **Use `getQueryParam()` for reading single parameters**
3. **Use `getSearchParams()` for reading multiple parameters**
4. **Clean up route listeners with the returned cleanup function**
5. **Validate parameter values before using them**
6. **Use `replacePath()` for URL updates that shouldn't create history entries**
7. **Test navigation flows using the `/util` page**

---

## Testing URLs

Use the `/util` page to test various URL combinations:

1. Navigate to `/util` in your browser
2. Use the preset buttons for common scenarios
3. Manually configure filters using the form controls
4. Preview the generated URL
5. Click "Navigate to Products" to test the URL
6. Use "Copy URL" to share or bookmark specific filter combinations

Example test URLs:
- `/products?search=sony&category=Audio&sort=price-low`
- `/products?brand=Apple&minPrice=500&sort=newest`
- `/products?category=Photography&maxPrice=1000&sort=rating&page=2`
