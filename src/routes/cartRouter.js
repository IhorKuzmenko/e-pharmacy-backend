import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';

import {
  getCartController,
  updateCartController,
} from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', getCartController);
cartRouter.put('/update', updateCartController);

export default cartRouter;
