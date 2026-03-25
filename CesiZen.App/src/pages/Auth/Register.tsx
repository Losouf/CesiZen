import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';

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
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <AuthLayout 
      title="CesiZen"
      subtitle="Créez votre compte et commencez votre voyage."
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={styles.animateIn} style={{ animationDelay: '0.1s' }}>
          <Input 
            placeholder="Full Name" 
            type="text" 
            icon={<UserIcon />}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.15s' }}>
          <Input 
            placeholder="Email-ID" 
            type="email" 
            icon={<MailIcon />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.2s' }}>
          <Input 
            placeholder="Password" 
            type="password" 
            icon={<LockIcon />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.25s' }}>
          <Input 
            placeholder="Confirm Password" 
            type="password" 
            icon={<LockIcon />}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.3s' }}>
          <Button type="submit">Register</Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
