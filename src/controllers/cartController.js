import { getUserCart } from '../services/cartService.js';

export const getCartController = async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user._id);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
