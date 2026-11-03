import mongoose from 'mongoose';
import Product from '../models/Product.js';

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getProducts = async ({
  page = 1,
  limit = 12,
  search,
  category,
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.name = {
      $regex: escapeRegExp(search),
      $options: 'i',
    };
  }

  if (category) {
    filter.category = {
      $regex: `^${escapeRegExp(category)}$`,
      $options: 'i',
    };
  }

  const [products, totalItems] = await Promise.all([
    Product.find(filter).sort({ _id: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: products,
    page,
    perPage: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const getProductById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Product.findById(id).lean();
};
