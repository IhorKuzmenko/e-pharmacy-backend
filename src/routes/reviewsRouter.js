import { Router } from 'express';

import { getReviewsController } from '../controllers/reviewsController.js';

const reviewsRouter = Router();

reviewsRouter.get('/', getReviewsController);

export default reviewsRouter;
