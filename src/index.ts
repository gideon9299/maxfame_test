
// server.js
import express, { json } from 'express';
import multer, { memoryStorage } from 'multer';
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());

const storage = memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/upload', upload.array('files'), (req, res) => {
  // TODO: Parse Excel and store to DB
  res.json({ status: "Files received" });
});

app.post('/generate-schedule', (req, res) => {
  // TODO: Implement scheduling algorithm with constraints C1–C14
  res.json({ message: "Sample schedule output here" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
