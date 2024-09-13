import express, { Router } from 'express';
import { saveNode, getNodes } from './controller/nodeController';

const router: Router = express.Router();

router.post('/flowdata', saveNode);
router.get('/flowdata/:ipAddress', getNodes);

export default router;