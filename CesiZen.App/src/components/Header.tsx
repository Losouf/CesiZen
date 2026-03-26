import { motion, MotionValue, useTransform, useMotionValue } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
  greeting?: string;
  subtitle?: string;
  scrollProgress?: MotionValue<number>;
}

const BurgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle, greeting, subtitle, scrollProgress }) => {
  // Use scrollProgress to animate header properties if provided
  // Fallback to a zero-value MotionValue if not provided
  const fallbackScroll = useMotionValue(0);
  const progress = scrollProgress || fallbackScroll;

  // Animate header scale and padding
  const headerHeight = useTransform(progress, [0, 1], ['120px', '70px']);
  const greetingScale = useTransform(progress, [0, 1], [1, 0.85]);
  const subtitleOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const subtitleHeight = useTransform(progress, [0, 0.4], ['auto', '0px']);

  return (
    <motion.header 
      className={`${styles.header} ${greeting ? styles.dashboardHeader : ''}`}
      style={{ 
        height: headerHeight
      }}
    >
      <div className={styles.topBar}>
        {greeting && (
          <div className={styles.greetingSection}>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.greeting}
              style={{ scale: greetingScale, originX: 0 }}
            >
              {greeting}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.subtitle}
                style={{ 
                  opacity: subtitleOpacity, 
                  height: subtitleHeight, 
                  overflow: 'hidden',
                  marginBottom: 0
                }}
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
    </motion.header>
  );
};

export default Header;
