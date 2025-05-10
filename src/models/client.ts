import mongoose, { Schema, Document } from 'mongoose';

// Interface for Client document
export interface IClient extends Document {
    clientId: string;
    name: string;
}

// Create the schema
const ClientSchema: Schema = new Schema({
    clientId: {
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
export const Client = mongoose.model<IClient>('Client', ClientSchema);