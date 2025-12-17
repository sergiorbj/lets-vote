import { Request, Response, NextFunction } from 'express';
import { featureService } from '../services/feature.service.js';

export const getAllFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const features = await featureService.getAllFeatures();

    return res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    return next(error);
  }
};

export const getFeatureById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const feature = await featureService.getFeatureById(id);

    return res.status(200).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    return next(error);
  }
};

export const createFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, createdByEmail } = req.body;

    const feature = await featureService.createFeature({
      title,
      description,
      createdByEmail,
    });

    return res.status(201).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    return next(error);
  }
};

export const voteOnFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    const result = await featureService.voteOnFeature(id, userEmail);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    const result = await featureService.removeVote(id, userEmail);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
