import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  image: { type: String },
},{timestamps:true});

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);
