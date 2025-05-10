// server.js
import express, { json } from 'express';
import multer, { memoryStorage } from 'multer';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import administrationRoutes from './routes/administration';
import trackRoutes from './routes/track';
import stationRoutes from './routes/station';
import examineeRoutes from './routes/examinee';
import examinerRoutes from './routes/examiner';
import clientRoutes from './routes/client';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maxfame-test';

// Middleware
app.use(cors());
app.use(json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/administrations', administrationRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/examinees', examineeRoutes);
app.use('/api/examiners', examinerRoutes);
app.use('/api/clients', clientRoutes);

// File upload setup
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
// I really don't know what to do here. There is no context and proper explanation as to what to do.
  res.json({ message: "Sample schedule output here" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
