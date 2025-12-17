import { prismaMock } from '../setup';
import { VoteService } from '../../services/vote.service';

describe('VoteService', () => {
  let voteService: VoteService;

  beforeEach(() => {
    voteService = new VoteService(prismaMock as any);
  });

  const createMockUser = (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  });

  const createMockFeature = (overrides = {}) => ({
    id: 'feature-1',
    title: 'Test Feature',
    voteCount: 5,
    ...overrides,
  });

  const createMockVote = (overrides = {}) => ({
    id: 'vote-1',
    userId: 'user-1',
    featureId: 'feature-1',
    createdAt: new Date(),
    user: createMockUser(),
    feature: createMockFeature(),
    ...overrides,
  });

  describe('getAllVotes', () => {
    it('should return all votes when no filters provided', async () => {
      const mockVotes = [
        createMockVote({ id: 'vote-1' }),
        createMockVote({ id: 'vote-2', userId: 'user-2' }),
      ];
      prismaMock.vote.findMany.mockResolvedValue(mockVotes as any);

      const result = await voteService.getAllVotes();

      expect(result).toEqual(mockVotes);
      expect(prismaMock.vote.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          feature: {
            select: { id: true, title: true, voteCount: true },
          },
        },
        where: {},
      });
    });

    it('should filter votes by featureId', async () => {
      const mockVotes = [createMockVote()];
      prismaMock.vote.findMany.mockResolvedValue(mockVotes as any);

      const result = await voteService.getAllVotes({ featureId: 'feature-1' });

      expect(result).toEqual(mockVotes);
      expect(prismaMock.vote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { featureId: 'feature-1' },
        })
      );
    });

    it('should filter votes by userEmail', async () => {
      const mockVotes = [createMockVote()];
      prismaMock.vote.findMany.mockResolvedValue(mockVotes as any);

      const result = await voteService.getAllVotes({ userEmail: 'test@example.com' });

      expect(result).toEqual(mockVotes);
      expect(prismaMock.vote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user: { email: 'test@example.com' } },
        })
      );
    });

    it('should apply combined filters (featureId + userEmail)', async () => {
      const mockVotes = [createMockVote()];
      prismaMock.vote.findMany.mockResolvedValue(mockVotes as any);

      const result = await voteService.getAllVotes({
        featureId: 'feature-1',
        userEmail: 'test@example.com',
      });

      expect(result).toEqual(mockVotes);
      expect(prismaMock.vote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            featureId: 'feature-1',
            user: { email: 'test@example.com' },
          },
        })
      );
    });

    it('should return empty array when no votes match filters', async () => {
      prismaMock.vote.findMany.mockResolvedValue([]);

      const result = await voteService.getAllVotes({ featureId: 'non-existent' });

      expect(result).toEqual([]);
    });
  });
});
