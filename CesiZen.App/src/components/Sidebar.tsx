import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, MotionValue, useTransform, animate } from 'framer-motion';
import {
  Home,
  BarChart2,
  BookOpen,
  User,
  LogOut,
  X,
  LayoutDashboard,
  Users as UsersIcon,
  Heart,
  FileText,
  Shield,
  Key
} from 'lucide-react';
import { authService } from '../services/authService';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onClose: () => void;
  progress: MotionValue<number>;
}

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

  const navItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/stats', icon: BarChart2, label: 'Suivi' },
    { to: '/articles', icon: BookOpen, label: 'Prévention' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const adminItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
    { to: '/admin/users', icon: UsersIcon, label: 'Utilisateurs' },
    { to: '/admin/roles', icon: Shield, label: 'Rôles' },
    { to: '/admin/permissions', icon: Key, label: 'Permissions' },
    { to: '/admin/emotions', icon: Heart, label: 'Émotions' },
    { to: '/admin/articles', icon: FileText, label: 'Articles' },
  ];

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
          const newProgress = Math.min(1, Math.max(0, info.offset.x / 300));
          progress.set(newProgress);
        }}
        onPanEnd={(_, info) => {
          if (progress.get() > 0.5 || info.velocity.x > 300) {
            onClose();
          } else {
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
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className={styles.sectionLabel}>Administration</div>
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={22} />
            <span>Déconnexion</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
