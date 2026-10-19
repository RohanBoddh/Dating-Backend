const mongoose = require('mongoose');

/**
 * Global cache for Mongoose connection in Serverless environments (Vercel)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not set in environment variables.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents hanging buffering timeouts in serverless
      serverSelectionTimeoutMS: 10000
    };

    cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
      console.log(`✅ [MongoDB] Connected successfully to host: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [MongoDB] Disconnected from MongoDB cluster.');
  if (cached) cached.conn = null;
});

module.exports = connectDB;
