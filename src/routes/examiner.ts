import { Router, Request, Response } from 'express';
import { Examiner } from '../models/examiner';
import multer from 'multer';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

const router = Router();
const upload = multer();

interface CSVRecord {
    examinerId: string;
    name: string;
}

interface UploadResult {
    success: CSVRecord[];
    failed: (CSVRecord & { reason: string })[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Examiner:
 *       type: object
 *       required:
 *         - name
 *         - specialization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Full name of the examiner
 *         specialization:
 *           type: string
 *           description: Area of specialization
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the examiner
 *         contactNumber:
 *           type: string
 *           description: Contact number
 *         availability:
 *           type: array
 *           items:
 *             type: string
 *             format: date-time
 *           description: Available examination dates and times
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const examinerController = {
    async create(req: Request, res: Response) {
        try {
            const examiner = new Examiner(req.body);
            await examiner.save();
            res.status(201).json(examiner);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error creating examiner' });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const examiners = await Examiner.find();
            res.json(examiners);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching examiners' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const examiner = await Examiner.findById(req.params.id);
            if (!examiner) {
                 res.status(404).json({ message: 'Examiner not found' });
                 return;
            }
            res.json(examiner);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching examiner' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const examiner = await Examiner.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!examiner) {
                res.status(404).json({ message: 'Examiner not found' });
                return;
            }
            res.json(examiner);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error updating examiner' });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const examiner = await Examiner.findByIdAndDelete(req.params.id);
            if (!examiner) {
                res.status(404).json({ message: 'Examiner not found' });
                return;
            }
            res.json({ message: 'Examiner deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error deleting examiner' });
        }
    }
};

/**
 * @swagger
 * /api/examiners:
 *   post:
 *     summary: Create a new examiner
 *     tags: [Examiners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examiner'
 *     responses:
 *       201:
 *         description: Examiner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Examiner'
 *       400:
 *         description: Invalid input data
 */
router.post('/', examinerController.create);

/**
 * @swagger
 * /api/examiners:
 *   get:
 *     summary: Get all examiners
 *     tags: [Examiners]
 *     responses:
 *       200:
 *         description: List of all examiners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Examiner'
 */
router.get('/', examinerController.getAll);

/**
 * @swagger
 * /api/examiners/{id}:
 *   get:
 *     summary: Get an examiner by ID
 *     tags: [Examiners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examiner ID
 *     responses:
 *       200:
 *         description: Examiner details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Examiner'
 *       404:
 *         description: Examiner not found
 */
router.get('/:id', examinerController.getById);

/**
 * @swagger
 * /api/examiners/{id}:
 *   put:
 *     summary: Update an examiner
 *     tags: [Examiners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examiner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Examiner'
 *     responses:
 *       200:
 *         description: Examiner updated successfully
 *       404:
 *         description: Examiner not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', examinerController.update);

/**
 * @swagger
 * /api/examiners/{id}:
 *   delete:
 *     summary: Delete an examiner
 *     tags: [Examiners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examiner ID
 *     responses:
 *       200:
 *         description: Examiner deleted successfully
 *       404:
 *         description: Examiner not found
 */
router.delete('/:id', examinerController.delete);

/**
 * @swagger
 * /api/examiners/upload-csv:
 *   post:
 *     summary: Upload examiners from CSV file
 *     tags: [Examiners]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing examiner data
 *     responses:
 *       200:
 *         description: CSV processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalProcessed:
 *                   type: number
 *                 successCount:
 *                   type: number
 *                 failureCount:
 *                   type: number
 *                 success:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Examiner'
 *                 failed:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       examinerId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       reason:
 *                         type: string
 *       400:
 *         description: Invalid file format or content
 */
router.post('/upload-csv', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    if (req.file.mimetype !== 'text/csv') {
        res.status(400).json({ message: 'Please upload a CSV file' });
        return;
    }

    const results: UploadResult = {
        success: [],
        failed: []
    };

    try {
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const parser = parse({
            columns: true,
            skip_empty_lines: true
        });

        const records: CSVRecord[] = [];
        
        for await (const record of bufferStream.pipe(parser)) {
            records.push({
                examinerId: record.ExaminerID?.toString(),
                name: record.Name
            });
        }

        for (const record of records) {
            try {
                const existing = await Examiner.findOne({ examinerId: record.examinerId });
                
                if (existing) {
                    await Examiner.findByIdAndUpdate(existing._id, record);
                } else {
                    await Examiner.create(record);
                }
                
                results.success.push(record);
            } catch (error: any) {
                const failedRecord: CSVRecord & { reason: string } = {
                    ...record,
                    reason: error.message || 'Unknown error occurred'
                };
                results.failed.push(failedRecord);
            }
        }

        res.json({
            message: 'CSV processed successfully',
            totalProcessed: records.length,
            successCount: results.success.length,
            failureCount: results.failed.length,
            ...results
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Error processing CSV file',
            error: error.message
        });
    }
});

export default router;
