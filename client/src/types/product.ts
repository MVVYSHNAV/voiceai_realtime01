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

export interface ToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolHandler {
  execute: (params: any) => Promise<any>;
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
  price: number;
  quantity: number;
  image?: string;
}


export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface ProductData {
  products: Product[];
  categories: string[];
  brands: string[];
} 