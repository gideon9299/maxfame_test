import { Router, Request, Response } from 'express';
import { Examinee } from '../models/examinee';
import multer from 'multer';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

const router = Router();
const upload = multer();

interface CSVRecord {
    examineeId: string;
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
 *     BulkUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Status message
 *         success:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               examineeId:
 *                 type: string
 *               name:
 *                 type: string
 *         failed:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               examineeId:
 *                 type: string
 *               name:
 *                 type: string
 *               reason:
 *                 type: string
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

/**
 * @swagger
 * /api/examinees/upload-csv:
 *   post:
 *     summary: Upload examinees from CSV file
 *     tags: [Examinees]
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
 *                 description: CSV file containing examinee data
 *     responses:
 *       200:
 *         description: CSV processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkUploadResponse'
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
        // Create a readable stream from the buffer
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        // Process the CSV file
        const parser = parse({
            columns: true,
            skip_empty_lines: true
        });

        const records: CSVRecord[] = [];
        
        // Parse CSV
        for await (const record of bufferStream.pipe(parser)) {
            records.push({
                examineeId: record.ExamineeID?.toString(),
                name: record.Name
            });
        }

        // Process records in bulk
        for (const record of records) {
            try {
                // Check if examinee already exists
                const existing = await Examinee.findOne({ examineeId: record.examineeId });
                
                if (existing) {
                    // Update existing examinee
                    await Examinee.findByIdAndUpdate(existing._id, record);
                } else {
                    // Create new examinee
                    await Examinee.create(record);
                }
                
                results.success.push(record);
            } catch (error: any) {                const failedRecord: CSVRecord & { reason: string } = {
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
