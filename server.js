
// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req, res) => {
  // TODO: Parse Excel and store to DB
  res.json({ status: "Files received" });
});

app.post('/generate-schedule', (req, res) => {
  // TODO: Implement scheduling algorithm with constraints C1–C14
  res.json({ message: "Sample schedule output here" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
