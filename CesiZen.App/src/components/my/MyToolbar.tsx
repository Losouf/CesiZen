import React from 'react';
import { Search } from 'lucide-react';
import styles from './MyToolbar.module.css';

interface MyToolbarProps {
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

const MyToolbar: React.FC<MyToolbarProps> = ({
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Rechercher…',
  actions,
}) => {
  return (
    <div className={styles.toolbar}>
      {onSearch && (
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      )}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default MyToolbar;
