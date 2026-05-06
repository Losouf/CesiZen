import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import styles from './MyAlert.module.css';

interface MyAlertProps {
  variant?: 'error' | 'success' | 'info' | 'warning';
  children: React.ReactNode;
}

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

const MyAlert: React.FC<MyAlertProps> = ({ variant = 'info', children }) => {
  const Icon = icons[variant];
  return (
    <div className={`${styles.alert} ${styles[variant]}`}>
      <Icon size={18} className={styles.icon} />
      <div>{children}</div>
    </div>
  );
};

export default MyAlert;
