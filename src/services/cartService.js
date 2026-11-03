import Cart from '../models/Cart.js';
import '../models/Product.js';

export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({
    user: userId,
  })
    .populate('items.product')
    .lean();

  if (!cart) {
    try {
      await Cart.create({
        user: userId,
        items: [],
      });
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }

    cart = await Cart.findOne({
      user: userId,
    })
      .populate('items.product')
      .lean();
  }

  const items = cart.items.map((item) => {
    const product = item.product;

    return {
      product,
      quantity: item.quantity,
      totalPrice: product
        ? Number((product.price * item.quantity).toFixed(2))
        : 0,
    };
  });

  const totalPrice = Number(
    items.reduce((total, item) => total + item.totalPrice, 0).toFixed(2),
  );

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return {
    id: cart._id,
    user: cart.user,
    items,
    totalQuantity,
    totalPrice,
  };
};
