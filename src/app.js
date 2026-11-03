import express from 'express';
import cors from 'cors';

import productsRouter from './routes/productsRouter.js';
import storesRouter from './routes/storesRouter.js';
import reviewsRouter from './routes/reviewsRouter.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';

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
app.use('/api/stores', storesRouter);
app.use('/api/customer-reviews', reviewsRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  const status = error.status || 500;

  res.status(status).json({
    message: status === 500 ? 'Internal Server Error' : error.message,
  });
});

export default app;
