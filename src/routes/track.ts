import { Router, Request, Response } from 'express';
import { Track } from '../models/track';

const router = Router();

/**
 * Track Controller Functions
 */
const trackController = {
    // Create a new track
    async create(req: Request, res: Response) {
        try {
            const track = new Track(req.body);
            await track.save();
            res.status(201).json(track);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error creating track' });
        }
    },

    // Get all tracks
    async getAll(req: Request, res: Response) {
        try {
            const tracks = await Track.find();
            res.json(tracks);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching tracks' });
        }
    },

    // Get track by ID
    async getById(req: Request, res: Response) {
        try {
            const track = await Track.findById(req.params.id);
            if (!track) {
                 res.status(404).json({ message: 'Track not found' });
                 return;
            }
            res.json(track);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching track' });
        }
    },

    // Update track
    async update(req: Request, res: Response) {
        try {
            const track = await Track.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!track) {
                res.status(404).json({ message: 'Track not found' });
                return
            }
            res.json(track);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error updating track' });
        }
    },

    // Delete track
    async delete(req: Request, res: Response) {
        try {
            const track = await Track.findByIdAndDelete(req.params.id);
            if (!track) {
                res.status(404).json({ message: 'Track not found' });
                return
            }
            res.json({ message: 'Track deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error deleting track' });
        }
    }
};

/**
 * Track Routes
 */

/**
 * @swagger
 * /api/tracks:
 *   post:
 *     summary: Create a new track
 *     tags: [Tracks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: Track created successfully
 */
router.post('/', trackController.create);

/**
 * @swagger
 * /api/tracks:
 *   get:
 *     summary: Get all tracks
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: List of all tracks
 */
router.get('/', trackController.getAll);

/**
 * @swagger
 * /api/tracks/{id}:
 *   get:
 *     summary: Get a track by id
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', trackController.getById);

/**
 * @swagger
 * /api/tracks/{id}:
 *   put:
 *     summary: Update a track
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.put('/:id', trackController.update);

/**
 * @swagger
 * /api/tracks/{id}:
 *   delete:
 *     summary: Delete a track
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.delete('/:id', trackController.delete);

export default router;
