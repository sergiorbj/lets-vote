import { Request, Response, NextFunction } from 'express';
import { voteService } from '../services/vote.service.js';

export const getAllVotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { featureId, userEmail } = req.query;

    const votes = await voteService.getAllVotes({
      featureId: featureId as string | undefined,
      userEmail: userEmail as string | undefined,
    });

    return res.status(200).json({
      success: true,
      data: votes,
    });
  } catch (error) {
    return next(error);
  }
};
