import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';

import Review from '../models/Review.js';
import { connectMongoDB } from '../db/connectMongoDB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../../seeds/data/reviews.json');

const seedReviews = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding is disabled in production');
    }

    const content = await fs.readFile(filePath, 'utf8');
    const reviews = JSON.parse(content);

    if (!Array.isArray(reviews)) {
      throw new Error('reviews.json must contain an array');
    }

    for (const item of reviews) {
      const review = new Review(item);
      await review.validate();
    }

    console.log('Reviews JSON validation successful');

    await connectMongoDB();

    const existingCount = await Review.countDocuments();

    if (existingCount > 0) {
      console.log(`Reviews already exist: ${existingCount}`);
      console.log('Import skipped');
      return;
    }

    const insertedReviews = await Review.insertMany(reviews);

    console.log(`Reviews imported: ${insertedReviews.length}`);
    console.log('Reviews seeding completed successfully');
  } catch (error) {
    console.error('Reviews seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedReviews();
