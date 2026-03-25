import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';
import { authService } from '../../services/authService';

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10z"/><path d="m22 7-10 7L2 7"/></svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authService.register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account"
      subtitle="Sign up to enjoy the best managing experience"
    >
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <div className={styles.animateIn} style={{ animationDelay: '0.1s' }}>
          <Input 
            placeholder="Full Name" 
            type="text" 
            icon={<UserIcon />}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.15s' }}>
          <Input 
            placeholder="Email-ID" 
            type="email" 
            icon={<MailIcon />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.2s' }}>
          <Input 
            placeholder="Password" 
            type="password" 
            icon={<LockIcon />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.25s' }}>
          <Input 
            placeholder="Confirm Password" 
            type="password" 
            icon={<LockIcon />}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.3s' }}>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
