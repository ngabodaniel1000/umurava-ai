import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;  // Return the connection for chaining
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

export default connectDB;