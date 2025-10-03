import express from 'express';
import { generateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/accesstoken', generateToken);

export default router;
