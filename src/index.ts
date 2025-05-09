// server.js
import express, { json } from 'express';
import multer, { memoryStorage } from 'multer';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const storage = memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a hello world message
 *     responses:
 *       200:
 *         description: Hello World message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload Excel files
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *         description: Excel files to upload
 *     responses:
 *       200:
 *         description: Files successfully received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
app.post('/upload', upload.array('files'), (req, res) => {
  // TODO: Parse Excel and store to DB
  res.json({ status: "Files received" });
});

/**
 * @swagger
 * /generate-schedule:
 *   post:
 *     summary: Generate a schedule based on constraints
 *     responses:
 *       200:
 *         description: Schedule generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post('/generate-schedule', (req, res) => {
  // TODO: Implement scheduling algorithm with constraints C1–C14
  res.json({ message: "Sample schedule output here" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
