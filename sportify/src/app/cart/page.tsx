'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './Cart.module.css';

interface CartItem {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
  sku: string;
  allImages: string[];
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('sportifyCart') || '[]');
    setCartItems(cart);
    setLoading(false);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    const updated = cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );
    setCartItems(updated);
    localStorage.setItem('sportifyCart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (cartItemId: string) => {
    const updated = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updated);
    localStorage.setItem('sportifyCart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 200 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateTotals();

  if (loading) return <div className={styles.loading}>Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPageLayout}>
        <Navbar />
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add items to your cart</p>
          <Link href="/store" className={styles.continueShoppingBtn}>
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.cartPageLayout}>
      <Navbar />
      <h1 className={styles.cartTitle}>Bag</h1>
      
      <div className={styles.cartPanes}>
        {/* Left: Cart Items */}
        <section className={styles.cartItemsPane}>
          {cartItems.map(item => (
            <div key={item.cartItemId} className={styles.cartItem}>
              <img src={item.image} alt={item.name} />
              
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.category}>{item.category}</p>
                <p className={styles.size}>Size: {item.size}</p>
              </div>

              <div className={styles.itemActions}>
                <p className={styles.price}>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                </div>

                <button 
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Right: Summary */}
        <aside className={styles.cartSummaryPane}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹ {subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>₹ {shipping.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹ {total.toLocaleString('en-IN')}</span>
          </div>

          <button 
            className={styles.checkoutBtn}
            onClick={() => router.push('/checkout')}
          >
            Checkout
          </button>

          <Link href="/store" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </aside>
      </div>
      <Footer />
    </div>
  );
}