'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../login/Login.module.css';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  brand: string;
  images: string[];
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  email: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  payment_method: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{[key: number]: OrderItem[]}>({});
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
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

  const toggleOrderExpansion = async (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      
      // Fetch order items if not already loaded
      if (!orderItems[orderId]) {
        try {
          const token = localStorage.getItem('sportifyToken');
          const response = await fetch(`http://localhost:5000/orders/${orderId}/items`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const items = await response.json();
            setOrderItems(prev => ({ ...prev, [orderId]: items }));
          }
        } catch (error) {
          console.error('Error fetching order items:', error);
        }
      }
    }
    
    setExpandedOrders(newExpanded);
  };

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
              <div key={order.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '15px 0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Order #{order.id}</h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: order.status === 'pending' ? '#fff3cd' : '#d4edda',
                      color: order.status === 'pending' ? '#856404' : '#155724'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleOrderExpansion(order.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #007bff',
                    color: '#007bff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '10px'
                  }}
                >
                  {expandedOrders.has(order.id) ? 'Hide Details' : 'Show Details'}
                </button>

                {expandedOrders.has(order.id) && (
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    {/* Order Items */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Order Items</h4>
                      {orderItems[order.id] ? (
                        orderItems[order.id].map(item => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
                            />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.brand} {item.name}</p>
                              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                                Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN')} = ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Loading items...</p>
                      )}
                    </div>

                    {/* Shipping Information */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Shipping Information</h4>
                      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Name:</strong> {order.name || 'N/A'}</p>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Email:</strong> {order.email || 'N/A'}</p>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Phone:</strong> {order.phone || 'N/A'}</p>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Address:</strong> {order.address1 || 'N/A'}</p>
                        {order.address2 && <p style={{ margin: '0 0 5px 0' }}><strong>Address 2:</strong> {order.address2}</p>}
                        <p style={{ margin: '0 0 5px 0' }}><strong>City:</strong> {order.city || 'N/A'}, {order.state || 'N/A'} {order.pin || 'N/A'}</p>
                        <p style={{ margin: '0' }}><strong>Payment Method:</strong> {order.payment_method ? order.payment_method.toUpperCase() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}