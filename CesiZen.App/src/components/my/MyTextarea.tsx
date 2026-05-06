import React from 'react';
import styles from './MyField.module.css';

interface MyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  help?: string;
}

const MyTextarea: React.FC<MyTextareaProps> = ({ label, error, help, required, id, className, ...props }) => {
  const fieldId = id || `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={fieldId} className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        className={`${styles.control} ${styles.textarea} ${className || ''}`}
        required={required}
        {...props}
      />
      {error && <div className={styles.error}>{error}</div>}
      {!error && help && <div className={styles.help}>{help}</div>}
    </div>
  );
};

export default MyTextarea;
