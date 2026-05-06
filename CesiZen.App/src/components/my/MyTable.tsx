import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './MyTable.module.css';

export interface MyTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface MyTableProps<T> {
  columns: MyTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

function MyTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyMessage = 'Aucun élément à afficher',
  onEdit,
  onDelete,
}: MyTableProps<T>) {
  const hasActions = onEdit || onDelete;

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}><div className={styles.spinner} /></div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {rows.length === 0 ? (
        <div className={styles.empty}>{emptyMessage}</div>
      ) : (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={c.key} style={{ width: c.width }}>{c.header}</th>
                ))}
                {hasActions && <th style={{ width: 100, textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={rowKey(row)}>
                  {columns.map(c => (
                    <td key={c.key}>
                      {c.render ? c.render(row) : (row as any)[c.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className={styles.actions}>
                        {onEdit && (
                          <button
                            className={styles.iconBtn}
                            onClick={() => onEdit(row)}
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => onDelete(row)}
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyTable;
