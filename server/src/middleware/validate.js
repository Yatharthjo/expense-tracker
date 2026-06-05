const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function validateExpense(req, res, next) {
  const { amount, category, date } = req.body;
  const errors = [];

  if (amount === undefined || amount === null || amount === '') {
    errors.push('Amount is required');
  } else {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      errors.push('Amount must be a positive number');
    }
  }

  if (!category) {
    errors.push('Category is required');
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!date) {
    errors.push('Date is required');
  } else {
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(expenseDate.getTime())) {
      errors.push('Date is invalid');
    } else if (expenseDate > today) {
      errors.push('Date cannot be in the future');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateExpense, VALID_CATEGORIES };
