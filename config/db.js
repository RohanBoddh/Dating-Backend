const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not set in environment variables. Database operations will fail.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    // Do not crash server immediately if db is temporarily unreachable; let requests return friendly error
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [MongoDB] Disconnected from MongoDB cluster.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 [MongoDB] Reconnected to MongoDB cluster.');
});

module.exports = connectDB;
