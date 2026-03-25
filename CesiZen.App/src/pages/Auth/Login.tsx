import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthLayout from './AuthLayout';
import styles from './Auth.module.css';

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10z"/><path d="m22 7-10 7L2 7"/></svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthLayout 
      title="CesiZen"
      subtitle="Connectez-vous pour retrouver votre sérénité."
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={styles.animateIn} style={{ animationDelay: '0.1s' }}>
          <Input 
            placeholder="E-mail ID" 
            type="email" 
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.2s' }}>
          <Input 
            placeholder="Password" 
            type="password" 
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className={styles.animateIn} style={{ animationDelay: '0.3s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</a>
        </div>

        <div className={styles.animateIn} style={{ animationDelay: '0.4s' }}>
          <Button type="submit">Login</Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
