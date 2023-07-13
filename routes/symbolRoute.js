import express from 'express';
import symbolController from '../controllers/symbolController.js';

const router = express();

router.post("/", symbolController);

export default router;