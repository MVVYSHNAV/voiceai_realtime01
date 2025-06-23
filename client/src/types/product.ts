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
  description: string;
  features: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductData {
  products: Product[];
  categories: string[];
  brands: string[];
  sortOptions: SortOption[];
} 