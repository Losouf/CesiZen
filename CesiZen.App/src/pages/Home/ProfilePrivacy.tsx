import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Lock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService, type UserInfo, type UserPrivacy } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import styles from './Profile.module.css';

const ProfilePrivacy: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u && !u.privacy) {
        u.privacy = { isProfilePublic: false, dataSharingConsent: true };
      }
      setUserInfo(u);
    });
  }, []);

  const handleToggle = async (key: keyof UserPrivacy) => {
    if (!userInfo?.privacy) return;

    setLoading(true);
    try {
      const newPrivacy = {
        ...userInfo.privacy,
        [key]: !userInfo.privacy[key]
      };
      
      await authService.updatePrivacy(newPrivacy);
      setUserInfo({ ...userInfo, privacy: newPrivacy });
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
                checked={userInfo.privacy?.isProfilePublic || false}
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
                checked={userInfo.privacy?.dataSharingConsent || false}
                onChange={() => handleToggle('dataSharingConsent')}
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

export default ProfilePrivacy;
