import mongoose, { Schema, Document } from "mongoose";

// Interface for Feedback document
export interface IFeedback extends Document {
  name: string;
  email: string;
  feedback: string;
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const FeedbackSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
