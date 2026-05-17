import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

export default router;
