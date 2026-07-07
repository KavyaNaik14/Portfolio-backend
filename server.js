import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio API is running.',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});