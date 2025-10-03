import express, { Request, Response, NextFunction } from 'express';
import videosRouter from './routes/videos.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(express.json());

// Routes
app.use('/videos', videosRouter);
app.use('/auth', authRouter);

// Error handler middleware (basic)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
