import { registerSchema, loginSchema } from '../validators/authValidators.js';

import { registerUser, loginUser } from '../services/authService.js';

export const registerController = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((item) => item.message),
      });
    }

    const user = await registerUser(value);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((item) => item.message),
      });
    }

    const result = await loginUser(value);

    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
