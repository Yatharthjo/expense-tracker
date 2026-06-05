import { useState } from 'react';
import { CATEGORIES } from '../utils/api';
import styles from './FilterBar.module.css';

const today = new Date();
const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
const todayStr = today.toISOString().split('T')[0];

const DATE_PRESETS = [
  { label: 'All Time', start: '', end: '' },
  { label: 'This Month', start: thisMonthStart, end: todayStr },
  { label: 'Last Month', start: lastMonthStart, end: lastMonthEnd },
];

export default function FilterBar({ filters, onChange, total }) {
  const [showCustom, setShowCustom] = useState(false);

  function setCategory(cat) {
    onChange({ ...filters, category: cat });
  }

  function applyPreset(preset) {
    setShowCustom(false);
    onChange({ ...filters, startDate: preset.start, endDate: preset.end });
  }

  const activePreset = DATE_PRESETS.find(
    (p) => p.start === (filters.startDate || '') && p.end === (filters.endDate || '')
  );

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.catGroup}>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${filters.category === cat ? styles.active : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.dateGroup}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.label}
              className={`${styles.dateBtn} ${activePreset === p && !showCustom ? styles.active : ''}`}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
          <button
            className={`${styles.dateBtn} ${showCustom ? styles.active : ''}`}
            onClick={() => setShowCustom(!showCustom)}
          >
            Custom
          </button>
        </div>

        {showCustom && (
          <div className={styles.customDates}>
            <input
              type="date"
              value={filters.startDate || ''}
              max={filters.endDate || todayStr}
              onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            />
            <span className={styles.to}>to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              min={filters.startDate || ''}
              max={todayStr}
              onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            />
          </div>
        )}
      </div>

      {total !== undefined && (
        <div className={styles.count}>{total} expense{total !== 1 ? 's' : ''}</div>
      )}
    </div>
  );
}
