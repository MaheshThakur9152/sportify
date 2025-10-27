'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './Checkout.module.css';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    payment: 'card'
  });
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('sportifyCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order placement
    alert('Order placed successfully!');
    localStorage.removeItem('sportifyCart');
    router.push('/');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <Navbar />
        <div className={styles.checkoutContainer}>
          <p>Your bag is empty. <a href="/store">Continue shopping</a></p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <Navbar />
      <div className={styles.checkoutContainer}>
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address1"
            placeholder="Address Line 1"
            value={formData.address1}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address2"
            placeholder="Address Line 2"
            value={formData.address2}
            onChange={handleInputChange}
          />
          <div className={styles.formRow}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="pin"
              placeholder="PIN Code"
              value={formData.pin}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          
          <h3>Payment Method</h3>
          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={formData.payment === 'card'}
              onChange={handleInputChange}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={formData.payment === 'upi'}
              onChange={handleInputChange}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={formData.payment === 'cod'}
              onChange={handleInputChange}
            />
            Cash on Delivery
          </label>
        </form>
        
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className={styles.summaryItem}>
              <p>{item.name} (x{item.quantity})</p>
              <p>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
          <div className={styles.summaryTotals}>
            <p>Subtotal: ₹ {subtotal.toLocaleString('en-IN')}</p>
            <p>Shipping: ₹ {shipping.toLocaleString('en-IN')}</p>
            <h3>Total: ₹ {total.toLocaleString('en-IN')}</h3>
          </div>
          <button type="submit" className={styles.placeOrderButton} onClick={handleSubmit}>
            Place Order
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}