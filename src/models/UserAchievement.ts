import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserAchievement extends Document {
  user: Types.ObjectId;
  expertise: Types.ObjectId[];
  rating: number;
  medals: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userAchievementSchema = new Schema<IUserAchievement>({
  user: { type: Schema.Types.ObjectId, required: true },
  expertise: [{ type: Schema.Types.ObjectId, ref: "Category"}],
  rating: { type: Number, default:0},
  medals: { type: Number, default:0},
},{timestamps:true});

export default (mongoose.models.UserAchievement as Model<IUserAchievement>) ||
  mongoose.model<IUserAchievement>("UserAchievement", userAchievementSchema);
