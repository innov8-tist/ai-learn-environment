import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', isAuthenticated, userRoutes);

export default router; 