import { Request, Response } from 'express';
import prisma from '../prismaclient.js';

// GET with pagination + filters
export const getVideoData = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10', genre, tag } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  try {
    const videos = await prisma.video.findMany({
      skip: skip,
      take: parseInt(limit as string),
      where: {
        ...(genre && typeof genre === 'string' ? { genre } : {}),
        ...(tag && typeof tag === 'string' ? { tag: { hasSome: [tag] } } : {}),
      },
    });

    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

// ADD
export const addVideoData = async (req: Request, res: Response): Promise<void> => {
  const { title, description, duration, genre, tag } = req.body;

  try {
    const newVideo = await prisma.video.create({
      data: { title, description, duration, genre, tag },
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error creating video' });
  }
};

// UPDATE
export const updateData = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, duration, genre, tag } = req.body;

  try {
    const updatedVideoData = await prisma.video.update({
      where: { id: Number(id) },
      data: { title, description, duration, genre, tag },
    });

    res.json(updatedVideoData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating video' });
  }
};

// DELETE
export const deleteData = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedVideoData = await prisma.video.delete({
      where: { id: Number(id) },
    });

    res.json(deletedVideoData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};
