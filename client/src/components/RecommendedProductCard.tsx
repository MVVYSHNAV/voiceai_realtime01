// pages/RecommendedPage.tsx
import { useRecommendedProduct } from '../context/RecommendedContext';

export default function RecommendedPage() {
  const { recommendedProduct } = useRecommendedProduct();

  if (!recommendedProduct) {
    return (
      <div className="text-center text-gray-500 p-10">
        No recommendation yet. Ask something like “Recommend a phone.”
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{recommendedProduct.name}</h1>
      <img
        src={recommendedProduct.image}
        alt={recommendedProduct.name}
        className="w-full h-auto mb-4 rounded"
      />
      <p className="text-gray-700 mb-2">{recommendedProduct.description}</p>
      <p className="font-semibold">Brand: {recommendedProduct.brand}</p>
      <p className="font-semibold">Category: {recommendedProduct.category}</p>
      <p className="text-xl text-green-600 font-bold mt-2">₹{recommendedProduct.price}</p>
    </div>
  );
}
