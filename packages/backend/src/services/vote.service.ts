import { prisma as defaultPrisma, PrismaClientType } from '../db/client.js';

interface GetVotesOptions {
  featureId?: string;
  userEmail?: string;
}

export class VoteService {
  constructor(private prisma: PrismaClientType = defaultPrisma) {}

  async getAllVotes(options?: GetVotesOptions) {
    const where: any = {};

    if (options?.featureId) {
      where.featureId = options.featureId;
    }

    if (options?.userEmail) {
      where.user = {
        email: options.userEmail,
      };
    }

    return await this.prisma.vote.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        feature: {
          select: { id: true, title: true, voteCount: true },
        },
      },
      where,
    });
  }
}

// Default instance for production use
export const voteService = new VoteService();
