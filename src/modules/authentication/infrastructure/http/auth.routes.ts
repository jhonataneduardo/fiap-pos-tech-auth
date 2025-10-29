import { Router } from 'express';
import { AuthApiController } from '../controllers/http/auth-api.controller';
import { validate } from '@/core/infrastructure/http/middlewares/validation';
import {
  registerUserSchema,
} from '../../application/dtos/register-user.dto';
import { loginSchema } from '../../application/dtos/login.dto';
import { refreshTokenSchema } from '../../application/dtos/refresh-token.dto';
import { logoutSchema } from '../../application/dtos/logout.dto';

const router = Router();

router.post('/register', validate(registerUserSchema), AuthApiController.register);
router.post('/login', validate(loginSchema), AuthApiController.login);
router.post('/refresh', validate(refreshTokenSchema), AuthApiController.refresh);
router.post('/logout', validate(logoutSchema), AuthApiController.logout);

export default router;
