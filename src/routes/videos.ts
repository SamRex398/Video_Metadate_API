import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addVideoData, getVideoData, updateData, deleteData } from '../controller/video.js';

const router = express.Router();

router.post('/add', authMiddleware('admin'), addVideoData);
router.get('/', authMiddleware(), getVideoData);

router.put('/:id', authMiddleware('admin'), updateData);
router.delete('/:id', authMiddleware('admin'), deleteData);

export default router;
