import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { type IRotation } from './rotation';

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - name
 *         - trackId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: The name of the station
 *         trackId:
 *           type: string
 *           description: The ID of the track this station belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Interface for Station document
export interface IStation extends Document {
    name: string;
    trackId: ObjectId;
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