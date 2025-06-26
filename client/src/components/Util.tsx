import { useState } from 'react';
import { NavigationExample } from './NavigationExample';
import { navigateTo } from '../utils/navigation';

export function Util() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState('');

  // Available options for testing
  const categories = ['Audio', 'Wearables', 'Photography', 'Furniture', 'Lighting', 'Computers', 'Phones', 'Electronics', 'Gaming', 'Accessories'];
  const brands = ['Sony', 'Apple', 'Canon', 'Herman Miller', 'Dyson', 'JBL', 'Samsung', 'Bose', 'Nintendo', 'Tesla'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' }
  ];

  const handleNavigateWithFilters = () => {
    const params: Record<string, string | number> = {};
    
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (minPrice) params.minPrice = parseInt(minPrice);
    if (maxPrice) params.maxPrice = parseInt(maxPrice);
    if (sortBy && sortBy !== 'featured') params.sort = sortBy;
    if (page && page !== '1') params.page = parseInt(page);

    navigateTo('products', params);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setPage('');
  };

  const setPresetFilter = (preset: string) => {
    clearAllFilters();
    
    switch (preset) {
      case 'audio-headphones':
        setSearchTerm('headphones');
        setSelectedCategory('Audio');
        setSortBy('price-low');
        break;
      case 'apple-products':
        setSelectedBrand('Apple');
        setSortBy('newest');
        break;
      case 'budget-under-200':
        setMaxPrice('200');
        setSortBy('price-low');
        break;
      case 'premium-over-1000':
        setMinPrice('1000');
        setSortBy('price-high');
        break;
      case 'photography-gear':
        setSelectedCategory('Photography');
        setSortBy('rating');
        break;
    }
  };

  const generateCurrentURL = () => {
    const params: Record<string, string | number> = {};
    
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (minPrice) params.minPrice = parseInt(minPrice);
    if (maxPrice) params.maxPrice = parseInt(maxPrice);
    if (sortBy && sortBy !== 'featured') params.sort = sortBy;
    if (page && page !== '1') params.page = parseInt(page);

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });
    
    const queryString = searchParams.toString();
    return `/products${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">Utility Tools</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test navigation utilities, URL parameter handling, and voice agent features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Voice Agent Testing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Voice Agent Auto-Collapse Test</h3>
            <p className="text-sm text-gray-600 mb-4">
              Test the auto-collapse functionality of the voice agent call interface.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openFloatingChat', {
                    detail: { mode: 'call' }
                  }));
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                🎤 Start Voice Call (Test Auto-Collapse)
              </button>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Expected behavior:</strong><br/>
                1. Click button to start voice call<br/>
                2. Call widget appears in expanded mode<br/>
                3. Connection establishes (watch console logs)<br/>
                4. Widget automatically collapses after 2.5 seconds<br/>
                5. Collapsed widget shows timer and controls<br/>
                6. Test the fixed end call (phone) and expand icons
              </div>
              
              <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
                <strong>💡 Tip:</strong> Open browser console (F12) to see detailed logs of the auto-collapse process.
              </div>
            </div>
          </div>

          {/* Navigation Utilities */}
          <div>
            <NavigationExample />
          </div>

          {/* URL Filter Testing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Products Page URL Filter Testing</h3>
            
            {/* Preset Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Presets:</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPresetFilter('audio-headphones')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Audio Headphones
                </button>
                <button
                  onClick={() => setPresetFilter('apple-products')}
                  className="px-3 py-2 text-xs bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Apple Products
                </button>
                <button
                  onClick={() => setPresetFilter('budget-under-200')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Budget Under $200
                </button>
                <button
                  onClick={() => setPresetFilter('premium-over-1000')}
                  className="px-3 py-2 text-xs bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Premium Over $1000
                </button>
                <button
                  onClick={() => setPresetFilter('photography-gear')}
                  className="px-3 py-2 text-xs bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors col-span-2"
                >
                  Photography Gear
                </button>
              </div>
            </div>

            {/* Manual Filter Controls */}
            <div className="space-y-4 mb-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">Search Term</label>
                <input
                  type="text"
                  placeholder="e.g., headphones, camera, laptop"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort and Page */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Featured (default)</option>
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Page</label>
                  <input
                    type="number"
                    placeholder="1"
                    min="1"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Generated URL Preview */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-900 mb-2">Generated URL:</label>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <code className="text-xs font-mono text-gray-800 break-all">
                  {window.location.origin}{generateCurrentURL()}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNavigateWithFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Navigate to Products
              </button>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Copy URL Button */}
            <button
              onClick={() => {
                const url = `${window.location.origin}${generateCurrentURL()}`;
                navigator.clipboard.writeText(url).then(() => {
                  // You could add a toast notification here
                  console.log('URL copied to clipboard:', url);
                });
              }}
              className="w-full mt-3 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              📋 Copy URL to Clipboard
            </button>
          </div>
        </div>

        {/* Additional Examples */}
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Example URLs & Use Cases</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Common Filter Combinations:</h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Audio Products under $300:</strong><br/>
                    <code className="text-blue-600">/products?category=Audio&maxPrice=300&sort=price-low</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Apple Wearables:</strong><br/>
                    <code className="text-blue-600">/products?brand=Apple&category=Wearables</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Search "camera" sorted by rating:</strong><br/>
                    <code className="text-blue-600">/products?search=camera&sort=rating</code>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">URL Parameter Reference:</h4>
                <div className="text-xs space-y-1">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">search</code> - Search term</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">category</code> - Product category</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">brand</code> - Product brand</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">minPrice</code> - Minimum price</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">maxPrice</code> - Maximum price</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">sort</code> - Sort option</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">page</code> - Page number</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 