import { Router, Request, Response } from 'express';
import { Client } from '../models/client';
import multer from 'multer';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

const router = Router();
const upload = multer();

interface CSVRecord {
    clientId: string;
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
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - scenario
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Full name of the standardized client
 *         scenario:
 *           type: string
 *           description: The scenario/case the client will portray
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the client
 *         contactNumber:
 *           type: string
 *           description: Contact number
 *         availability:
 *           type: array
 *           items:
 *             type: string
 *             format: date-time
 *           description: Available dates and times
 *         experience:
 *           type: number
 *           description: Years of experience as a standardized client
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const clientController = {
    async create(req: Request, res: Response) {
        try {
            const client = new Client(req.body);
            await client.save();
            res.status(201).json(client);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error creating client' });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const clients = await Client.find();
            res.json(clients);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching clients' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                 res.status(404).json({ message: 'Client not found' });
                 return;
            }
            res.json(client);
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error fetching client' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const client = await Client.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!client) {
                res.status(404).json({ message: 'Client not found' });
                return;
            }
            res.json(client);
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Error updating client' });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const client = await Client.findByIdAndDelete(req.params.id);
            if (!client) {
                res.status(404).json({ message: 'Client not found' });
                return;
            }
            res.json({ message: 'Client deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error?.message || 'Error deleting client' });
        }
    }
};

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new standardized client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Invalid input data
 */
router.post('/', clientController.create);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all standardized clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of all clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get('/', clientController.getAll);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get a standardized client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 */
router.get('/:id', clientController.getById);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a standardized client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', clientController.update);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a standardized client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/:id', clientController.delete);

/**
 * @swagger
 * /api/clients/upload-csv:
 *   post:
 *     summary: Upload standardized clients from CSV file
 *     tags: [Clients]
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
 *                 description: CSV file containing client data
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
 *                     $ref: '#/components/schemas/Client'
 *                 failed:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clientId:
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
                clientId: record.ClientID?.toString(),
                name: record.Name
            });
        }

        for (const record of records) {
            try {
                const existing = await Client.findOne({ clientId: record.clientId });
                
                if (existing) {
                    await Client.findByIdAndUpdate(existing._id, record);
                } else {
                    await Client.create(record);
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
