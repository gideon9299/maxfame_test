import mongoose, { Schema, Document } from 'mongoose';

// Interface for Examinee document
export interface IExaminee extends Document {
    examineeId: string;
    name: string;
}

// Create the schema
const ExamineeSchema: Schema = new Schema({
    examineeId: {
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
export const Examinee = mongoose.model<IExaminee>('Examinee', ExamineeSchema);