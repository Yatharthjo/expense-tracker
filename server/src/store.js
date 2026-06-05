const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'expenses.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load initial data from file if it exists
let expenses = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    expenses = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    expenses = [];
  }
}

function persist() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

function getAll() {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getById(id) {
  return expenses.find((e) => e.id === id) || null;
}

function create(expense) {
  expenses.push(expense);
  persist();
  return expense;
}

function update(id, updates) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  expenses[index] = { ...expenses[index], ...updates };
  persist();
  return expenses[index];
}

function remove(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  persist();
  return true;
}

module.exports = { getAll, getById, create, update, remove };
