import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import { revokeToken } from './tokenService.js';

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

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    algorithm: 'HS256',
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
};

export const getUserInfo = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
});

export const logoutUser = async (token, tokenPayload) => {
  if (!Number.isInteger(tokenPayload.exp)) {
    throw new Error('Token expiration is missing');
  }

  const expiresAt = new Date(tokenPayload.exp * 1000);

  await revokeToken(token, expiresAt);
};
