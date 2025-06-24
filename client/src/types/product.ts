export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
  stockCount?: number;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface ProductData {
  products: Product[];
  categories: string[];
  brands: string[];
} 