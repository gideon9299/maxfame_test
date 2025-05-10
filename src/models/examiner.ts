import mongoose, { Schema, Document } from 'mongoose';

// Interface for Examiner document
export interface IExaminer extends Document {
    examinerId: string;
    name: string;
}

// Create the schema
const ExaminerSchema: Schema = new Schema({
    examinerId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Examiner = mongoose.model<IExaminer>('Examiner', ExaminerSchema);