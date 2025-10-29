'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product } from '../../types/product';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';
import styles from './Store.module.css';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'ALL',
    gender: '',
    kids: '',
    size: '',
    color: '',
    priceRange: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        // Ensure filters are set to show all products
        setFilters({
          category: 'ALL',
          gender: '',
          kids: '',
          size: '',
          color: '',
          priceRange: '',
        });
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

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
        if (filters.category === 'FOOTBALL' && !product.category.toLowerCase().includes('football')) return false;
        if (filters.category === 'RACKETS' && !product.category.toLowerCase().includes('racket')) return false;
        if (filters.category === 'BAGS' && !product.category.toLowerCase().includes('bag')) return false;
        if (filters.category === 'BADMINTON' && !product.category.toLowerCase().includes('badminton')) return false;
        if (filters.category === 'EQUIPMENT' && !product.category.toLowerCase().includes('equipment')) return false;
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

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className={styles.store}>
      <Navbar />
      <div className={styles.heroBanner} onClick={() => setModalOpen(true)}>
        <img 
          src="/front-page/lebron-james.avif" 
          alt="Lebron James" 
          className={styles.bannerImage}
        />
        <h1 className={styles.bannerText}>JUST DO IT</h1>
      </div>
      <div className={styles.storePageContainer}>
        <aside className={styles.sidebar}>
          <Sidebar onFilterChange={handleFilterChange} />
        </aside>
        <main className={styles.productGrid}>
          {loading ? (
            <div>Loading products...</div>
          ) : (
            <>
              {filteredAndSortedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {filteredAndSortedProducts.length === 0 && (
                <div>No products found matching your criteria.</div>
              )}
            </>
          )}
        </main>
      </div>
      {modalOpen && (
        <div className={styles.modal} onClick={() => setModalOpen(false)}>
          <img src="/front-page/lebron-james.avif" alt="Lebron James Banner" className={styles.modalImage} />
        </div>
      )}
      <Footer />
    </div>
  );
}