import { prisma as defaultPrisma, PrismaClientType } from '../db/client.js';
import { NotFoundError } from '../middleware/errorHandler.js';

interface CreateFeatureData {
  title: string;
  description: string;
  createdByEmail: string;
}

export class FeatureService {
  constructor(private prisma: PrismaClientType = defaultPrisma) {}

  async getAllFeatures() {
    return await this.prisma.feature.findMany({
      orderBy: { voteCount: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getFeatureById(id: string) {
    const feature = await this.prisma.feature.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        votes: true,
      },
    });

    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    return feature;
  }

  async createFeature(data: CreateFeatureData) {
    const { title, description, createdByEmail } = data;

    const user = await this.prisma.user.findUnique({
      where: { email: createdByEmail },
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${createdByEmail}`);
    }

    return await this.prisma.feature.create({
      data: {
        title,
        description,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async voteOnFeature(featureId: string, userEmail: string) {
    const feature = await this.prisma.feature.findUnique({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${userEmail}`);
    }

    // Check if user already has a vote
    const existingVote = await this.prisma.vote.findFirst({
      where: { userId: user.id },
    });

    // If user is voting for the same feature, return success (no change needed)
    if (existingVote && existingVote.featureId === featureId) {
      const currentFeature = await this.prisma.feature.findUnique({
        where: { id: featureId },
        select: { id: true, title: true, voteCount: true },
      });

      return { vote: existingVote, feature: currentFeature! };
    }

    // If user is changing their vote to a different feature
    if (existingVote && existingVote.featureId !== featureId) {
      // Use a transaction to ensure atomicity
      const result = await this.prisma.$transaction(async (tx) => {
        // Delete old vote
        await tx.vote.delete({
          where: { id: existingVote.id },
        });

        // Decrement old feature vote count
        await tx.feature.update({
          where: { id: existingVote.featureId },
          data: { voteCount: { decrement: 1 } },
        });

        // Create new vote
        const newVote = await tx.vote.create({
          data: {
            userId: user.id,
            featureId: featureId,
          },
        });

        // Increment new feature vote count
        const updatedFeature = await tx.feature.update({
          where: { id: featureId },
          data: { voteCount: { increment: 1 } },
          select: { id: true, title: true, voteCount: true },
        });

        return { vote: newVote, feature: updatedFeature };
      });

      return result;
    }

    // User has no existing vote, create new one
    const vote = await this.prisma.vote.create({
      data: {
        userId: user.id,
        featureId: featureId,
      },
    });

    const updatedFeature = await this.prisma.feature.update({
      where: { id: featureId },
      data: { voteCount: { increment: 1 } },
      select: { id: true, title: true, voteCount: true },
    });

    return { vote, feature: updatedFeature };
  }

  async removeVote(featureId: string, userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${userEmail}`);
    }

    try {
      await this.prisma.vote.delete({
        where: {
          userId_featureId: {
            userId: user.id,
            featureId: featureId,
          },
        },
      });

      const updatedFeature = await this.prisma.feature.update({
        where: { id: featureId },
        data: { voteCount: { decrement: 1 } },
        select: { id: true, title: true, voteCount: true },
      });

      return {
        message: 'Vote removed successfully',
        feature: updatedFeature,
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Vote not found');
      }
      throw error;
    }
  }
}

// Default instance for production use
export const featureService = new FeatureService();
