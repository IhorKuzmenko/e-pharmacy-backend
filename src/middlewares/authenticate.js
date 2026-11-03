import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token is missing',
      });
    }

    const token = authorization.slice(7);

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    if (!decoded.sub) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }

    next(error);
  }
};
