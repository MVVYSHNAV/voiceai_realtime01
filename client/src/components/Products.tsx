import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { products } from '../data/products.json';
import type { Product, SortOption } from '../types/product';
import { getQueryParam, replacePath, navigateTo } from '../utils/navigation';

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded border border-gray-200 overflow-hidden h-full flex flex-col shadow-sm animate-pulse">
    {/* Image Skeleton */}
    <div className="bg-gray-200 h-48"></div>
    
    {/* Content Skeleton */}
    <div className="p-4 flex flex-col flex-1">
      {/* Brand */}
      <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      
      {/* Product Name */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      
      {/* Category Chip */}
      <div className="h-5 bg-gray-200 rounded-full w-20 mb-3"></div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Price */}
      <div className="h-5 bg-gray-200 rounded w-20 mb-3"></div>
      
      {/* Button */}
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [urlChangeCounter, setUrlChangeCounter] = useState(0); // Force re-render trigger
  const itemsPerPage = 12; // Increased to 12 for 4x3 grid

  // Update URL when filters change
  const updateURL = (params: Record<string, string | number>) => {
    const cleanParams: Record<string, string | number> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      // Only include non-default values in URL
      if (key === 'search' && value !== '') {
        cleanParams[key] = value;
      } else if (key === 'category' && value !== '') {
        cleanParams[key] = value;
      } else if (key === 'brand' && value !== '') {
        cleanParams[key] = value;
      } else if (key === 'minPrice' && value !== 0) {
        cleanParams[key] = value;
      } else if (key === 'maxPrice' && value !== 2000) {
        cleanParams[key] = value;
      } else if (key === 'sort' && value !== 'featured') {
        cleanParams[key] = value;
      } else if (key === 'page' && value !== 1) {
        cleanParams[key] = value;
      }
    });

    replacePath('products', cleanParams);
  };

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearch = getQueryParam('search') || '';
    const urlCategory = getQueryParam('category') || '';
    const urlBrand = getQueryParam('brand') || '';
    const urlMinPrice = parseInt(getQueryParam('minPrice') || '0');
    const urlMaxPrice = parseInt(getQueryParam('maxPrice') || '2000');
    const urlSort = (getQueryParam('sort') as SortOption) || 'featured';
    const urlPage = parseInt(getQueryParam('page') || '1');

    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setSortBy(urlSort);
    setCurrentPage(urlPage);
    setIsInitialized(true);
  }, []);

  // Listen for URL changes (e.g., from tool calls)
  useEffect(() => {
    const handlePopState = () => {
      console.log('Products: popstate event triggered, updating from URL');
      const urlSearch = getQueryParam('search') || '';
      const urlCategory = getQueryParam('category') || '';
      const urlBrand = getQueryParam('brand') || '';
      const urlMinPrice = parseInt(getQueryParam('minPrice') || '0');
      const urlMaxPrice = parseInt(getQueryParam('maxPrice') || '2000');
      const urlSort = (getQueryParam('sort') as SortOption) || 'featured';
      const urlPage = parseInt(getQueryParam('page') || '1');

      console.log('Products: URL params:', { urlSearch, urlCategory, urlBrand, urlMinPrice, urlMaxPrice, urlSort, urlPage });

      setSearchTerm(urlSearch);
      setSelectedCategory(urlCategory);
      setSelectedBrand(urlBrand);
      setMinPrice(urlMinPrice);
      setMaxPrice(urlMaxPrice);
      setSortBy(urlSort);
      setCurrentPage(urlPage);
      setUrlChangeCounter(prev => prev + 1); // Force re-render
    };

    const handleLocationChange = () => {
      console.log('Products: custom locationchange event triggered');
      handlePopState();
    };

    // Listen for popstate events (triggered by navigation utilities)
    window.addEventListener('popstate', handlePopState);
    
    // Also listen for custom navigation events
    window.addEventListener('locationchange', handleLocationChange);

    // Fallback: Poll for URL changes every 500ms as a backup
    const pollInterval = setInterval(() => {
      const currentUrl = window.location.href;
      const lastUrl = (window as any)._lastUrl;
      if (currentUrl !== lastUrl) {
        console.log('Products: URL change detected via polling');
        (window as any)._lastUrl = currentUrl;
        handlePopState();
      }
    }, 500);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('locationchange', handleLocationChange);
      clearInterval(pollInterval);
    };
  }, []);

  // Get unique categories and brands
  const categories = useMemo(() => 
    Array.from(new Set(products.map(p => p.category))).sort(), 
    []
  );
  const brands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand))).sort(), 
    []
  );

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Sort by ID for newest (higher ID = newer)
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change and update URL
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL during initial load
    
    console.log('Products: Filters changed, current state:', {
      searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, currentPage
    });
    
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    updateURL({
      search: searchTerm,
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sortBy,
      page: currentPage > 1 ? currentPage : 1
    });
  }, [searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, isInitialized]);

  // Update URL when page changes and add loading state
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL during initial load
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short loading simulation

    updateURL({
      search: searchTerm,
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sortBy,
      page: currentPage
    });

    return () => clearTimeout(timer);
  }, [currentPage, isInitialized]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice(0);
    setMaxPrice(2000);
    setSortBy('featured');
    setCurrentPage(1);
    replacePath('products'); // Clear URL parameters
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedBrand || minPrice > 0 || maxPrice < 2000 || sortBy !== 'featured';

  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Search Filter - Compact */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <label className="text-sm font-medium text-gray-900">Search</label>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        />
      </div>

      {/* Category Filter - Compact */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <label className="text-sm font-medium text-gray-900">Category</label>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter - Compact */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <label className="text-sm font-medium text-gray-900">Brand</label>
        </div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter - Compact */}
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <label className="text-sm font-medium text-gray-900">
            Price: ${minPrice} - ${maxPrice}
          </label>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Min: $0</span>
              <span>Max: $2000</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider"
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider"
            />
          </div>
        </div>
      </div>

      {/* Filter Actions - Compact */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Clear
        </button>
        <button
          onClick={() => setIsFiltersOpen(false)}
          className="lg:hidden flex-1 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Condensed Top Utility Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Title + Inline Search */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Premium Tech Gear</h1>
                  <p className="text-sm text-gray-600">Curated tech products for your digital lifestyle</p>
                </div>
                
                {/* Inline Search - Desktop */}
                <div className="hidden lg:block flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Filter Summary Bar */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-900">×</button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-green-900">×</button>
                    </span>
                  )}
                  {selectedBrand && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                      {selectedBrand}
                      <button onClick={() => setSelectedBrand('')} className="ml-1 hover:text-purple-900">×</button>
                    </span>
                  )}
                  {(minPrice > 0 || maxPrice < 2000) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800">
                      ${minPrice} - ${maxPrice}
                      <button onClick={() => { setMinPrice(0); setMaxPrice(2000); }} className="ml-1 hover:text-orange-900">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Right: Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Product Count + Sort */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> products
                </span>
                
                <div className="flex items-center gap-2">
                  <label className="text-gray-600 hidden sm:block">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price ↑</option>
                    <option value="price-high">Price ↓</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-gray-900 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {[searchTerm, selectedCategory, selectedBrand, minPrice > 0 || maxPrice < 2000 ? 'price' : null].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Compact Sticky Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <FiltersContent />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto h-full pb-20">
                  <FiltersContent />
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Enhanced Grid */}
          <div className="flex-1">
            {/* Dense Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 12 }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Compact Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                >
                  Prev
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 