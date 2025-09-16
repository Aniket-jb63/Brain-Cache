import { Request, Response } from 'express';
import Playlist from '../models/PlaylistModel';

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      owner: req.user._id
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('items')
      .populate('owner', 'username');

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (!playlist.isPublic && playlist.owner._id.toString() !== req.user?._id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addToPlaylist = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $addToSet: { items: itemId } },
      { new: true }
    );
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};