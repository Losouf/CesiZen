import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, MotionValue, useTransform, animate } from 'framer-motion';
import { authService } from '../services/authService';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onClose: () => void;
  progress: MotionValue<number>;
}

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const JournalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

const ArticlesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const Sidebar: React.FC<SidebarProps> = ({ onClose, progress }) => {
  const navigate = useNavigate();
  
  // Link x position to progress (0 => 0%, 1 => 100%)
  const x = useTransform(progress, [0, 1], ['0%', '100%']);
  // Transform progress to overlay opacity (0 => 1, 1 => 0)
  const opacity = useTransform(progress, [0, 1], [1, 0]);
  // Helper to determine if we should allow clicks on the overlay
  const pointerEvents = useTransform(progress, (value: number) => value < 0.9 ? 'auto' : 'none');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      <motion.div 
        style={{ opacity, pointerEvents }}
        onClick={onClose}
        className={styles.drawerOverlay}
      />
      <motion.aside 
        style={{ x }}
        onPan={(_, info) => {
          // Convert pan offset to 0-1 progress (assuming 300px width)
          // info.offset.x is positive when moving right (closing)
          const newProgress = Math.min(1, Math.max(0, info.offset.x / 300));
          progress.set(newProgress);
        }}
        onPanEnd={(_, info) => {
          // If we panned more than half way closed or fast enough to the right
          if (progress.get() > 0.5 || info.velocity.x > 300) {
            onClose();
          } else {
            // Snap back to open if we didn't pan enough
            animate(progress, 0, { type: 'spring', stiffness: 400, damping: 40 });
          }
        }}
        className={styles.drawer}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <span>CesiZen</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" onClick={onClose} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <HomeIcon />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/journal" onClick={onClose} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <JournalIcon />
            <span>Journal</span>
          </NavLink>
          <NavLink to="/articles" onClick={onClose} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <ArticlesIcon />
            <span>Articles</span>
          </NavLink>
          <NavLink to="/profile" onClick={onClose} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <ProfileIcon />
            <span>Profil</span>
          </NavLink>
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogoutIcon />
            <span>Déconnexion</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
