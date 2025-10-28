'use client';

import { useEffect } from 'react';
import styles from './ProductModal.module.css';

interface Product {
  image: string;
  name: string;
  price: string;
  description: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.content}>
          <img src={product.image} alt={product.name} className={styles.image} />
          <div className={styles.details}>
            <h2 className={styles.name}>{product.name}</h2>
            <p className={styles.price}>{product.price}</p>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}