import { useCart } from '../hooks/useCart';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', className: 'text-red-600' };
    if (product.stock < 10) return { text: 'Low Stock', className: 'text-yellow-600' };
    return { text: 'In Stock', className: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col shadow-sm">
      {/* Image Container with Fixed Height */}
      <div className="relative overflow-hidden bg-gray-50" style={{ height: '240px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-md bg-white shadow-sm ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Hover Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand Name - Reduced Size */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {product.brand}
          </span>
        </div>

        {/* Product Name - Enhanced Weight */}
        <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>

        {/* Category Chip - Left Aligned Under Product Name */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border">
            {product.category}
          </span>
        </div>

        {/* Spacer to push price to bottom */}
        <div className="flex-1"></div>

        {/* Price Section - Enhanced */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full mt-4 py-3 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 lg:opacity-100 group-hover:opacity-0 lg:group-hover:opacity-100"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
} 