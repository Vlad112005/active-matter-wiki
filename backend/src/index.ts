import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import itemRoutes from './routes/items.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Active Matter Wiki API',
    version: '1.0.0',
    status: 'running',
    docs: `http://localhost:${port}/api/docs`,
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Service is healthy',
  });
});

// API Routes
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for: ${clientUrl}\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n📌 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
