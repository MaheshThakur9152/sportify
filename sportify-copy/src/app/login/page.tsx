'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './Login.module.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await fetch('http://210.79.128.175:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('sportifyToken', data.token);
        localStorage.setItem('sportifyUser', JSON.stringify({ email: formData.email, name: formData.name || 'User' }));
        window.dispatchEvent(new Event('authUpdated'));
        router.push('/');
      } else {
        // Signup
        const response = await fetch('http://210.79.128.175:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }

        const data = await response.json();
        alert(data.message);
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}