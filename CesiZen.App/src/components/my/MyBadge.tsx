import React from 'react';
import styles from './MyBadge.module.css';

interface MyBadgeProps {
  color?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'violet';
  children: React.ReactNode;
}

const MyBadge: React.FC<MyBadgeProps> = ({ color = 'slate', children }) => {
  return <span className={`${styles.badge} ${styles[color]}`}>{children}</span>;
};

export default MyBadge;
