import mongoose, { Schema, Document } from 'mongoose';

// Interface for Station document
export interface IStation extends Document {
    name: string;
}

// Create the schema
const StationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Station = mongoose.model<IStation>('Station', StationSchema);