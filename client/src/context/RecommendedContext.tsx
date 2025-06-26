// context/RecommendedContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../types/product';

interface RecommendedContextType {
  recommendedProduct: Product | null;
  setRecommendedProduct: (product: Product | null) => void;
}

const RecommendedContext = createContext<RecommendedContextType | undefined>(undefined);

export function RecommendedProvider({ children }: { children: ReactNode }) {
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  return (
    <RecommendedContext.Provider value={{ recommendedProduct, setRecommendedProduct }}>
      {children}
    </RecommendedContext.Provider>
  );
}

export const useRecommendedProduct = (): RecommendedContextType => {
  const context = useContext(RecommendedContext);
  if (!context) {
    throw new Error('useRecommendedProduct must be used within a RecommendedProvider');
  }
  return context;
};
