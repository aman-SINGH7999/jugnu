import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.Subject as Model<ISubject>) ||
  mongoose.model<ISubject>("Subject", subjectSchema);
