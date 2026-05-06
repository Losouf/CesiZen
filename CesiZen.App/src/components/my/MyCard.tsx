import React from 'react';
import styles from './MyCard.module.css';

interface MyCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'compact' | 'flush';
  className?: string;
  style?: React.CSSProperties;
}

const MyCard: React.FC<MyCardProps> = ({ children, title, subtitle, action, variant = 'default', className, style }) => {
  const variantClass = variant === 'compact' ? styles.compact : variant === 'flush' ? styles.flush : '';
  return (
    <div className={`${styles.card} ${variantClass} ${className || ''}`} style={style}>
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default MyCard;
