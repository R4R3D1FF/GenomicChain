import express from 'express';
import { createRequest, getRequest, approveRequest, rejectRequest } from '../controllers/request.js';

const router = express.Router();

router.post('/createRequest', createRequest);
router.get('/getRequest', getRequest);
router.post('/approveRequest', approveRequest);
router.post('/rejectRequest', rejectRequest);

export default router; 