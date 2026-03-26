import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Lock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService, type UserInfo } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import styles from './Profile.module.css';

const ProfilePrivacy: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUserInfo);
  }, []);

  const handleToggle = async (key: 'isProfilePublic' | 'darkTheme' | 'emailNotifications' | 'pushNotifications') => {
    if (!userInfo?.preferences) return;

    setLoading(true);
    try {
      const newPrefs = {
        ...userInfo.preferences,
        [key]: !userInfo.preferences[key as keyof typeof userInfo.preferences]
      };
      
      await authService.updatePreferences(newPrefs);
      setUserInfo({ ...userInfo, preferences: newPrefs });
      showToast('Paramètre mis à jour', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <DashboardLayout title="Confidentialité">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <button className={styles.backButton} onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h3>Paramètres de confidentialité</h3>
        </div>

        <div className={styles.settingsList}>
          <div className={styles.settingCard}>
            <div className={styles.settingInfo}>
              <div className={styles.settingHeader}>
                <Eye size={20} className={styles.settingIcon} />
                <h4>Profil public</h4>
              </div>
              <p>Permettre aux autres membres de voir mon humeur et mes badges.</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={userInfo.preferences?.isProfilePublic || false}
                onChange={() => handleToggle('isProfilePublic')}
                disabled={loading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingCard}>
            <div className={styles.settingInfo}>
              <div className={styles.settingHeader}>
                <Lock size={20} className={styles.settingIcon} />
                <h4>Partage de données</h4>
              </div>
              <p>Autoriser CesiZen à analyser mes données pour de la recherche (anonymisé).</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={true} // For demo, let's say this is static or another pref
                disabled={true}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePrivacy;
