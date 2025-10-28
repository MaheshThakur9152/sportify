export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  type: 'shoes' | 'clothing' | 'equipment';
  price: number;
  currency: string;
  description: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  availableSizes: string[];
  sku: string;
  origin: string;
}