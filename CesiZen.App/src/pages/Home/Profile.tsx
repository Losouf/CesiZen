import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  LifeBuoy,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Clock,
  ShieldAlert
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService, type UserInfo } from '../../services/authService';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .catch(() => {
        // Fallback to logout if user cannot be fetched
        authService.logout();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const sections = [
    { title: "Informations personnelles", icon: User, color: "#3b82f6", path: "/profile/info" },
    { title: "Paramètres de confidentialité", icon: ShieldCheck, color: "#10b981", path: "/profile/privacy" },
    { title: "Notifications", icon: Bell, color: "#f59e0b", path: "/profile/notifications" },
    { title: "Aide & Support", icon: LifeBuoy, color: "#6366f1", path: "/profile/help" }
  ];

  if (!user) return null;

  return (
    <DashboardLayout 
      title="Mon Profil" 
      subtitle="Gérer vos paramètres et vos données"
    >
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user.displayName || user.username}</h2>
            <div className={styles.userBadge}>
              <Clock size={14} />
              <span>Membre actif</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionList}>
          {sections.map((section, index) => (
            <div
              key={index}
              className={styles.sectionItem}
              onClick={() => navigate(section.path)}
            >
              <div className={styles.iconWrapper} style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                <section.icon size={22} strokeWidth={2.5} />
              </div>
              <div className={styles.sectionInfo}>
                <h4>{section.title}</h4>
              </div>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          ))}

          <div
            className={styles.sectionItem}
            onClick={() => navigate('/admin')}
          >
            <div className={styles.iconWrapper} style={{ backgroundColor: '#e6394615', color: '#e63946' }}>
              <ShieldAlert size={22} strokeWidth={2.5} />
            </div>
            <div className={styles.sectionInfo}>
              <h4>Espace administrateur</h4>
            </div>
            <ChevronRight className={styles.chevron} size={20} />
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <LogOut size={20} strokeWidth={2.5} />
          <span>Déconnexion</span>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
