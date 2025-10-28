'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('sportifyToken');
    const user = JSON.parse(localStorage.getItem('sportifyUser') || 'null');
    setIsLoggedIn(!!token);
    if (user) setUserName(user.name || 'Account');

    // Update cart count
    const updateCart = async () => {
      const token = localStorage.getItem('sportifyToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/cart', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const total = data.reduce((sum: number, item: any) => sum + item.quantity, 0);
            setCartCount(total);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('authUpdated', updateCart);
    window.addEventListener('authUpdated', () => {
      const newToken = localStorage.getItem('sportifyToken');
      const newUser = JSON.parse(localStorage.getItem('sportifyUser') || 'null');
      setIsLoggedIn(!!newToken);
      if (newUser) setUserName(newUser.name || 'Account');
    });
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('authUpdated', () => {});
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('sportifyToken');
    localStorage.removeItem('sportifyUser');
    setIsLoggedIn(false);
    setShowAccountDropdown(false);
    window.dispatchEvent(new Event('authUpdated'));
    router.push('/');
  };

  const navLinks = [
    // { label: 'NEW & FEATURED', href: '/new-featured' },
    // { label: 'SHOP', href: '/shop' },
    { label: 'PRODUCTS', href: '/store' },
    // { label: 'CATEGORIES', href: '/categories' },
    // { label: 'SALE', href: '/sale' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          SPORTIFY
        </Link>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.active : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons & Auth */}
        <div className={styles.navRight}>
          {/* Search */}
          <Link href="/search" className={styles.navIcon} title="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </Link>

          {/* Favorites */}
          <Link href="/favorites" className={styles.navIcon} title="Favorites">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>

          {/* Cart */}
          <Link href="/cart" className={styles.cartWrapper} title="Bag">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className={styles.accountMenuWrapper}>
              <button 
                className={styles.accountBtn}
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                {userName}
              </button>
              {showAccountDropdown && (
                <div className={styles.dropdown}>
                  <Link href="/account" className={styles.dropdownItem}>
                    My Account
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem}>
                    Orders
                  </Link>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.signInBtn}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}