import { Router } from 'express';
import featureRoutes from './feature.routes.js';
import voteRoutes from './vote.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/features', featureRoutes);
router.use('/votes', voteRoutes);
router.use('/users', userRoutes);

export default router;
