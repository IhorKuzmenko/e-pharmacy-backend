import express from 'express';
import cors from 'cors';

import productsRouter from './routes/productsRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'E-Pharmacy API is running',
  });
});

app.use('/api/products', productsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: 'Internal Server Error',
  });
});

export default app;
