import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestion extends Document {
  subjectId: Types.ObjectId;     // ref -> Subject
  text: string;
  image?: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    text: { type: String, required: true },
    image: { type: String },
    options: [
      {
        optionText: { type: String, required: true },
        isCorrect: { type: Boolean, required: true, default:false },
      },
    ],
    explanation: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models.Question as Model<IQuestion>) ||
  mongoose.model<IQuestion>("Question", questionSchema);
