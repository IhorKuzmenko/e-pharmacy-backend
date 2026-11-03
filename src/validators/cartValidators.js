import Joi from 'joi';

export const updateCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),

  quantity: Joi.number().integer().min(0).required(),
});

export const checkoutSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().email().required(),

  phone: Joi.string().trim().min(5).max(30).required(),

  address: Joi.string().trim().min(5).max(300).required(),
});
