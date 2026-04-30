import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './infrastructure/db/index.js';
import emergencyRouter from './api/report.js';
import feedbackRouter from './api/feedback.js';
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/emergency', emergencyRouter);
app.use('/api/feedback', feedbackRouter);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});