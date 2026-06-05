const request = require('supertest');
const app = require('../src/index');

describe('Expense API', () => {
  let createdId;

  const validExpense = {
    amount: 250,
    category: 'Food',
    date: '2025-06-01',
    note: 'Lunch',
  };

  test('POST /api/expenses - creates a valid expense', async () => {
    const res = await request(app).post('/api/expenses').send(validExpense);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ amount: 250, category: 'Food' });
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('POST /api/expenses - rejects negative amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/expenses - rejects missing category', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 100, date: '2025-06-01' });
    expect(res.status).toBe(400);
  });

  test('GET /api/expenses - returns array', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/expenses/:id - updates expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ ...validExpense, amount: 300 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });

  test('DELETE /api/expenses/:id - deletes expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(204);
  });

  test('GET /api/expenses/summary - returns summary object', async () => {
    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalThisMonth');
    expect(res.body).toHaveProperty('totalPerCategory');
  });
});
