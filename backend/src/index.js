import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './infrastructure/db/index.js';
import emergencyRouter from './api/report.js';
import feedbackRouter from './api/feedback.js';
import profileRouter from './api/profile.js';
import complaintRouter from './api/complaint.js';
import fs from 'fs';
import chatRouter from './api/chat.js';
import galleryRouter from './api/gallery.js';
import userRouter from './api/user.js';
import departmentRouter from './api/department.js';
import adminComplaintsRouter from './api/adminComplaints.js';
import setupRouter from './api/setup.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRouter);
// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/emergency', emergencyRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/profile', profileRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/users', userRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/admin/complaints', adminComplaintsRouter);
app.use('/api/setup', setupRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});