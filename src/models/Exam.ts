import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IExam extends Document {
  title: string;
  description?: string;

  categoryId?: Types.ObjectId | null; // ref -> Category (nullable)
  subjectIds: Types.ObjectId[];       // ref -> Subject[]

  duration: number;                   // in minutes
  totalMarks: number;
  createdBy: Types.ObjectId;          // ref -> User
  questionIds: Types.ObjectId[];      // ref -> Question[]
  negative: boolean;
  marksParQue: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    description: { type: String },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
    marksParQue : {type: Number, default: 4},
    negative: { type: Boolean, default:true},
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionIds: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    
  },
  { timestamps: true }
);

export default (mongoose.models.Exam as Model<IExam>) ||
  mongoose.model<IExam>("Exam", examSchema);
