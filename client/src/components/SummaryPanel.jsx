import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, CATEGORY_COLORS, CATEGORIES } from '../utils/api';
import styles from './SummaryPanel.module.css';

const CAT_ICONS = {
  Food: '🍜', Transport: '🚌', Bills: '⚡', Entertainment: '🎬', Other: '📦',
};

export default function SummaryPanel({ summary, loading }) {
  if (loading) return <div className={styles.panel}><div className={styles.skeleton} /></div>;
  if (!summary) return null;

  const { totalThisMonth, totalPerCategory, highest } = summary;

  const chartData = CATEGORIES
    .map((cat) => ({ name: cat, value: totalPerCategory[cat] || 0 }))
    .filter((d) => d.value > 0);

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>This Month</h2>

      <div className={styles.totalBox}>
        <span className={styles.totalLabel}>Total Spent</span>
        <span className={styles.totalAmount}>{formatCurrency(totalThisMonth)}</span>
      </div>

      {highest && (
        <div className={styles.highestBox}>
          <span className={styles.highestLabel}>Highest Expense</span>
          <span className={styles.highestAmount}>{formatCurrency(highest.amount)}</span>
          <span className={styles.highestNote}>{highest.note || highest.category}</span>
        </div>
      )}

      <div className={styles.cats}>
        {CATEGORIES.map((cat) => {
          const val = totalPerCategory[cat] || 0;
          const pct = totalThisMonth > 0 ? (val / totalThisMonth) * 100 : 0;
          return (
            <div key={cat} className={styles.catRow}>
              <span className={styles.catIcon}>{CAT_ICONS[cat]}</span>
              <div className={styles.catInfo}>
                <div className={styles.catTop}>
                  <span className={styles.catName}>{cat}</span>
                  <span className={styles.catAmt}>{formatCurrency(val)}</span>
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${pct}%`,
                      background: CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {chartData.length > 0 && (
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 13,
                  color: 'var(--text)',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(name) => (
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
