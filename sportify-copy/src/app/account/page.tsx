'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../login/Login.module.css';

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('sportifyToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://210.79.128.175:5000/account', {
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
          throw new Error('Failed to fetch account');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
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
          <h2>My Account</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}