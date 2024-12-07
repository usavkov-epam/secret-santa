import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!);

    console.log('✅ Successfully connected to MongoDB');

    return connected;
  } catch (error) {
    console.error('❌ Connection to MongoDB failed:', error);
    process.exit(1);
  }
};
