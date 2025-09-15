
// lib/dbConnect.ts ya kisi bhi central model loader me
import "@/models/Subject";
import "@/models/Category";
import "@/models/User";
import "@/models/Question";

import mongoose from "mongoose";


let isConnected = false;

export async function dbConnect(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
