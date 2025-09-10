import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;   // ref -> Question
  selectedOptions: number[];    // selected option indexes
  isCorrect: boolean;
  marksObtained: number;
}

export interface IAttempt extends Document {
  studentId: Types.ObjectId;    // ref -> User (student)
  examId: Types.ObjectId;       // ref -> Exam
  answers: IAnswer[];
  totalScore: number;
  startedAt: Date;
  submittedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOptions: [{ type: Number, required: true }],
    isCorrect: { type: Boolean, required: true },
    marksObtained: { type: Number, required: true },
  },
  { _id: false }
);

const attemptSchema = new Schema<IAttempt>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    answers: { type: [answerSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export default (mongoose.models.Attempt as Model<IAttempt>) ||
  mongoose.model<IAttempt>("Attempt", attemptSchema);
