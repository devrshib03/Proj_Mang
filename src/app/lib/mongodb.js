import mongoose from 'mongoose';

// Check if the MONGODB_URI environment variable is defined. If not, throw an error.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Cached connection for performance in a serverless environment like Next.js.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If a connection already exists, return it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not yet cached, create it.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  // Wait for the connection to resolve and cache it.
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;