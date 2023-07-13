import express from 'express';
import { dashboardController } from '../controllers/userController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
const router = express();
router.post('/dashboard', requireSignIn, dashboardController);

export default router;