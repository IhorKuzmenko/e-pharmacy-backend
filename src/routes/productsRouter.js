import { Router } from 'express';

import {
  getProductsController,
  getProductByIdController,
} from '../controllers/productsController.js';

const productsRouter = Router();

productsRouter.get('/', getProductsController);

productsRouter.get('/:id', getProductByIdController);

export default productsRouter;
