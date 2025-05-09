import mongoose, { Schema, Document } from 'mongoose';

// Interface for Administration document
export interface IAdministration extends Document {
    name: string;
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