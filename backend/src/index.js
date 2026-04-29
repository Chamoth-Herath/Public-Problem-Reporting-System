import express from 'express';
import connectDB from './infrastructure/db/index.js';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

