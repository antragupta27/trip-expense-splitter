const mongoose = require('mongoose');

const validateMongoUri = (mongoUri) => {
  if (!mongoUri) {
    return false;
  }

  if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    return false;
  }

  const hostMatch = mongoUri.match(/@([^/?]+)/);
  if (hostMatch && hostMatch[1].includes('%40')) {
    return false;
  }

  return true;
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MongoDB URI not configured. Skipping database connection.');
    return false;
  }

  if (!validateMongoUri(mongoUri)) {
    console.error('MongoDB connection failed: the MONGODB_URI is not a valid Atlas connection string.');
    console.error('Re-copy the connection string directly from MongoDB Atlas and keep the hostname in its original form.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB Atlas connected successfully.');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed. Check the Atlas connection string, network access, and IP allowlist.');
    console.error('MongoDB error:', error.name || 'ConnectionError');
    return false;
  }
};

module.exports = { connectDB };
