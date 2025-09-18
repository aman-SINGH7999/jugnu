import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResult extends Document {
  examId: Types.ObjectId;
  publish?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const resultSchema = new Schema<IResult>(
  {
    examId: { type: Schema.Types.ObjectId, ref:"Exam", required: true, unique: true },
    publish: { type: Date },
  },
  { timestamps: true }
);

export default (mongoose.models.Result as Model<IResult>) ||
  mongoose.model<IResult>("Result", resultSchema);
