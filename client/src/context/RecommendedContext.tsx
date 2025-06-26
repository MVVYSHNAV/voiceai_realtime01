// context/RecommendedContext.tsx
import { createContext, useContext, useState } from 'react';
import type { Product } from '../types/product';

const RecommendedContext = createContext<any>(null);

export function RecommendedProvider({ children }: { children: React.ReactNode }) {
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  return (
    <RecommendedContext.Provider value={{ recommendedProduct, setRecommendedProduct }}>
      {children}
    </RecommendedContext.Provider>
  );
}

export const useRecommendedProduct = () => useContext(RecommendedContext);
