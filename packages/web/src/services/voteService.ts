import { api } from './api';
import type { Vote, ApiResponse, VoteData, Feature } from '../types';

export const voteService = {
  async getAllVotes(): Promise<Vote[]> {
    const response = await api.get<ApiResponse<Vote[]>>('/api/votes');
    return response.data;
  },

  async voteOnFeature(
    featureId: string,
    data: VoteData
  ): Promise<{ vote: Vote; feature: Feature }> {
    const response = await api.post<
      ApiResponse<{ vote: Vote; feature: Feature }>
    >(`/api/features/${featureId}/vote`, data);
    return response.data;
  },
};
