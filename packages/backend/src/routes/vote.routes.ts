import { Router } from 'express';
import * as voteController from '../controllers/vote.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import * as validators from '../validators/vote.validator.js';

const router = Router();

router.get(
  '/',
  validateRequest(validators.getVotesSchema),
  voteController.getAllVotes
);

export default router;
