import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { navigateTo } from '../utils/navigation';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleProductClick = () => {
    navigateTo(`product?id=${product.id}`);
  };

  const getStockStatus = () => {
    if (!product.inStock) return { text: 'Out of Stock', className: 'text-red-600' };
    if (product.stockCount && product.stockCount < 10) return { text: 'Low Stock', className: 'text-yellow-600' };
    return { text: 'In Stock', className: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col relative">
      {/* Image Container with Compact Height */}
      <div 
        className="relative overflow-hidden bg-gray-50 cursor-pointer" 
        style={{ height: '192px' }}
        onClick={handleProductClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Badges - Compact */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Quick Action Icons - Always Visible on Hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-1.5 rounded-full shadow-sm transition-colors ${
              isFavorited ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 hover:text-red-600'
            }`}
          >
            <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={() => setShowQuickView(true)}
            className="p-1.5 bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        {/* Stock Status - Bottom Left */}
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white shadow-sm ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>

      {/* Content Container - Compact */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand + Rating Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {product.brand}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Product Name - Compact */}
        <h3 
          className="font-semibold text-gray-900 mb-2 text-sm leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors cursor-pointer"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        {/* Category Chip - Smaller */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {product.category}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price Section - Enhanced */}
        <div className="mb-3">
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Always Visible Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2.5 px-4 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {!product.inStock ? (
            'Out of Stock'
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10.5" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 overflow-hidden" onClick={() => setShowQuickView(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {product.rating && (
                          <>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    {product.features && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 