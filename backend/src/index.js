import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { app } from './app.js';

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
    });
  } catch (err) {
    console.error('Failed to start server:', err); // eslint-disable-line no-console
    process.exit(1);
  }
};

startServer();