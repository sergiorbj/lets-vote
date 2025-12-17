import { api } from './api';
import { Vote, Feature } from '../types';

export const voteService = {
  async getAllVotes(): Promise<Vote[]> {
    return api.get<Vote[]>('/votes');
  },

  async voteOnFeature(
    featureId: string,
    userEmail: string
  ): Promise<{ vote: Vote; feature: Feature }> {
    return api.post<{ vote: Vote; feature: Feature }>(
      `/features/${featureId}/vote`,
      { userEmail }
    );
  },
};
