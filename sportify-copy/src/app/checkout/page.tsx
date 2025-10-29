'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/product';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './Checkout.module.css';

interface CartItem {
  cartItemId: string;
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  category: string;
  sku: string;
  allImages: string[];
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pin: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('sportifyToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch products
        const productsResponse = await fetch('http://210.79.128.175:5000/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch cart
        const cartResponse = await fetch('http://210.79.128.175:5000/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (cartResponse.ok) {
          const data = await cartResponse.json();
          // Map to include product details
          const cartWithDetails = data.map((item: any) => {
            const product = productsData.find((p: any) => p.id === item.product_id);
            return {
              cartItemId: item.id,
              id: item.product_id,
              name: product?.name || 'Unknown Product',
              price: product?.price || 0,
              image: product?.images ? product.images[0] : '',
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              category: product?.category || '',
              sku: product?.sku || '',
              allImages: product?.images || [],
            };
          });
          setCart(cartWithDetails);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setCart([]);
      }
    };

    loadData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setPaymentProcessing(true);

    try {
      const token = localStorage.getItem('sportifyToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Create order
      const response = await fetch('http://210.79.128.175:5000/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          payment_method: paymentMethod
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        // Cart is already cleared by backend
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/orders');
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please check your connection.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ['email', 'name', 'address1', 'city', 'state', 'pin', 'phone'];
    return requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
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
        <div className={styles.checkoutForm}>
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
          <div className={styles.paymentSection}>
            <div className={styles.paymentOptions}>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI</span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Net Banking</span>
              </label>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={paymentProcessing}
              className={styles.placeOrderButton}
            >
              {paymentProcessing ? 'Processing...' : `Place Order - ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>
          
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}