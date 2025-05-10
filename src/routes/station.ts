import { Router, Request, Response } from 'express';
import { Station } from '../models/station';

const router = Router();

/**
 * Station Controller Functions
 */
const stationController = {
    // Create a new station
    async create(req: Request, res: Response) {
        try {
            const station = new Station(req.body);
            await station.save();
            res.status(201).json(station);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error creating station' });
        }
    },

    // Get all stations
    async getAll(req: Request, res: Response) {
        try {
            const stations = await Station.find();
            res.json(stations);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching stations' });
        }
    },

    // Get station by ID
    async getById(req: Request, res: Response) {
        try {
            const station = await Station.findById(req.params.id);
            if (!station) {
                 res.status(404).json({ message: 'Station not found' });
                 return
            }
            res.json(station);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching station' });
        }
    },

    // Update station
    async update(req: Request, res: Response) {
        try {
            const station = await Station.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!station) {
                res.status(404).json({ message: 'Station not found' });
                return
            }
            res.json(station);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error updating station' });
        }
    },

    // Delete station
    async delete(req: Request, res: Response) {
        try {
            const station = await Station.findByIdAndDelete(req.params.id);
            if (!station) {
                res.status(404).json({ message: 'Station not found' });
                return
            }
            res.json({ message: 'Station deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error deleting station' });
        }
    }
};

/**
 * Station Routes
 */

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Create a new station
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       201:
 *         description: Station created successfully
 */
router.post('/', stationController.create);

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all stations
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: List of all stations
 */
router.get('/', stationController.getAll);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get a station by id
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', stationController.getById);

/**
 * @swagger
 * /api/stations/{id}:
 *   put:
 *     summary: Update a station
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.put('/:id', stationController.update);

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a station
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.delete('/:id', stationController.delete);

export default router;
