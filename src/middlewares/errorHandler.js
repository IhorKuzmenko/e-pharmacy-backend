export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isProduction = process.env.NODE_ENV === 'production';

  let status = error.status || error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Ошибка валидации MongoDB ObjectId
  if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid resource ID';
  }

  // Ошибка валидации Mongoose
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Database validation failed';
  }

  // Ошибка уникальности MongoDB
  if (error.code === 11000) {
    status = 409;
    message = 'Resource already exists';
  }

  // Некорректный JSON в теле запроса
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  // Ошибка авторизации JWT
  if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    status = 401;
    message = 'Invalid or expired token';
  }

  // Неизвестные ошибки не раскрываем клиенту
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    status = 500;
  }

  if (status >= 500) {
    console.error('Server error:', error);

    message = isProduction ? 'Internal Server Error' : message;
  }

  res.status(status).json({
    message,
  });
};
