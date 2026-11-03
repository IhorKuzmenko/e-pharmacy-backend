import { getReviews } from '../services/reviewsService.js';

export const getReviewsController = async (req, res, next) => {
  try {
    const reviews = await getReviews();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
