import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let db = mongoose.connection;

const connectDb = async () => {
    const DBurl = process.env.DB_Url as string;
    console.log(DBurl, "here is the db url");
    try {
        await mongoose.connect(DBurl);
        db = mongoose.connection;
        console.log("✅ DB connected");
    } catch (error) {
        console.log("❌ Error connecting to DB", error);
    }
};

export { db };
export default connectDb;
