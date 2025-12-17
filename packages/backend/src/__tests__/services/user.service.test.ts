import { prismaMock } from '../setup';
import { UserService } from '../../services/user.service';
import { NotFoundError } from '../../middleware/errorHandler';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prismaMock as any);
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
    voteCount: 5,
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

  describe('getUserByEmail', () => {
    it('should return user with features and votes when found', async () => {
      const mockUser = {
        ...createMockUser(),
        features: [createMockFeature()],
        votes: [
          {
            ...createMockVote(),
            feature: createMockFeature(),
          },
        ],
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(result.features).toHaveLength(1);
      expect(result.votes).toHaveLength(1);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: {
          features: true,
          votes: {
            include: { feature: true },
          },
        },
      });
    });

    it('should return user with empty features and votes arrays', async () => {
      const mockUser = {
        ...createMockUser(),
        features: [],
        votes: [],
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result.features).toEqual([]);
      expect(result.votes).toEqual([]);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserByEmail('nonexistent@example.com'))
        .rejects.toThrow(NotFoundError);
      await expect(userService.getUserByEmail('nonexistent@example.com'))
        .rejects.toThrow('User not found');
    });

    it('should include all user features created by the user', async () => {
      const mockUser = {
        ...createMockUser(),
        features: [
          createMockFeature({ id: 'f1', title: 'Feature 1' }),
          createMockFeature({ id: 'f2', title: 'Feature 2' }),
          createMockFeature({ id: 'f3', title: 'Feature 3' }),
        ],
        votes: [],
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result.features).toHaveLength(3);
    });

    it('should include all votes with their associated features', async () => {
      const mockUser = {
        ...createMockUser(),
        features: [],
        votes: [
          {
            ...createMockVote({ id: 'v1' }),
            feature: createMockFeature({ id: 'f1' }),
          },
          {
            ...createMockVote({ id: 'v2', featureId: 'f2' }),
            feature: createMockFeature({ id: 'f2' }),
          },
        ],
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result.votes).toHaveLength(2);
      expect(result.votes[0].feature).toBeDefined();
      expect(result.votes[1].feature).toBeDefined();
    });
  });
});
