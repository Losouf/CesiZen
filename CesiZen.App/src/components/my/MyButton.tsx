import React from 'react';
import styles from './MyButton.module.css';

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[`size_${size}`]} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default MyButton;
