const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { validateExpense, VALID_CATEGORIES } = require('../middleware/validate');

const router = express.Router();

// GET /api/expenses - list all, with optional filters
router.get('/', (req, res) => {
  const { category, startDate, endDate } = req.query;
  let data = store.getAll();

  if (category && category !== 'All') {
    data = data.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    data = data.filter((e) => new Date(e.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    data = data.filter((e) => new Date(e.date) <= end);
  }

  res.json(data);
});

// GET /api/expenses/summary - aggregated stats
router.get('/summary', (req, res) => {
  const all = store.getAll();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = all.filter((e) => new Date(e.date) >= startOfMonth);
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const totalPerCategory = {};
  VALID_CATEGORIES.forEach((cat) => {
    totalPerCategory[cat] = thisMonth
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const highest = all.length
    ? all.reduce((max, e) => (e.amount > max.amount ? e : max), all[0])
    : null;

  res.json({ totalThisMonth, totalPerCategory, highest });
});

// GET /api/expenses/categories
router.get('/categories', (req, res) => {
  res.json(VALID_CATEGORIES);
});

// GET /api/expenses/:id
router.get('/:id', (req, res) => {
  const expense = store.getById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
});

// POST /api/expenses
router.post('/', validateExpense, (req, res) => {
  const { amount, category, date, note } = req.body;
  const expense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    date,
    note: note || '',
    createdAt: new Date().toISOString(),
  };
  const created = store.create(expense);
  res.status(201).json(created);
});

// PUT /api/expenses/:id
router.put('/:id', validateExpense, (req, res) => {
  const { amount, category, date, note } = req.body;
  const updated = store.update(req.params.id, {
    amount: Number(amount),
    category,
    date,
    note: note || '',
  });
  if (!updated) return res.status(404).json({ error: 'Expense not found' });
  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found' });
  res.status(204).send();
});

module.exports = router;
