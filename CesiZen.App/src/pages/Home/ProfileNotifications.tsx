import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Smartphone } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService, type UserInfo } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import styles from './Profile.module.css';

const ProfileNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUserInfo);
  }, []);

  const handleToggle = async (key: 'emailNotifications' | 'pushNotifications') => {
    if (!userInfo?.preferences) return;

    setLoading(true);
    try {
      const newPrefs = {
        ...userInfo.preferences,
        [key]: !userInfo.preferences[key]
      };
      
      await authService.updatePreferences(newPrefs);
      setUserInfo({ ...userInfo, preferences: newPrefs });
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
              <p>Recevoir un récapitulatif hebdomadaire de votre bien-être.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.preferences?.emailNotifications || false} 
                onChange={() => handleToggle('emailNotifications')}
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
              <p>Rappels quotidiens pour vos séances de méditation.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.preferences?.pushNotifications || false}
                onChange={() => handleToggle('pushNotifications')}
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
