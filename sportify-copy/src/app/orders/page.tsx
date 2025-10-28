'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../login/Login.module.css';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('sportifyToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:5000/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('sportifyToken');
            localStorage.removeItem('sportifyUser');
            router.push('/login');
            throw new Error('Unauthorized');
          }
          throw new Error('Failed to fetch orders');
        }
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.message !== 'Unauthorized') {
          setError(err.message);
        }
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div className={styles.loginPage}>
    <Navbar />
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    </div>
    <Footer />
  </div>;

  return (
    <div className={styles.loginPage}>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2>My Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}