import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().email().required(),

  phone: Joi.string().trim().min(7).max(20).required(),

  password: Joi.string().min(8).max(128).required(),
});
