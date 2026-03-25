import { motion, MotionValue } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
  drawerProgress: MotionValue<number>;
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

const Header: React.FC<HeaderProps> = ({ onMenuToggle, drawerProgress, greeting, subtitle }) => {
  return (
    <header className={`${styles.header} ${greeting ? styles.dashboardHeader : ''}`}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#header-logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="header-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className={styles.logoText}>CesiZen</span>
        </div>

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

      {/* Edge Trigger with manual pan for real progressive opening */}
      <motion.div 
        className={styles.edgeTrigger}
        onPan={(_, info) => {
          // info.offset.x is negative when moving left. 
          // We want progress to go from 1 (closed) towards 0 (open).
          const progress = Math.min(1, Math.max(0, 1 + info.offset.x / 300));
          drawerProgress.set(progress);
        }}
        onPanEnd={(_, info) => {
          // If we dragged more than half way (progress < 0.5) or fast enough
          if (drawerProgress.get() < 0.5 || info.velocity.x < -300) {
            onMenuToggle(); 
          } else {
            // Otherwise snap back to closed
            drawerProgress.set(1);
          }
        }}
      />
    </header>
  );
};

export default Header;
