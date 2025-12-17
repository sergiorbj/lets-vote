import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import * as validators from '../validators/user.validator.js';

const router = Router();

router.get(
  '/:email',
  validateRequest(validators.getUserByEmailSchema),
  userController.getUserByEmail
);

export default router;
