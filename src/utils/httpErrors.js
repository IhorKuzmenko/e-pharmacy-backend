export class HttpError extends Error {
  constructor(status, message) {
    super(message);

    this.name = 'HttpError';
    this.status = status;
    this.statusCode = status;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const createHttpError = (status, message) =>
  new HttpError(status, message);
