import express from 'express';
import { createProfile, getProfile } from '../controllers/profile.js'; // Ensure the file extension is included

const router = express.Router();

router.post('/createProfile', createProfile);
router.get('/getProfile', getProfile);

export default router; // Use ES module export syntax