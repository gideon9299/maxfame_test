import mongoose, { Schema, Document } from 'mongoose';
import { ITrack } from './track';

// Interface for Administration document
export interface IAdministration extends Document {
    name: string;
    tracks: ITrack[];
}

// Create the schema
const AdministrationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Administration = mongoose.model<IAdministration>('Administration', AdministrationSchema);