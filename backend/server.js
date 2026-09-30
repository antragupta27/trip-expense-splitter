const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Trip Expense Splitter API is running.',
  });
});

app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

connectDB();

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
