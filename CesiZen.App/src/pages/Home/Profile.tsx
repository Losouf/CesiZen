import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Home.module.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const sections = [
    { title: "Informations personnelles", icon: "👤" },
    { title: "Paramètres de confidentialité", icon: "🔒" },
    { title: "Notifications", icon: "🔔" },
    { title: "Aide & Support", icon: "🎧" }
  ];

  return (
    <DashboardLayout 
      title="Mon Profil" 
      subtitle="Gérer vos paramètres et vos données"
    >
      <div className={styles.widgets}>
        <section className={styles.activityCard}>
          <div className={styles.widgetCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
                L
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Livio</h2>
                <p style={{ color: '#64748b' }}>Utilisateur Zen depuis Mars 2026</p>
              </div>
            </div>

            <div className={styles.activityList}>
              {sections.map((section, index) => (
                <div key={index} className={styles.activityItem} style={{ cursor: 'pointer' }}>
                  <div className={styles.activityIcon}>{section.icon}</div>
                  <div className={styles.activityInfo}>
                    <h4 style={{ margin: 0 }}>{section.title}</h4>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '1.25rem',
            borderRadius: '1rem',
            background: '#fee2e2',
            color: '#ef4444',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#fecaca')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#fee2e2')}
        >
          Déconnexion
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
