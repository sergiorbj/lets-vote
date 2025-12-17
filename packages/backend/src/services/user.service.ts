import { prisma as defaultPrisma, PrismaClientType } from '../db/client.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export class UserService {
  constructor(private prisma: PrismaClientType = defaultPrisma) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        features: true,
        votes: {
          include: { feature: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

// Default instance for production use
export const userService = new UserService();
