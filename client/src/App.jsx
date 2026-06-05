import { useState, useEffect, useCallback } from 'react';
import { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } from './utils/api';
import { exportToCSV } from './utils/csv';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import SummaryPanel from './components/SummaryPanel';
import styles from './App.module.css';

const DEFAULT_FILTERS = { category: 'All', startDate: '', endDate: '' };

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listLoading, setListLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setListLoading(true);
    setError('');
    try {
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setListLoading(false);
    }
  }, [filters]);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await getSummary();
      setSummary(data);
    } catch {
      // summary is non-critical
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
  useEffect(() => { fetchSummary(); }, []);

  async function handleAdd(data) {
    setFormLoading(true);
    setError('');
    try {
      await createExpense(data);
      setShowForm(false);
      fetchExpenses();
      fetchSummary();
    } catch (e) {
      setError(e.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEdit(id, data) {
    setEditLoading(true);
    setError('');
    try {
      await updateExpense(id, data);
      fetchExpenses();
      fetchSummary();
    } catch (e) {
      setError(e.message);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteExpense(id);
      fetchExpenses();
      fetchSummary();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.logo}>₹</span>
            <div>
              <h1 className={styles.title}>Expense Tracker</h1>
              <p className={styles.subtitle}>Track your daily spending</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {expenses.length > 0 && (
              <button className={styles.exportBtn} onClick={() => exportToCSV(expenses)}>
                ↓ Export CSV
              </button>
            )}
            <button
              className={styles.addBtn}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? '✕ Close' : '+ Add Expense'}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>New Expense</h2>
            <ExpenseForm onSubmit={handleAdd} loading={formLoading} />
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            ⚠ {error}
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        <div className={styles.layout}>
          <section className={styles.listSection}>
            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={expenses.length}
            />
            <ExpenseList
              expenses={expenses}
              loading={listLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editLoading={editLoading}
            />
          </section>

          <aside className={styles.sidebar}>
            <SummaryPanel summary={summary} loading={summaryLoading} />
          </aside>
        </div>
      </main>
    </div>
  );
}
