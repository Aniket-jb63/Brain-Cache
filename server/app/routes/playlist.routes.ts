import express from 'express';
import { createPlaylist, getPlaylist, addToPlaylist/*removeFromPlaylist, deletePlaylist, updatePlaylist*/ } from '../controllers/playlist.controller';
import { jwtAuth } from '../jwt/jwtAuth';

const router = express.Router();

router.post('/', jwtAuth, createPlaylist);
router.get('/:id', getPlaylist);
// router.put('/:id', jwtAuth, updatePlaylist);
// router.delete('/:id', jwtAuth, deletePlaylist);
router.post('/:id/items', jwtAuth, addToPlaylist);
// router.delete('/:id/items/:itemId', jwtAuth, removeFromPlaylist);

export default router;