import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      <Link href={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={500}
            className={styles.productImage}
            priority={false}
          />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productCategory}>{product.category}</p>
          <p className={styles.productPrice}>₹ {product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  );
}