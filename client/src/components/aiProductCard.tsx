import React from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    shortDescription: string;
    features: string[];
  };
  onViewDetails?: (id: number) => void;
  onAddToCart?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.shortDescription}</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-500">⭐ {product.rating}</span>
          <span className="text-gray-500">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-3 text-lg font-medium">
          <span className="text-primary-600">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="line-through text-gray-400 text-sm">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="text-sm">
          {product.inStock ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        {product.features.length > 0 && (
          <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
            {product.features.slice(0, 4).map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product.id)}
              className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
            >
              Add to Cart
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(product.id)}
              className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
