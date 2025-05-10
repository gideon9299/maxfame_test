import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { IStation } from './station';

// Interface for Track document
export interface ITrack extends Document {
    name: string;
    administrationId: ObjectId;
    stations: IStation[];
}

// Create the schema
const TrackSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    administrationId: {
        type: Schema.Types.ObjectId,
        ref: 'Administration',
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Track = mongoose.model<ITrack>('Track', TrackSchema);