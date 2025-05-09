import mongoose, { Schema, Document } from 'mongoose';

// Interface for Client document
export interface IClient extends Document {
    name: string;
}

// Create the schema
const ClientSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Client = mongoose.model<IClient>('Client', ClientSchema);