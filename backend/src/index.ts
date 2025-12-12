import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import itemRoutes from './routes/items.js';
import authRoutes from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import guideRoutes from './routes/guides.js';
import patchRoutes from './routes/patches.js';
import userRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';
import statsRoutes from './routes/stats.js';
import monolithRoutes from './routes/monolith.js';
import discordRoutes from './routes/discord.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

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

app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/patches', patchRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/monolith', monolithRoutes);
app.use('/api/v1/discord', discordRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for: ${clientUrl}\n`);
});

process.on('SIGINT', async () => {
  console.log('\n\n📋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
