import { prismaMock } from '../setup';
import { FeatureService } from '../../services/feature.service';
import { NotFoundError } from '../../middleware/errorHandler';

describe('FeatureService', () => {
  let featureService: FeatureService;

  beforeEach(() => {
    featureService = new FeatureService(prismaMock as any);
  });

  const createMockUser = (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides,
  });

  const createMockFeature = (overrides = {}) => ({
    id: 'feature-1',
    title: 'Test Feature',
    description: 'Test description',
    voteCount: 0,
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMockVote = (overrides = {}) => ({
    id: 'vote-1',
    userId: 'user-1',
    featureId: 'feature-1',
    createdAt: new Date(),
    ...overrides,
  });

  describe('getAllFeatures', () => {
    it('should return all features sorted by voteCount descending', async () => {
      const mockFeatures = [
        createMockFeature({ id: 'f1', voteCount: 10, createdBy: createMockUser() }),
        createMockFeature({ id: 'f2', voteCount: 5, createdBy: createMockUser() }),
      ];
      prismaMock.feature.findMany.mockResolvedValue(mockFeatures as any);

      const result = await featureService.getAllFeatures();

      expect(result).toEqual(mockFeatures);
      expect(prismaMock.feature.findMany).toHaveBeenCalledWith({
        orderBy: { voteCount: 'desc' },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    it('should return empty array when no features exist', async () => {
      prismaMock.feature.findMany.mockResolvedValue([]);

      const result = await featureService.getAllFeatures();

      expect(result).toEqual([]);
    });
  });

  describe('getFeatureById', () => {
    it('should return feature with votes when found', async () => {
      const mockFeature = {
        ...createMockFeature(),
        createdBy: createMockUser(),
        votes: [createMockVote()],
      };
      prismaMock.feature.findUnique.mockResolvedValue(mockFeature as any);

      const result = await featureService.getFeatureById('feature-1');

      expect(result).toEqual(mockFeature);
      expect(prismaMock.feature.findUnique).toHaveBeenCalledWith({
        where: { id: 'feature-1' },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          votes: true,
        },
      });
    });

    it('should throw NotFoundError when feature does not exist', async () => {
      prismaMock.feature.findUnique.mockResolvedValue(null);

      await expect(featureService.getFeatureById('non-existent'))
        .rejects.toThrow(NotFoundError);
      await expect(featureService.getFeatureById('non-existent'))
        .rejects.toThrow('Feature not found');
    });
  });

  describe('createFeature', () => {
    it('should create feature when user exists', async () => {
      const user = createMockUser();
      const createdFeature = {
        ...createMockFeature(),
        createdBy: user,
      };
      
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.feature.create.mockResolvedValue(createdFeature as any);

      const result = await featureService.createFeature({
        title: 'New Feature',
        description: 'Feature description',
        createdByEmail: 'test@example.com',
      });

      expect(result).toEqual(createdFeature);
      expect(prismaMock.feature.create).toHaveBeenCalledWith({
        data: {
          title: 'New Feature',
          description: 'Feature description',
          createdById: user.id,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(featureService.createFeature({
        title: 'New Feature',
        description: 'Feature description',
        createdByEmail: 'nonexistent@example.com',
      })).rejects.toThrow(NotFoundError);

      await expect(featureService.createFeature({
        title: 'New Feature',
        description: 'Feature description',
        createdByEmail: 'nonexistent@example.com',
      })).rejects.toThrow('User not found with email: nonexistent@example.com');

      expect(prismaMock.feature.create).not.toHaveBeenCalled();
    });
  });

  describe('voteOnFeature', () => {
    it('should create vote and increment voteCount when user has no existing vote', async () => {
      const user = createMockUser();
      const feature = createMockFeature({ voteCount: 5 });
      const vote = createMockVote();
      const updatedFeature = { id: 'feature-1', title: 'Test Feature', voteCount: 6 };

      prismaMock.feature.findUnique.mockResolvedValue(feature as any);
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.findFirst.mockResolvedValue(null); // No existing vote
      prismaMock.vote.create.mockResolvedValue(vote as any);
      prismaMock.feature.update.mockResolvedValue(updatedFeature as any);

      const result = await featureService.voteOnFeature('feature-1', 'test@example.com');

      expect(result.vote).toEqual(vote);
      expect(result.feature.voteCount).toBe(6);
      expect(prismaMock.vote.findFirst).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(prismaMock.feature.update).toHaveBeenCalledWith({
        where: { id: 'feature-1' },
        data: { voteCount: { increment: 1 } },
        select: { id: true, title: true, voteCount: true },
      });
    });

    it('should return success when user votes for same feature again', async () => {
      const user = createMockUser();
      const feature = createMockFeature({ voteCount: 5 });
      const existingVote = createMockVote({ userId: 'user-1', featureId: 'feature-1' });

      prismaMock.feature.findUnique.mockResolvedValueOnce(feature as any) // First call in voteOnFeature
        .mockResolvedValueOnce(feature as any); // Second call when getting current feature
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.findFirst.mockResolvedValue(existingVote as any);

      const result = await featureService.voteOnFeature('feature-1', 'test@example.com');

      expect(result.vote).toEqual(existingVote);
      expect(result.feature.voteCount).toBe(5); // Vote count unchanged
      expect(prismaMock.vote.create).not.toHaveBeenCalled();
      expect(prismaMock.vote.delete).not.toHaveBeenCalled();
    });

    it('should update vote when user changes vote to different feature', async () => {
      const user = createMockUser();
      const newFeature = createMockFeature({ id: 'feature-2', voteCount: 3 });
      const existingVote = createMockVote({ userId: 'user-1', featureId: 'feature-1' });
      const newVote = createMockVote({ id: 'vote-2', userId: 'user-1', featureId: 'feature-2' });
      const updatedNewFeature = { id: 'feature-2', title: 'Test Feature', voteCount: 4 };

      prismaMock.feature.findUnique.mockResolvedValue(newFeature as any);
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.findFirst.mockResolvedValue(existingVote as any);

      // Mock transaction
      let updateCallCount = 0;
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          vote: {
            delete: async () => ({}),
            create: async () => newVote,
          },
          feature: {
            update: async () => {
              updateCallCount++;
              return updateCallCount === 1 ? {} : updatedNewFeature;
            },
          },
        };
        return await callback(mockTx);
      });

      const result = await featureService.voteOnFeature('feature-2', 'test@example.com');

      expect(result.vote.featureId).toBe('feature-2');
      expect(result.feature.voteCount).toBe(4);
      expect(prismaMock.$transaction).toHaveBeenCalled();
    });

    it('should allow user to vote on their own feature', async () => {
      const user = createMockUser({ id: 'user-1' });
      const feature = createMockFeature({ createdById: 'user-1', voteCount: 0 });
      const vote = createMockVote({ userId: 'user-1', featureId: 'feature-1' });
      const updatedFeature = { id: 'feature-1', title: 'Test Feature', voteCount: 1 };

      prismaMock.feature.findUnique.mockResolvedValue(feature as any);
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.findFirst.mockResolvedValue(null);
      prismaMock.vote.create.mockResolvedValue(vote as any);
      prismaMock.feature.update.mockResolvedValue(updatedFeature as any);

      const result = await featureService.voteOnFeature('feature-1', 'test@example.com');

      expect(result.vote).toBeDefined();
      expect(result.feature.voteCount).toBe(1);
    });

    it('should throw NotFoundError when feature does not exist', async () => {
      prismaMock.feature.findUnique.mockResolvedValue(null);

      await expect(featureService.voteOnFeature('non-existent', 'test@example.com'))
        .rejects.toThrow(NotFoundError);
      await expect(featureService.voteOnFeature('non-existent', 'test@example.com'))
        .rejects.toThrow('Feature not found');

      expect(prismaMock.vote.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const feature = createMockFeature();
      prismaMock.feature.findUnique.mockResolvedValue(feature as any);
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(featureService.voteOnFeature('feature-1', 'nonexistent@example.com'))
        .rejects.toThrow(NotFoundError);
      await expect(featureService.voteOnFeature('feature-1', 'nonexistent@example.com'))
        .rejects.toThrow('User not found with email: nonexistent@example.com');

      expect(prismaMock.vote.create).not.toHaveBeenCalled();
    });
  });

  describe('removeVote', () => {
    it('should delete vote and decrement voteCount when valid', async () => {
      const user = createMockUser();
      const updatedFeature = { id: 'feature-1', title: 'Test Feature', voteCount: 4 };

      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.delete.mockResolvedValue({} as any);
      prismaMock.feature.update.mockResolvedValue(updatedFeature as any);

      const result = await featureService.removeVote('feature-1', 'test@example.com');

      expect(result.message).toBe('Vote removed successfully');
      expect(result.feature.voteCount).toBe(4);
      expect(prismaMock.vote.delete).toHaveBeenCalledWith({
        where: {
          userId_featureId: {
            userId: user.id,
            featureId: 'feature-1',
          },
        },
      });
      expect(prismaMock.feature.update).toHaveBeenCalledWith({
        where: { id: 'feature-1' },
        data: { voteCount: { decrement: 1 } },
        select: { id: true, title: true, voteCount: true },
      });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(featureService.removeVote('feature-1', 'nonexistent@example.com'))
        .rejects.toThrow(NotFoundError);
      await expect(featureService.removeVote('feature-1', 'nonexistent@example.com'))
        .rejects.toThrow('User not found with email: nonexistent@example.com');

      expect(prismaMock.vote.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when vote does not exist (P2025)', async () => {
      const user = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      prismaMock.vote.delete.mockRejectedValue(prismaError);

      await expect(featureService.removeVote('feature-1', 'test@example.com'))
        .rejects.toThrow(NotFoundError);
      await expect(featureService.removeVote('feature-1', 'test@example.com'))
        .rejects.toThrow('Vote not found');

      expect(prismaMock.feature.update).not.toHaveBeenCalled();
    });

    it('should rethrow unexpected errors', async () => {
      const user = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(user as any);
      prismaMock.vote.delete.mockRejectedValue(new Error('Database error'));

      await expect(featureService.removeVote('feature-1', 'test@example.com'))
        .rejects.toThrow('Database error');
    });
  });
});
