import { getUserCart, updateUserCart } from '../services/cartService.js';

import {
  updateCartSchema,
  checkoutSchema,
} from '../validators/cartValidators.js';
import { checkoutUserCart } from '../services/checkoutService.js';

export const getCartController = async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user._id);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartController = async (req, res, next) => {
  try {
    const { error, value } = updateCartSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((item) => item.message),
      });
    }

    const { productId, quantity } = value;

    const cart = await updateUserCart(req.user._id, productId, quantity);

    res.status(200).json({
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutCartController = async (req, res, next) => {
  try {
    const { error, value } = checkoutSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((item) => item.message),
      });
    }

    const order = await checkoutUserCart(req.user._id, value);

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};
