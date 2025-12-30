import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';

// Connect to MongoDB using MONGODB_URI from environment variables
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  await mongoose.connect(uri, {
    dbName: DB_NAME,
  });

  // log connection info for debugging
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
};
