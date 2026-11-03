import Joi from 'joi';

export const updateCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),

  quantity: Joi.number().integer().min(0).required(),
});
