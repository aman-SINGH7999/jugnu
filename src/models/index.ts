// models/index.ts
import mongoose from "mongoose";
import "@/models/User";
import "@/models/Category";
import "@/models/Subject";
import "@/models/Question";
import "@/models/Exam";
import "@/models/Attempt"
import "@/models/UserAchievement"

// Force register all models
export const User = mongoose.models.User;
export const Category = mongoose.models.Category;
export const Subject = mongoose.models.Subject;
export const Question = mongoose.models.Question;
export const Exam = mongoose.models.Exam;
export const Attempt = mongoose.models.Attempt;
export const UserAchievement = mongoose.models.UserAchievement;
