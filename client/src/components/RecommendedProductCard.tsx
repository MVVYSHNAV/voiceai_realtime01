// pages/RecommendedPage.tsx
import { useRecommendedProduct } from '../context/RecommendedContext';

export default function RecommendedPage() {
  const { recommendedProduct } = useRecommendedProduct();

  if (!recommendedProduct) {
    return (
      <div className="text-center text-gray-500 p-10">
        🕵️ No recommendation yet.<br />
        Try asking: <em>“Recommend a phone under 30,000 for travel.”</em>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{recommendedProduct.name}</h1>
      {recommendedProduct.image && (
        <img
          src={recommendedProduct.image}
          alt={recommendedProduct.name}
          className="w-full h-auto mb-4 rounded-lg border"
        />
      )}
      <p className="text-gray-700 mb-2">{recommendedProduct.description || 'No description available.'}</p>
      <p className="font-semibold">Brand: <span className="text-gray-800">{recommendedProduct.brand}</span></p>
      <p className="font-semibold">Category: <span className="text-gray-800">{recommendedProduct.category}</span></p>
      <p className="text-xl text-green-600 font-bold mt-2">₹{recommendedProduct.price.toLocaleString()}</p>
    </div>
  );
}
