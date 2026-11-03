import mongoose from 'mongoose';

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const checkoutUserCart = async (userId, customer) => {
  const session = await mongoose.startSession();

  try {
    const order = await session.withTransaction(async () => {
      const cart = await Cart.findOne({
        user: userId,
      }).session(session);

      if (!cart || cart.items.length === 0) {
        throw createHttpError(400, 'Cart is empty');
      }

      const orderItems = [];
      let totalPrice = 0;

      for (const item of cart.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw createHttpError(404, 'One of the products was not found');
        }

        if (product.stock < item.quantity) {
          throw createHttpError(
            400,
            `Insufficient stock for product: ${product.name}`,
          );
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
            session,
          },
        );

        if (!updatedProduct) {
          throw createHttpError(
            400,
            `Insufficient stock for product: ${product.name}`,
          );
        }

        const price = Number(product.price);
        const itemTotal = Number((price * item.quantity).toFixed(2));

        orderItems.push({
          product: product._id,
          name: product.name,
          price,
          quantity: item.quantity,
        });

        totalPrice += itemTotal;
      }

      const createdOrders = await Order.create(
        [
          {
            user: userId,
            customer,
            items: orderItems,
            totalPrice: Number(totalPrice.toFixed(2)),
            status: 'pending',
          },
        ],
        { session },
      );

      // Удаляем товары только из той версии корзины,
      // которую прочитали в этой транзакции.
      const clearedCart = await Cart.updateOne(
        {
          _id: cart._id,
          updatedAt: cart.updatedAt,
        },
        {
          $set: { items: [] },
          $currentDate: { updatedAt: true },
        },
        { session },
      );

      if (clearedCart.modifiedCount !== 1) {
        throw createHttpError(
          409,
          'Cart was changed during checkout. Please try again',
        );
      }

      return createdOrders[0];
    });

    return order;
  } finally {
    await session.endSession();
  }
};
