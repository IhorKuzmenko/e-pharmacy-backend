import { Router } from 'express';

import {
  getStoresController,
  getNearestStoresController,
} from '../controllers/storesController.js';

const storesRouter = Router();

storesRouter.get('/nearest', getNearestStoresController);

storesRouter.get('/', getStoresController);

export default storesRouter;
