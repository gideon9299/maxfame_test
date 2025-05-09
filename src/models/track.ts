import mongoose, { Schema, Document } from 'mongoose';

// Interface for Track document
export interface ITrack extends Document {
    name: string;
}

// Create the schema
const TrackSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Track = mongoose.model<ITrack>('Track', TrackSchema);