import bcrypt from 'bcrypt';

import User from '../models/User.js';

export const registerUser = async ({ name, email, phone, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  } catch (error) {
    if (error.code === 11000) {
      const conflictError = new Error('Email already in use');
      conflictError.status = 409;
      throw conflictError;
    }

    throw error;
  }
};
