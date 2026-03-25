import { motion } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
  greeting?: string;
  subtitle?: string;
}

const BurgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle, greeting, subtitle }) => {
  return (
    <header className={`${styles.header} ${greeting ? styles.dashboardHeader : ''}`}>
      <div className={styles.topBar}>
        {greeting && (
          <div className={styles.greetingSection}>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.greeting}
            >
              {greeting}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.subtitle}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        <button 
          className={styles.burgerButton} 
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle();
          }} 
          aria-label="Menu"
        >
          <BurgerIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
