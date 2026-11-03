import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';

import {
  getCartController,
  updateCartController,
  checkoutCartController,
} from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', getCartController);
cartRouter.put('/update', updateCartController);
cartRouter.post('/checkout', checkoutCartController);

export default cartRouter;
