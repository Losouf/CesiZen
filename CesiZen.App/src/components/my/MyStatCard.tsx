import React from 'react';
import styles from './MyStatCard.module.css';

interface MyStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const MyStatCard: React.FC<MyStatCardProps> = ({ label, value, icon, color = '#3b82f6' }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
};

export default MyStatCard;
