Mini Expense Tracker
A full-stack expense tracking app built with Node.js + Express on the backend and React + Vite on the frontend. Users can log daily spending across categories, filter by date and category, view a monthly summary with charts, and export data to CSV.
Live Demo

Frontend — https://expense-tracker-olf5.vercel.app
Backend — https://expense-tracker-j35a.onrender.com


Tech Stack
LayerTechnologyWhyBackendNode.js + ExpressSimple and fast REST APIStorageJSON fileData persists without needing a databaseFrontendReact + ViteFast development, modern React hooksChartsRechartsEasy pie charts in ReactStylingCSS ModulesScoped styles, no class conflictsTestingJest + SupertestMeaningful backend API tests

How to Run Locally
Requires Node.js installed. Clone the repo first.
Step 1 — Install all dependencies
npm run install:all
Step 2 — Start the backend (Terminal 1)
cd server
npm start
Backend runs on http://localhost:5000
Step 3 — Start the frontend (Terminal 2)
cd client
npm run dev
Open http://localhost:3000 in your browser.
Step 4 — Run tests
cd server
npm test

API Documentation
Base URL — http://localhost:5000/api
MethodEndpointDescriptionGET/expensesList all expenses, newest firstGET/expenses/summaryMonthly totals and category breakdownGET/expenses/categoriesList of valid categoriesGET/expenses/:idGet a single expense by IDPOST/expensesCreate a new expensePUT/expenses/:idUpdate an existing expenseDELETE/expenses/:idDelete an expenseGET/healthHealth check
Filters supported on GET /expenses

category — e.g. Food, Transport, Bills
startDate — e.g. 2026-06-01
endDate — e.g. 2026-06-30

POST /expenses request body
{
  "amount": 250,
  "category": "Food",
  "date": "2026-06-01",
  "note": "Lunch"
}
Validation rules

Amount must be a positive number
Category is required and must be one of the valid categories
Date cannot be in the future


Project Structure
expense-tracker-app/
│
├── client/                   React frontend
│   └── src/
│       ├── components/       ExpenseForm, ExpenseList, FilterBar, SummaryPanel
│       ├── utils/            api.js, csv.js
│       ├── App.jsx           Root component and state management
│       └── index.css         Global CSS variables and resets
│
├── server/                   Node.js backend
│   ├── src/
│   │   ├── routes/           expenses.js — all CRUD endpoints
│   │   ├── middleware/       validate.js — request validation
│   │   ├── store.js          In-memory array with JSON file persistence
│   │   └── index.js          Express app entry point
│   ├── data/
│   │   └── expenses.json     Auto-created, stores all expense data
│   └── tests/
│       └── expenses.test.js  7 Jest + Supertest API tests
│
└── package.json              Root scripts for installing and running both

Features

Add, edit, and delete expenses
Delete confirmation prompt before removing
Filter by category using pill buttons
Filter by date range — This Month, Last Month, or Custom
Summary panel showing total spent this month
Category breakdown with progress bars
Pie chart of spending distribution
Highest single expense callout
CSV export of currently visible expenses
Data persists across server restarts
Form validation with inline error messages
Loading skeletons while data fetches
Error banners for failed requests
Fully responsive on mobile


Next Steps

Authentication and multi-user support
Budget limits per category with visual warnings when exceeded
Recurring expenses that auto-create each month
End-to-end tests using Playwright
Pagination for large expense lists


AI Tool Disclosure
Claude was used as a coding assistant during development. All code has been reviewed and understood line by line. Happy to walk through any part of it in the follow-up interview.