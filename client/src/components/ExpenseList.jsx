import { useState } from 'react';
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_COLORS } from '../utils/api';
import ExpenseForm from './ExpenseForm';
import styles from './ExpenseList.module.css';

const CAT_ICONS = {
  Food: '🍜', Transport: '🚌', Bills: '⚡', Entertainment: '🎬', Other: '📦',
};

export default function ExpenseList({ expenses, loading, onEdit, onDelete, editLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function handleEditSubmit(id, data) {
    onEdit(id, data);
    setEditingId(null);
  }

  if (loading) {
    return (
      <div className={styles.list}>
        {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>💸</div>
        <h3>No expenses yet</h3>
        <p>Add your first expense using the form above.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {expenses.map((exp) => {
        const isEditing = editingId === exp.id;
        const isConfirming = confirmDeleteId === exp.id;

        return (
          <div key={exp.id} className={styles.item}>
            {isEditing ? (
              <div className={styles.editWrap}>
                <ExpenseForm
                  initial={{ amount: exp.amount, category: exp.category, date: exp.date, note: exp.note }}
                  onSubmit={(data) => handleEditSubmit(exp.id, data)}
                  onCancel={() => setEditingId(null)}
                  loading={editLoading}
                />
              </div>
            ) : (
              <>
                <div className={styles.catDot} style={{ background: CATEGORY_COLORS[exp.category] }} />
                <div className={styles.catIconWrap}>
                  <span>{CAT_ICONS[exp.category]}</span>
                </div>
                <div className={styles.details}>
                  <div className={styles.topRow}>
                    <span className={styles.note}>{exp.note || exp.category}</span>
                    <span className={styles.amount}>{formatCurrency(exp.amount)}</span>
                  </div>
                  <div className={styles.meta}>
                    <span
                      className={styles.catTag}
                      style={{
                        color: CATEGORY_COLORS[exp.category],
                        background: CATEGORY_COLORS[exp.category] + '18',
                      }}
                    >
                      {exp.category}
                    </span>
                    <span className={styles.date}>{formatDate(exp.date)}</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  {isConfirming ? (
                    <div className={styles.confirmWrap}>
                      <span className={styles.confirmText}>Delete?</span>
                      <button
                        className={styles.confirmYes}
                        onClick={() => { onDelete(exp.id); setConfirmDeleteId(null); }}
                      >Yes</button>
                      <button
                        className={styles.confirmNo}
                        onClick={() => setConfirmDeleteId(null)}
                      >No</button>
                    </div>
                  ) : (
                    <>
                      <button className={styles.editBtn} onClick={() => setEditingId(exp.id)}>Edit</button>
                      <button className={styles.delBtn} onClick={() => setConfirmDeleteId(exp.id)}>✕</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
