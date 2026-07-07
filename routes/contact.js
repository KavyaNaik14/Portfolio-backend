import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactForm } from '../controllers/contactController.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

router.post('/', contactLimiter, submitContactForm);

export default router;