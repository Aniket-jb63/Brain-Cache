import express from 'express';
import { jwtAuth } from '../jwt/jwtAuth';
import { GetShareId, GetshareOn, PostShareOff, PostshareOn } from '../controllers/share.controller';

const router = express.Router();

router.post('/shareon', jwtAuth, PostshareOn);
router.get('/shareon', jwtAuth, GetshareOn);
router.post('/shareoff', jwtAuth, PostShareOff);
router.get('/share/:id', GetShareId);

export default router;