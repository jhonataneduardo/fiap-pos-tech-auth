import { Router } from 'express';
import authRoutes from '@/modules/authentication/infrastructure/http/auth.routes';
import { AuthApiController } from '@/modules/authentication/infrastructure/controllers/http/auth-api.controller';

const router = Router();

// Health check
router.get('/health', AuthApiController.health);

// Authentication routes
router.use('/auth', authRoutes);

export default router;
