import express, { Router } from 'express';
import { saveNode, getNodes, sendMailFunctiom } from './controller/nodeController';

const router: Router = express.Router();

router.post('/flowdata', saveNode);
router.get('/flowdata/:ipAddress', getNodes);
router.post('/sendEmail',sendMailFunctiom)

export default router;