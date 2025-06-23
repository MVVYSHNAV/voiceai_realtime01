import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { products } from '../data/products.json';
import type { Product, SortOption } from '../types/product';
import { getQueryParam, replacePath, navigateTo } from '../utils/navigation';

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col shadow-sm animate-pulse">
    {/* Image Skeleton */}
    <div className="bg-gray-200 h-60"></div>
    
    {/* Content Skeleton */}
    <div className="p-5 flex flex-col flex-1">
      {/* Brand */}
      <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      
      {/* Product Name */}
      <div className="space-y-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      </div>
      
      {/* Category Chip */}
      <div className="h-6 bg-gray-200 rounded-full w-20 mb-4"></div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Price */}
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
      
      {/* Button */}
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
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
  const itemsPerPage = 9; // Changed to 9 for 3x3 grid

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
  }, []);

  // Update URL when filters change
  const updateURL = (params: Record<string, string | number>) => {
    const cleanParams: Record<string, string | number> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== 0 && value !== '0' && value !== 'featured' && value !== 1) {
        cleanParams[key] = value;
      }
    });

    replacePath('products', cleanParams);
  };

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
        filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
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
  }, [searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  // Update URL when page changes and add loading state
  useEffect(() => {
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
  }, [currentPage]);

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

  // Generate dynamic breadcrumbs based on active filters
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', path: '', onClick: () => navigateTo('') }
    ];

    if (selectedCategory) {
      breadcrumbs.push({
        label: selectedCategory,
        path: `products?category=${selectedCategory}`,
        onClick: () => {}
      });
    } else if (selectedBrand) {
      breadcrumbs.push({
        label: selectedBrand,
        path: `products?brand=${selectedBrand}`,
        onClick: () => {}
      });
    } else if (searchTerm) {
      breadcrumbs.push({
        label: `Search: "${searchTerm}"`,
        path: `products?search=${searchTerm}`,
        onClick: () => {}
      });
    } else {
      breadcrumbs.push({
        label: 'Products',
        path: 'products',
        onClick: () => {}
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Search Filter */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
        <div className="flex items-center gap-2 mb-3">
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <label className="text-sm font-medium text-gray-900">Category</label>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <label className="text-sm font-medium text-gray-900">Brand</label>
        </div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <label className="text-sm font-medium text-gray-900">
            Price Range: ${minPrice} - ${maxPrice}
          </label>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Min: $0</span>
              <span>Max: $2000</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider"
                style={{
                  background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${(minPrice/2000)*100}%, #e5e7eb ${(minPrice/2000)*100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer range-slider"
                style={{
                  background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${(maxPrice/2000)*100}%, #e5e7eb ${(maxPrice/2000)*100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Clear Filters
        </button>
        <button
          onClick={() => setIsFiltersOpen(false)}
          className="lg:hidden flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500 font-medium">{crumb.label}</span>
                ) : (
                  <button 
                    onClick={crumb.onClick}
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Enhanced Header with Compelling Title */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Explore Premium Tech Gear
              </h1>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-2xl">
                Carefully curated tech products designed to enhance your digital lifestyle. 
                From cutting-edge gadgets to essential accessories, discover innovation that works for you.
              </p>
              
              {/* Dynamic Context Based on Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedBrand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {selectedBrand}
                    </span>
                  )}
                  {(minPrice > 0 || maxPrice < 2000) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      ${minPrice} - ${maxPrice}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-gray-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                    Active
                  </span>
                )}
              </button>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-900 hidden sm:block">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm font-medium"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Results Count with Better Styling */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> products found
                {paginatedProducts.length !== filteredAndSortedProducts.length && (
                  <span> • Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> per page</span>
                )}
              </p>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {Array.from({ length: 9 }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg border border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
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