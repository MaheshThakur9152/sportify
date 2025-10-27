import { useState, useMemo } from 'react';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  filters: {
    category: string;
    gender: string;
    kids: string;
    size: string;
    color: string;
    priceRange: string;
  };
  searchQuery: string;
  sortBy: string;
}

export default function ProductGrid({ products, filters, searchQuery, sortBy }: ProductGridProps) {
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      // Search
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category
      if (filters.category !== 'ALL') {
        if (filters.category === 'SHOES' && product.type !== 'shoes') return false;
        // Add more category mappings as needed
      }

      // Gender
      if (filters.gender && !product.category.toLowerCase().includes(filters.gender)) return false;

      // Kids
      if (filters.kids && !product.category.toLowerCase().includes('kids')) return false;

      // Size
      if (filters.size && !product.availableSizes.includes(filters.size)) return false;

      // Color - simplified, check if any color name matches
      if (filters.color && !product.colors.some((c: any) => c.name.toLowerCase().includes(filters.color))) return false;

      // Price Range
      if (filters.priceRange) {
        const price = product.price;
        if (filters.priceRange === 'Under ₹5,000' && price >= 5000) return false;
        if (filters.priceRange === '₹5,000 - ₹10,000' && (price < 5000 || price > 10000)) return false;
        if (filters.priceRange === '₹10,000 - ₹20,000' && (price < 10000 || price > 20000)) return false;
        if (filters.priceRange === 'Over ₹20,000' && price <= 20000) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.id.localeCompare(a.id); // Assuming ID indicates recency
        default: // featured
          return 0;
      }
    });

    return filtered;
  }, [filters, searchQuery, sortBy]);

  return (
    <div className={styles.grid}>
      {filteredAndSortedProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {filteredAndSortedProducts.length === 0 && (
        <div className={styles.noResults}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}