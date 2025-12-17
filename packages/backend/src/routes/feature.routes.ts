import { Router } from 'express';
import * as featureController from '../controllers/feature.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import * as validators from '../validators/feature.validator.js';

const router = Router();

router.get('/', featureController.getAllFeatures);

router.get(
  '/:id',
  validateRequest(validators.getFeatureByIdSchema),
  featureController.getFeatureById
);

router.post(
  '/',
  validateRequest(validators.createFeatureSchema),
  featureController.createFeature
);

router.post(
  '/:id/vote',
  validateRequest(validators.voteOnFeatureSchema),
  featureController.voteOnFeature
);

router.delete(
  '/:id/vote',
  validateRequest(validators.voteOnFeatureSchema),
  featureController.removeVote
);

export default router;
