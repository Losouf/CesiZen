import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Smartphone } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService, type UserInfo, type UserNotification } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import styles from './Profile.module.css';

const ProfileNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u && !u.notifications) {
        u.notifications = { emailEnabled: true, pushEnabled: true, weeklySummary: true };
      }
      setUserInfo(u);
    });
  }, []);

  const handleToggle = async (key: keyof UserNotification) => {
    if (!userInfo?.notifications) return;

    setLoading(true);
    try {
      const newNotifications = {
        ...userInfo.notifications,
        [key]: !userInfo.notifications[key]
      };
      
      await authService.updateNotifications(newNotifications);
      setUserInfo({ ...userInfo, notifications: newNotifications });
      showToast('Préférence mise à jour', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <DashboardLayout title="Notifications">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <button className={styles.backButton} onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h3>Gérer les notifications</h3>
        </div>

        <div className={styles.settingsList}>
          <div className={styles.settingCard}>
            <div className={styles.settingInfo}>
              <div className={styles.settingHeader}>
                <Mail size={20} className={styles.settingIcon} />
                <h4>Alertes par Email</h4>
              </div>
              <p>Recevoir les notifications importantes par courriel.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.notifications?.emailEnabled || false} 
                onChange={() => handleToggle('emailEnabled')}
                disabled={loading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingCard}>
            <div className={styles.settingInfo}>
              <div className={styles.settingHeader}>
                <Smartphone size={20} className={styles.settingIcon} />
                <h4>Notifications Push</h4>
              </div>
              <p>Rappels quotidiens sur votre mobile.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.notifications?.pushEnabled || false}
                onChange={() => handleToggle('pushEnabled')}
                disabled={loading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingCard}>
            <div className={styles.settingInfo}>
              <div className={styles.settingHeader}>
                <Mail size={20} className={styles.settingIcon} />
                <h4>Récapitulatif Hebdomadaire</h4>
              </div>
              <p>Un bilan de votre bien-être chaque lundi matin.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.notifications?.weeklySummary || false}
                onChange={() => handleToggle('weeklySummary')}
                disabled={loading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileNotifications;
