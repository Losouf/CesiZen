import React from 'react';
import styles from './MyPageHeader.module.css';

interface MyPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const MyPageHeader: React.FC<MyPageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};

export default MyPageHeader;
