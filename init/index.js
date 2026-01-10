import mongoose from "mongoose";
import dotenv from "dotenv";

import Listing from "../models/listing.js";
import initData from "./data.js";
dotenv.config();

const MONGO_URL = process.env.ATLASDB_URL;

if (!MONGO_URL) {
  throw new Error("❌ ATLASDB_URL not found in environment variables");
}

async function seedDB() {
  try {
    // 1️⃣ Connect to Atlas
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB Atlas");

    // 2️⃣ Clear existing listings
    await Listing.deleteMany({});
    console.log("🗑️ Old listings removed");

    // 3️⃣ Prepare data (attach owner)
    const OWNER_ID = new mongoose.Types.ObjectId(
      "695fb725ad28118147f50491"
    );

    const listings = initData.map((listing) => ({
      ...listing,
      owner: OWNER_ID,
    }));

    // 4️⃣ Insert into Atlas
    await Listing.insertMany(listings);
    console.log("🚀 Data successfully shifted to Atlas");

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    // 5️⃣ Close connection
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

seedDB();
