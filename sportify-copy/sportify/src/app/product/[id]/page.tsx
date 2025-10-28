'use client';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import productsData from '../../../data/products.json';
import { Product } from '../../../types/product';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import styles from './product.module.css';

const products: Product[] = productsData as Product[];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.availableSizes[0] || '');
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.loading}>Loading product...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className={styles.error}>Product not found</div>
        <Footer />
      </div>
    );
  }

  const handleAddToBag = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const token = localStorage.getItem('sportifyToken');
    if (!token) {
      alert('Please login to add items to cart');
      router.push('/login');
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          size: selectedSize,
          color: product.colors[selectedColor].name,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        // Trigger event to update navbar
        window.dispatchEvent(new Event('cartUpdated'));

        // Show success message
        alert(`${product.name} added to cart!`);

        // Redirect to cart
        setTimeout(() => {
          router.push('/cart');
        }, 500);
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }

    setIsAdding(false);
  };

  const handleFavourite = () => {
    alert('Added to favourites');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.productPageContainer}>
        <div className={styles.thumbnails}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`View ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? styles.thumbnailActive : ""}
              style={{
                width: 80,
                height: 80,
                cursor: "pointer",
                border: selectedImage === index ? "2px solid #111" : "2px solid #eee",
                marginBottom: 12,
                objectFit: "cover"
              }}
            />
          ))}
        </div>

        <div className={styles.heroImageWrapper}>
          <img src={product.images[selectedImage]} alt={product.name} />
        </div>

        <div className={styles.productInfo}>
          <div>
            <p className={styles.brandName}>{product.brand}</p>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productCategory}>{product.category}</p>
          </div>

          <div className={styles.pricingSection}>
            <p className={styles.price}>MRP : ₹ {product.price.toLocaleString('en-IN')}</p>
            <p className={styles.taxInfo}>Inclusive of all taxes</p>
            <p className={styles.dutiesInfo}>(Also includes all applicable duties)</p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.colorSection}>
              <div className={styles.colorSwatches}>
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <h3 className={styles.sizeTitle}>Select Size</h3>
              <button className={styles.sizeGuideButton}>📏 Size Guide</button>
            </div>
            <p className={styles.sizeHint}>Fits small; we recommend ordering half a size up</p>
            <div className={styles.sizeGrid}>
              {product.sizes.map((size) => {
                const available = product.availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''} ${!available ? styles.disabled : ''}`}
                    onClick={() => available && setSelectedSize(size)}
                    disabled={!available}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className={styles.quantitySection}>
            <label>Quantity</label>
            <div className={styles.quantityControl}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={styles.addToCartButton}
            disabled={!selectedSize || isAdding}
            onClick={handleAddToBag}
          >
            {isAdding ? 'Adding...' : 'Add to Bag'}
          </button>

          <button className={styles.favouriteButton} onClick={handleFavourite}>
            Favourite ♡
          </button>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <p className={styles.description}>{product.description}</p>
            <ul className={styles.featuresList}>
              <li>Colour Shown: {product.colors?.[0]?.name || 'N/A'}</li>
              <li>Style: {product.sku}</li>
              <li>Country/Region of Origin: {product.origin}</li>
            </ul>
          </div>

          {/* Accordions */}
          <div className={styles.accordionContainer}>
            <Accordion title="View Product Details">
              <div>
                <p>Additional product details and specifications.</p>
                <ul>
                  <li>SKU: {product.sku}</li>
                  <li>Origin: {product.origin}</li>
                  <li>Type: {product.type}</li>
                </ul>
              </div>
            </Accordion>
            <Accordion title="Delivery & Returns">
              <div>
                <p>Free delivery on orders over ₹3,000.</p>
                <p>Easy returns within 30 days.</p>
                <p>Standard delivery: 3-5 business days.</p>
              </div>
            </Accordion>
            <Accordion title="Reviews (9)">
              <div>
                <p>Customer reviews and ratings.</p>
                <p>Average rating: 4.5/5</p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Accordion Component
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.accordion}>
      <button onClick={() => setOpen(!open)} className={styles.accordionButton}>
        {title}
        <span className={`${styles.accordionIcon} ${open ? styles.open : ''}`}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}