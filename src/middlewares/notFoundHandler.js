import { createHttpError } from '../utils/httpErrors.js';

export const notFoundHandler = (req, res, next) => {
  next(
    createHttpError(404, `Route ${req.method} ${req.originalUrl} not found`),
  );
};
