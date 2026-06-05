# Mini Expense Tracker

A small full-stack expense tracker.

- **Backend:** Node.js + Express (JSON-file persistence)
- **Frontend:** React (Vite)

## Run locally

### 1) Install
```bash
npm run install:all
```

### 2) Start backend
```bash
npm run dev:server
```

### 3) Start frontend (new terminal)
```bash
npm run dev:client
```
Open: **http://localhost:3000**

## Run tests
```bash
npm test
```

## API (base URL: http://localhost:5000/api)

- **GET /expenses** — list expenses (newest first). Supports optional `category`, `startDate`, `endDate`.
- **GET /expenses/summary** — monthly summary for the current month.
- **GET /expenses/categories** — list valid categories.
- **GET /expenses/:id** — get one expense.
- **POST /expenses** — create expense (validates amount/category/date).
- **PUT /expenses/:id** — update expense.
- **DELETE /expenses/:id** — delete expense.
- **GET /health** — health check.

## Notes

This project stores data in `server/data/expenses.json` so it persists across server restarts.

## What to improve (with more time)

- Authentication / multi-user support
- Budgeting per category
- Recurring expenses
- Pagination for large datasets
- Better date-range UX (date picker)
- Add end-to-end UI tests (Playwright)
- Deployment CI (GitHub Actions)

