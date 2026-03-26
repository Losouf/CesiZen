import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, AlignLeft, Calendar, Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authService, type UserInfo } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import styles from './Profile.module.css';

const ProfileInfo: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      setUser(u);
      setDisplayName(u.displayName || u.username);
      setBio(u.bio || '');
      setPhone(u.phone || '');
      setBirthDate(u.birthDate ? u.birthDate.split('T')[0] : '');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        displayName,
        bio,
        phone,
        birthDate: birthDate || undefined
      });
      showToast('Profil mis à jour avec succès !', 'success');
      navigate('/profile');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Infos personnelles">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <button className={styles.backButton} onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h3>Modifier mon profil</h3>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            label="Nom d'affichage" 
            placeholder="John Doe" 
            icon={<User size={20} />} 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Ma Bio</label>
            <div className={styles.textareaWrapper}>
              <AlignLeft className={styles.textIcon} size={20} />
              <textarea 
                placeholder="Racontez-nous un peu sur vous..." 
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <Input 
            label="Téléphone" 
            placeholder="06 12 34 56 78" 
            icon={<Phone size={20} />} 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input 
            label="Date de naissance" 
            type="date" 
            icon={<Calendar size={20} />} 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" disabled={loading}>
              <Save size={20} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfileInfo;
