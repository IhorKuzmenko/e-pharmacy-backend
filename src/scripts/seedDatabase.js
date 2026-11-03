import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';

import Product from '../models/Product.js';
import Pharmacy from '../models/Pharmacy.js';
import { connectMongoDB } from '../db/connectMongoDB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.resolve(__dirname, '../../seeds/data');

const readJsonFile = async (filename) => {
  const filePath = path.join(dataDirectory, filename);
  const content = await fs.readFile(filePath, 'utf8');

  const data = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error(`${filename} must contain an array`);
  }

  return data;
};

const prepareProducts = (products) => {
  return products.map(({ id, stock, price, ...product }) => ({
    ...product,
    legacyId: String(id),
    stock: Number(stock),
    price: Number(price),
  }));
};

const preparePharmacies = (pharmacies, source) => {
  return pharmacies.map((pharmacy) => ({
    ...pharmacy,
    source,
  }));
};

const validateDocuments = async (Model, data) => {
  for (const item of data) {
    const document = new Model(item);
    await document.validate();
  }
};

const seedDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding is disabled in production');
    }

    const productsData = await readJsonFile('products.json');
    const pharmaciesData = await readJsonFile('pharmacies.json');
    const nearestData = await readJsonFile('nearest_pharmacies.json');

    const products = prepareProducts(productsData);

    const pharmacies = [
      ...preparePharmacies(pharmaciesData, 'pharmacies'),
      ...preparePharmacies(nearestData, 'nearest_pharmacies'),
    ];

    await validateDocuments(Product, products);
    await validateDocuments(Pharmacy, pharmacies);

    console.log('JSON data validation successful');

    await connectMongoDB();

    const productCount = await Product.countDocuments();
    const pharmacyCount = await Pharmacy.countDocuments();

    if (productCount !== 0 || pharmacyCount !== 0) {
      console.log('Collections are not empty. Import skipped.');
      console.log(`Existing products: ${productCount}`);
      console.log(`Existing pharmacies: ${pharmacyCount}`);
      return;
    }

    const insertedProducts = await Product.insertMany(products);
    const insertedPharmacies = await Pharmacy.insertMany(pharmacies);

    console.log(`Products imported: ${insertedProducts.length}`);
    console.log(`Pharmacies imported: ${insertedPharmacies.length}`);
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
