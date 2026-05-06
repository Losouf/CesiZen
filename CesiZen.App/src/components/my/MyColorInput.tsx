import React from 'react';
import styles from './MyField.module.css';

interface MyColorInputProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  required?: boolean;
}

const MyColorInput: React.FC<MyColorInputProps> = ({ label, value, onChange, required }) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>
      )}
      <div className={styles.colorRow}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <input
          type="text"
          className={styles.control}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#FFD93D"
        />
      </div>
    </div>
  );
};

export default MyColorInput;
