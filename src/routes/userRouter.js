import { Router } from 'express';

import {
  registerController,
  loginController,
} from '../controllers/authController.js';

const userRouter = Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);

export default userRouter;
