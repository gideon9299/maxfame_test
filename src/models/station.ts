import mongoose, { Schema, Document } from 'mongoose';
import {type IRotation } from './rotation';

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: The name of the station
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the station was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the station was last updated
 *       example:
 *         name: "Station 1"
 *         createdAt: "2025-05-09T10:00:00.000Z"
 *         updatedAt: "2025-05-09T10:00:00.000Z"
 */

// Interface for Station document
export interface IStation extends Document {
    name: string;
    trackId: mongoose.Types.ObjectId;
    rotations: IRotation[];
}

// Create the schema
const StationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    trackId: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
        required: true,
    }
}, {
    timestamps: true
});

// Create and export the model
export const Station = mongoose.model<IStation>('Station', StationSchema);