import React from 'react';
import styles from './MyField.module.css';

interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
}

const MyInput: React.FC<MyInputProps> = ({ label, error, help, required, id, className, ...props }) => {
  const fieldId = id || `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={fieldId} className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className={`${styles.control} ${className || ''}`}
        required={required}
        {...props}
      />
      {error && <div className={styles.error}>{error}</div>}
      {!error && help && <div className={styles.help}>{help}</div>}
    </div>
  );
};

export default MyInput;
