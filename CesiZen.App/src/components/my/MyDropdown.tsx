import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './MyDropdown.module.css';

export interface MyDropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface MyDropdownProps {
  label?: string;
  value: string | number | '';
  onChange: (value: string) => void;
  options: MyDropdownOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  emptyMessage?: string;
}

const MyDropdown: React.FC<MyDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Sélectionner…',
  required,
  disabled,
  error,
  help,
  emptyMessage = 'Aucune option disponible',
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex(o => String(o.value) === String(value));
      setHighlighted(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  const select = (opt: MyDropdownOption) => {
    onChange(String(opt.value));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (options[highlighted]) select(options[highlighted]);
    }
  };

  return (
    <div className={styles.field} ref={containerRef}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`${styles.value} ${!selected ? styles.placeholder : ''}`}>
          {selected ? (
            <>
              {selected.icon}
              {selected.label}
            </>
          ) : placeholder}
        </span>
        <ChevronDown size={18} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.menu} role="listbox">
          {options.length === 0 ? (
            <div className={styles.empty}>{emptyMessage}</div>
          ) : (
            options.map((opt, i) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = i === highlighted;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${isHighlighted ? styles.optionHighlighted : ''}`}
                  onClick={() => select(opt)}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <span className={styles.value}>
                    {opt.icon}
                    {opt.label}
                  </span>
                  {isSelected && <Check size={16} className={styles.check} strokeWidth={3} />}
                </button>
              );
            })
          )}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
      {!error && help && <div className={styles.help}>{help}</div>}
    </div>
  );
};

export default MyDropdown;
