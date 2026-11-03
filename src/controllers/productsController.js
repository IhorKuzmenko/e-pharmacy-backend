import { getProducts, getProductById } from '../services/productsService.js';

export const getProductsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message:
          'Page must be a positive integer and limit must be between 1 and 100',
      });
    }

    const { search, category } = req.query;

    if (
      (search !== undefined && typeof search !== 'string') ||
      (category !== undefined && typeof category !== 'string')
    ) {
      return res.status(400).json({
        message: 'Search and category must be strings',
      });
    }

    if (
      (search && search.length > 100) ||
      (category && category.length > 100)
    ) {
      return res.status(400).json({
        message: 'Search and category must not exceed 100 characters',
      });
    }

    const result = await getProducts({
      page,
      limit,
      search: search?.trim(),
      category: category?.trim(),
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
