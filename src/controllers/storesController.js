import { getStores, getNearestStores } from '../services/storesService.js';

export const getStoresController = async (req, res, next) => {
  try {
    const stores = await getStores();

    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

export const getNearestStoresController = async (req, res, next) => {
  try {
    const stores = await getNearestStores();

    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};
