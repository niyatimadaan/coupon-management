import mongoose from 'mongoose';

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}


async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
}

export { connectDB, disconnectDB };
