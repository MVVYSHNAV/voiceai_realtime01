export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  stock?: number;
  releaseDate?: string;
  description: string;
  features: string[];
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductData {
  products: Product[];
  categories: string[];
  brands: string[];
} 