import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AuthLayout.module.css';
import authStyles from './Auth.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className={styles.layout}>
      {/* Background Animated Orbs */}
      <div className={styles.bgAnimation}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
      </div>

      <div className={styles.header}>
        <h1 className={authStyles.title}>{title}</h1>
        <p className={authStyles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.card}>
        <div className={`${styles.toggleWrapper} ${authStyles.animateIn}`} style={{ animationDelay: '0.05s' }}>
          <button 
            className={`${styles.toggleButton} ${isLogin ? styles.activeToggle : ''}`}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className={`${styles.toggleButton} ${!isLogin ? styles.activeToggle : ''}`}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
