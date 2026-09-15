import mongoose from 'mongoose';

/**
 * Connect to MongoDB database using Mongoose ODM.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';
    console.log(`📡 Connecting to MongoDB at: ${connStr}...`);
    
    await mongoose.connect(connStr);
    console.log('✅ MongoDB Database Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't crash immediately; server will log errors on DB operations
  }
};
