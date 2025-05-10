import { Router, Request, Response } from 'express';
import { Examinee } from '../models/examinee';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Examinee:
 *       type: object
 *       required:
 *         - name
 *         - studentId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Full name of the examinee
 *         studentId:
 *           type: string
 *           description: Unique student identification number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the examinee
 *         examDate:
 *           type: string
 *           format: date-time
 *           description: Scheduled examination date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const examineeController = {
    async create(req: Request, res: Response) {
        try {
            const examinee = new Examinee(req.body);
            await examinee.save();
            res.status(201).json(examinee);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error creating examinee' });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const examinees = await Examinee.find();
            res.json(examinees);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching examinees' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const examinee = await Examinee.findById(req.params.id);
            if (!examinee) {
                res.status(404).json({ message: 'Examinee not found' });
                return;
            }
            res.json(examinee);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching examinee' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const examinee = await Examinee.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!examinee) {
                 res.status(404).json({ message: 'Examinee not found' });
                 return;
            }
            res.json(examinee);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error updating examinee' });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const examinee = await Examinee.findByIdAndDelete(req.params.id);
            if (!examinee) {
                res.status(404).json({ message: 'Examinee not found' });
                return;
            }
            res.json({ message: 'Examinee deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error deleting examinee' });
        }
    }
};

/**
 * @swagger
 * /api/examinees:
 *   post:
 *     summary: Create a new examinee
 *     tags: [Examinees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examinee'
 *     responses:
 *       201:
 *         description: Examinee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Examinee'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', examineeController.create);

/**
 * @swagger
 * /api/examinees:
 *   get:
 *     summary: Get all examinees
 *     tags: [Examinees]
 *     responses:
 *       200:
 *         description: List of all examinees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Examinee'
 */
router.get('/', examineeController.getAll);

/**
 * @swagger
 * /api/examinees/{id}:
 *   get:
 *     summary: Get an examinee by ID
 *     tags: [Examinees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee ID
 *     responses:
 *       200:
 *         description: Examinee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Examinee'
 *       404:
 *         description: Examinee not found
 */
router.get('/:id', examineeController.getById);

/**
 * @swagger
 * /api/examinees/{id}:
 *   put:
 *     summary: Update an examinee
 *     tags: [Examinees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examinee'
 *     responses:
 *       200:
 *         description: Examinee updated successfully
 *       404:
 *         description: Examinee not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', examineeController.update);

/**
 * @swagger
 * /api/examinees/{id}:
 *   delete:
 *     summary: Delete an examinee
 *     tags: [Examinees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee ID
 *     responses:
 *       200:
 *         description: Examinee deleted successfully
 *       404:
 *         description: Examinee not found
 */
router.delete('/:id', examineeController.delete);

export default router;
