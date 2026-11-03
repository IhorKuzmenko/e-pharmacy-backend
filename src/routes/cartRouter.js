import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';
import { getCartController } from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/', getCartController);

export default cartRouter;
