import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onFilterChange: (filters: {
    category: string;
    gender: string;
    kids: string;
    size: string;
    color: string;
    priceRange: string;
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    kids: false,
    size: false,
    color: false,
    price: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    category: 'ALL',
    gender: '',
    kids: '',
    size: '',
    color: '',
    priceRange: '',
  });

  useEffect(() => {
    // Initialize filters on mount
    onFilterChange({
      category: 'ALL',
      gender: '',
      kids: '',
      size: '',
      color: '',
      priceRange: '',
    });
  }, [onFilterChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <aside className={styles.sidebar}>
        <div className={styles.categories}>
          <h3>Categories</h3>
          <ul>
            {['ALL', 'FOOTBALL', 'SHOES', 'RACKETS', 'BAGS', 'BADMINTON', 'EQUIPMENT'].map(cat => (
              <li key={cat}>
                <button
                  className={selectedFilters.category === cat ? styles.active : ''}
                  onClick={() => handleFilterChange('category', cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterSection}>
            <button
              className={styles.filterHeader}
              onClick={() => toggleSection('gender')}
            >
              Gender {expandedSections.gender ? '−' : '+'}
            </button>
            {expandedSections.gender && (
              <div className={styles.filterOptions}>
                {['Men', 'Women', 'Unisex'].map(gender => (
                  <label key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender.toLowerCase()}
                      checked={selectedFilters.gender === gender.toLowerCase()}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                    />
                    {gender}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.filterHeader}
              onClick={() => toggleSection('kids')}
            >
              Kids {expandedSections.kids ? '−' : '+'}
            </button>
            {expandedSections.kids && (
              <div className={styles.filterOptions}>
                <label>
                  <input
                    type="radio"
                    name="kids"
                    value="boys"
                    checked={selectedFilters.kids === 'boys'}
                    onChange={(e) => handleFilterChange('kids', e.target.value)}
                  />
                  Boys
                </label>
                <label>
                  <input
                    type="radio"
                    name="kids"
                    value="girls"
                    checked={selectedFilters.kids === 'girls'}
                    onChange={(e) => handleFilterChange('kids', e.target.value)}
                  />
                  Girls
                </label>
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.filterHeader}
              onClick={() => toggleSection('size')}
            >
              Size {expandedSections.size ? '−' : '+'}
            </button>
            {expandedSections.size && (
              <div className={styles.filterOptions}>
                {['S', 'M', 'L', 'XL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'].map(size => (
                  <label key={size}>
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedFilters.size === size}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.filterHeader}
              onClick={() => toggleSection('color')}
            >
              Color {expandedSections.color ? '−' : '+'}
            </button>
            {expandedSections.color && (
              <div className={styles.filterOptions}>
                {['Black', 'White', 'Grey', 'Blue', 'Red'].map(color => (
                  <label key={color}>
                    <input
                      type="radio"
                      name="color"
                      value={color.toLowerCase()}
                      checked={selectedFilters.color === color.toLowerCase()}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                    />
                    {color}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.filterSection}>
            <button
              className={styles.filterHeader}
              onClick={() => toggleSection('price')}
            >
              Price Range {expandedSections.price ? '−' : '+'}
            </button>
            {expandedSections.price && (
              <div className={styles.filterOptions}>
                {['Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹20,000', 'Over ₹20,000'].map(range => (
                  <label key={range}>
                    <input
                      type="radio"
                      name="price"
                      value={range}
                      checked={selectedFilters.priceRange === range}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    />
                    {range}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
  );
}