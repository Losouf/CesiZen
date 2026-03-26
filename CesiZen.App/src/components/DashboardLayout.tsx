import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValue, animate } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';
import { authService, type UserInfo } from '../services/authService';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  showGreeting = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const drawerProgress = useMotionValue(1); // 1 = closed, 0 = open
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize isMenuOpen with drawerProgress animation
  useEffect(() => {
    animate(drawerProgress, isMenuOpen ? 0 : 1, {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      restDelta: 0.001
    });
  }, [isMenuOpen, drawerProgress]);

  // Fetch real user info
  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .catch(() => {
        // If fetch fails (e.g. invalid token), user stays null or could redirect to login
      });
  }, []);

  // Track scroll inside the cardContent container
  const { scrollY } = useScroll({
    container: containerRef
  });

  // Calculate header shrinkage progress (0 to 1) over first 100px of scroll
  const headerScrollProgress = useMotionValue(0);
  useEffect(() => {
    return scrollY.on('change', (y) => {
      headerScrollProgress.set(Math.min(1, y / 100));
    });
  }, [scrollY, headerScrollProgress]);

  const username = user?.displayName || user?.username || "...";
  const greetingText = showGreeting ? `Bon retour, ${username}` : (title || "CesiZen");

  return (
    <div className={styles.layout}>
      {/* Background Animated Orbs */}
      <div className={styles.bgAnimation}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
      </div>

      <Header 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        greeting={greetingText}
        subtitle={subtitle}
        scrollProgress={headerScrollProgress}
      />
      
      <Sidebar 
        onClose={() => setIsMenuOpen(false)}
        progress={drawerProgress}
      />

      <main className={styles.cardContent} ref={containerRef}>
        {children}
      </main>

      {/* Unified Interaction Layer: Swipe (everywhere) and Tap (top right) */}
      <motion.div 
        className={styles.edgeTrigger}
        onPan={(_, info) => {
          const progress = Math.min(1, Math.max(0, 1 + info.offset.x / 300));
          drawerProgress.set(progress);
        }}
        onPanEnd={(_, info) => {
          if (info.offset.x > 150 || info.velocity.x > 500) {
            setIsMenuOpen(false);
            drawerProgress.set(1);
          } else if (info.offset.x < -150 || info.velocity.x < -500) {
            setIsMenuOpen(true);
            drawerProgress.set(0);
          } else {
            drawerProgress.set(isMenuOpen ? 0 : 1);
          }
        }}
      />
    </div>
  );
};

export default DashboardLayout;
