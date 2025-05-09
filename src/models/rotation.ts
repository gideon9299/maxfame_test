import mongoose, { Schema, Document } from 'mongoose';

// Interface for Rotation document
export interface IRotation extends Document {
    round: number;
    stationId: string;
    examineeId: string;
}

// Create the schema
const RotationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Rotation = mongoose.model<IRotation>('Rotation', RotationSchema);