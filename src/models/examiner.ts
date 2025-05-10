import mongoose, { Schema, Document } from 'mongoose';

// Interface for Examinee document
export interface IExaminer extends Document {
    name: string;
}

// Create the schema
const ExaminerSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Examiner = mongoose.model<IExaminer>('Examiner', ExaminerSchema);