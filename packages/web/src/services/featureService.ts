import { api } from './api';
import type { Feature, ApiResponse, CreateFeatureData } from '../types';

export const featureService = {
  async getAllFeatures(): Promise<Feature[]> {
    const response = await api.get<ApiResponse<Feature[]>>('/api/features');
    return response.data;
  },

  async getFeatureById(id: string): Promise<Feature> {
    const response = await api.get<ApiResponse<Feature>>(`/api/features/${id}`);
    return response.data;
  },

  async createFeature(data: CreateFeatureData): Promise<Feature> {
    const response = await api.post<ApiResponse<Feature>>('/api/features', data);
    return response.data;
  },
};
