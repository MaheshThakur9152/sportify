'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import productsData from '../../../data/products.json';
import { Product } from '../../../types/product';
import styles from './ProductDetail.module.css';

const products: Product[] = productsData as Product[];

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (product && product.availableSizes.length > 0) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAdding(true);

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('sportifyCart') || '[]');

    // Create unique ID for this product+size combination
    const cartItemId = `${product.id}_${selectedSize}`;

    // Check if this exact item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.cartItemId === cartItemId);

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // New item, add to cart
      const cartItem = {
        cartItemId,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: product.colors[selectedColor].name,
        quantity: quantity,
        category: product.category,
        sku: product.sku,
        allImages: product.images,
      };
      existingCart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('sportifyCart', JSON.stringify(existingCart));

    // Trigger event to update navbar
    window.dispatchEvent(new Event('cartUpdated'));

    // Show success message
    alert(`${product.name} added to cart!`);

    setIsAdding(false);

    // Redirect to cart
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const handleFavorite = () => {
    // TODO: Implement favorite functionality
    alert('Added to favorites');
  };

  return (
    <div className={styles.productDetail}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className={styles.image}
            />
          </div>
          <div className={styles.thumbnailGrid}>
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>₹{product.price.toLocaleString()}</p>

          <div className={styles.colors}>
            <h3>Colour Shown: {product.colors[selectedColor].name}</h3>
            <div className={styles.colorOptions}>
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`${styles.colorOption} ${selectedColor === index ? styles.active : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(index)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.sizes}>
            <h3>Select Size</h3>
            <div className={styles.sizeGrid}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ''} ${!product.availableSizes.includes(size) ? styles.unavailable : ''}`}
                  onClick={() => product.availableSizes.includes(size) && setSelectedSize(size)}
                  disabled={!product.availableSizes.includes(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.quantity}>
            <label htmlFor="quantity">Quantity:</label>
            <div className={styles.quantityControl}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.addToBag} onClick={handleAddToBag} disabled={!selectedSize || isAdding}>
              {isAdding ? 'Adding...' : 'Add to Bag'}
            </button>
            <button className={styles.favorite} onClick={handleFavorite}>
              ♡ Favorite
            </button>
          </div>

          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.details}>
            <h3>Product Details</h3>
            <ul>
              <li>SKU: {product.sku}</li>
              <li>Origin: {product.origin}</li>
              <li>Type: {product.type}</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
