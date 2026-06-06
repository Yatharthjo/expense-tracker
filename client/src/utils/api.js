const BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.errors?.join(', ') || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getExpenses(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  const url = `${BASE}/expenses${query.toString() ? '?' + query : ''}`;
  return handleResponse(await fetch(url));
}

export async function getSummary() {
  return handleResponse(await fetch(`${BASE}/expenses/summary`));
}

export async function createExpense(data) {
  return handleResponse(await fetch(`${BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function updateExpense(id, data) {
  return handleResponse(await fetch(`${BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function deleteExpense(id) {
  return handleResponse(await fetch(`${BASE}/expenses/${id}`, { method: 'DELETE' }));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food: 'var(--cat-food)',
  Transport: 'var(--cat-transport)',
  Bills: 'var(--cat-bills)',
  Entertainment: 'var(--cat-entertainment)',
  Other: 'var(--cat-other)',
};
