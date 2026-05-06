import React from 'react';
import styles from './MyField.module.css';

interface Option {
  value: string | number;
  label: string;
}

interface MySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  help?: string;
  options: Option[];
  placeholder?: string;
}

const MySelect: React.FC<MySelectProps> = ({ label, error, help, options, placeholder, required, id, className, ...props }) => {
  const fieldId = id || `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={fieldId} className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <select
        id={fieldId}
        className={`${styles.control} ${className || ''}`}
        required={required}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <div className={styles.error}>{error}</div>}
      {!error && help && <div className={styles.help}>{help}</div>}
    </div>
  );
};

export default MySelect;
