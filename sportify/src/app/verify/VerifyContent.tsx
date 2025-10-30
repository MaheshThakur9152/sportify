'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../login/Login.module.css'; // Reuse styles

export default function VerifyContent() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      return;
    }

    fetch(`https://cp.cosinv.com/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setError('Verification failed');
        }
      })
      .catch(err => {
        setError('Error verifying email');
      });
  }, [token, router]);

  return (
    <div className={styles.loginPage}>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2>Email Verification</h2>
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}