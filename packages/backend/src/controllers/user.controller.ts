import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
