import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  selectedOptions: number[];
  isCorrect: boolean;
}

export interface ISubjectScore {
  subjectId: Types.ObjectId;
  marks: number;
}

const subjectScoreSchema = new Schema<ISubjectScore>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    marks: { type: Number, default: 0 },
  },
  { _id: false }
);

const answerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOptions: [{ type: Number, required: true }],
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

export interface IAttempt extends Document {
  studentId: Types.ObjectId;
  examId: Types.ObjectId;
  answers: IAnswer[];
  totalScore: number;
  subjectsScore: ISubjectScore[];
  submittedAt: Date;
}

const attemptSchema = new Schema<IAttempt>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    answers: { type: [answerSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    subjectsScore: { type: [subjectScoreSchema], default: [] },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default (mongoose.models.Attempt as Model<IAttempt>) ||
  mongoose.model<IAttempt>("Attempt", attemptSchema);
