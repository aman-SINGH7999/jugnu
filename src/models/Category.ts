import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  subjects: Types.ObjectId[]; // ref -> Subject[]
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

export default (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>("Category", categorySchema);
