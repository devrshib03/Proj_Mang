import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// ✅ Ensure mongoose strict mode (avoid deprecation warnings)
mongoose.set("strictQuery", true);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Database connection already established and cached. ✅");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Database connected for the first time. 🎉");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Database connection successfully awaited and cached. 🚀");
  } catch (e) {
    cached.promise = null;
    console.error("Database connection failed. ❌", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
