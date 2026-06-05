import { useState, useEffect } from 'react';
import { CATEGORIES, formatCurrency } from '../utils/api';
import styles from './ExpenseForm.module.css';

const today = new Date().toISOString().split('T')[0];

const EMPTY = { amount: '', category: '', date: today, note: '' };

export default function ExpenseForm({ onSubmit, onCancel, initial = null, loading }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  function validate() {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a positive amount';
    if (!form.category) e.category = 'Select a category';
    if (!form.date) e.date = 'Date is required';
    else if (form.date > today) e.date = 'Date cannot be in the future';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    onSubmit({ ...form, amount: Number(form.amount) });
  }

  function set(field) {
    return (ev) => {
      setForm((f) => ({ ...f, [field]: ev.target.value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Amount (₹) *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={set('amount')}
          />
          {errors.amount && <span className={styles.err}>{errors.amount}</span>}
        </div>

        <div className={styles.field}>
          <label>Category *</label>
          <select value={form.category} onChange={set('category')}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <span className={styles.err}>{errors.category}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Date *</label>
          <input type="date" max={today} value={form.date} onChange={set('date')} />
          {errors.date && <span className={styles.err}>{errors.date}</span>}
        </div>

        <div className={styles.field}>
          <label>Note (optional)</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={form.note}
            onChange={set('note')}
            maxLength={200}
          />
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save Changes' : '+ Add Expense'}
        </button>
      </div>
    </form>
  );
}
