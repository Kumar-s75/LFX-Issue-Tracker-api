import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let db: mongoose.Connection;

const connectDb = async (): Promise<void> => {
    const DBurl = process.env.DB_URL as string;
    
    if (!DBurl) {
        throw new Error("DB_URL environment variable is not defined");
    }
    
    console.log("Connecting to database...");
    
    try {
        await mongoose.connect(DBurl);
        db = mongoose.connection;
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Error connecting to DB:", error);
        throw error;
    }
};

// Export the database connection
export { db };
export default connectDb;