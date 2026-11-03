import express from 'express';
import cors from 'cors';

import productsRouter from './routes/productsRouter.js';
import storesRouter from './routes/storesRouter.js';
import reviewsRouter from './routes/reviewsRouter.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
