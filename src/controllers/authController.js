import { registerSchema } from '../validators/authValidators.js';
import { registerUser } from '../services/authService.js';

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
