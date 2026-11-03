import Pharmacy from '../models/Pharmacy.js';

export const getStores = async () => {
  return Pharmacy.find({
    source: 'pharmacies',
  })
    .sort({ name: 1, _id: 1 })
    .lean();
};

export const getNearestStores = async () => {
  return Pharmacy.find({
    source: 'nearest_pharmacies',
  })
    .sort({ name: 1, _id: 1 })
    .lean();
};
