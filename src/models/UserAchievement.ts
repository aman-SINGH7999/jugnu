import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISubjectScore {
  subjectId: Types.ObjectId;
  marks: number;
}

export interface IUserAchievement extends Document {
  user: Types.ObjectId;
  expertise: Types.ObjectId[];
  rating: number;
  medals: number;
  subjectsScore: ISubjectScore[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 🔹 Sub-schema for subjectsScore
const subjectScoreSchema = new Schema<ISubjectScore>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    marks: { type: Number, default: 0 },
  },
  { _id: false } // optional: disable _id for subdocs
);

const userAchievementSchema = new Schema<IUserAchievement>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    expertise: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    rating: { type: Number, default: 0 },
    medals: { type: Number, default: 0 },
    subjectsScore: [subjectScoreSchema], // ✅ use sub-schema here
  },
  { timestamps: true }
);

export default (mongoose.models.UserAchievement as Model<IUserAchievement>) ||
  mongoose.model<IUserAchievement>("UserAchievement", userAchievementSchema);
