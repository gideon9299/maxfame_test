import { Router, Request, Response } from 'express';
import { Administration } from '../models/administration';

interface CreateAdministrationDto {
    name: string;
    tracks?: string[];
}

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAdministrationDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the administration
 *         tracks:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of track IDs associated with this administration
 *       example:
 *         name: "Spring 2025 Administration"
 *         tracks: ["645f3a1b2c45d", "645f3a1b2c45e"]
 */

/**
 * Administration Controller Functions
 */
const administrationController = {
    // Create a new administration
    async create(req: Request<{}, {}, CreateAdministrationDto>, res: Response): Promise<void> {
        try {
            const dto = req.body;
            
            // Validate required fields
            if (!dto.name?.trim()) {
                res.status(400).json({ message: 'Name is required and cannot be empty' });
                return;
            }

            const administration = new Administration({
                name: dto.name.trim(),
               
            });
            
            await administration.save();
            res.status(201).json(administration);
        } catch (error: any) {
            res.status(400).json({ 
                message: error?.message || 'Error creating administration',
                error: error
            });
        }
    },

    // Get all administrations
    async getAll(req: Request, res: Response) {
        try {
            const administrations = await Administration.find();
            res.json(administrations);
        } catch (error) {
            res.status(500).json({error });
        }
    },

    // Get administration by ID
    async getById(req: Request, res: Response) {
        try {
            const administration = await Administration.findById(req.params.id);
            if (!administration) {
                 res.status(404).json({ message: 'Administration not found' });
                 return;
            }
            res.json(administration);
        } catch (error) {
            res.status(500).json({error });
        }
    },

    // Update administration
    async update(req: Request, res: Response) {
        try {
            const administration = await Administration.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!administration) {
                 res.status(404).json({ message: 'Administration not found' });
                 return;
            }
            res.json(administration);
        } catch (error) {
            res.status(400).json({error });
        }
    },

    // Delete administration
    async delete(req: Request, res: Response) {
        try {
            const administration = await Administration.findByIdAndDelete(req.params.id);
            if (!administration) {
                res.status(404).json({ message: 'Administration not found' });
                return;
            }
            res.json({ message: 'Administration deleted' });
        } catch (error) {
            res.status(500).json({error });
        }
    }
};

/**
 * Administration Routes
 */

/**
 * @swagger
 * /api/administrations:
 *   post:
 *     summary: Create a new administration
 *     tags: [Administrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdministrationDto'
 *     responses:
 *       201:
 *         description: Administration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The administration ID
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 - $ref: '#/components/schemas/CreateAdministrationDto'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */
router.post('/', administrationController.create as (req: Request, res: Response) => Promise<void>);

/**
 * @swagger
 * /api/administrations:
 *   get:
 *     summary: Get all administrations
 *     tags: [Administrations]
 *     responses:
 *       200:
 *         description: List of all administrations
 */
router.get('/', administrationController.getAll);

/**
 * @swagger
 * /api/administrations/{id}:
 *   get:
 *     summary: Get an administration by id
 *     tags: [Administrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', administrationController.getById);

/**
 * @swagger
 * /api/administrations/{id}:
 *   put:
 *     summary: Update an administration
 *     tags: [Administrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.put('/:id', administrationController.update);

/**
 * @swagger
 * /api/administrations/{id}:
 *   delete:
 *     summary: Delete an administration
 *     tags: [Administrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
router.delete('/:id', administrationController.delete);

export default router;
