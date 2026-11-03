import Review from '../models/Review.js';

export const getReviews = async () => {
  return Review.find().sort({ _id: 1 }).lean();
};
