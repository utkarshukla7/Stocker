import express from 'express';
import { infoController, followController } from '../controllers/infoController.js';


const router = express();

router.post('/info', infoController);
router.post('/companydata', followController);
export default router;