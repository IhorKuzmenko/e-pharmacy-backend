import { Router } from 'express';

import {
  registerController,
  loginController,
  getUserInfoController,
} from '../controllers/authController.js';

import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/user-info', authenticate, getUserInfoController);

export default userRouter;
