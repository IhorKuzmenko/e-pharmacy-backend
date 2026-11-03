import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

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

export const updateUserCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error('Requested quantity exceeds available stock');
    error.status = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    try {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      cart = await Cart.findOne({ user: userId });
    }
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (quantity === 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
  } else if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return getUserCart(userId);
};
