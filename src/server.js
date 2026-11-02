
import 'dotenv/config';

import app from './app.js';
import { connectMongoDB } from './db/connectMongoDB.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`E-Pharmacy server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
