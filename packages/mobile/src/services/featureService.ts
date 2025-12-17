import { api } from './api';
import { Feature, CreateFeatureData } from '../types';

export const featureService = {
  async getAllFeatures(): Promise<Feature[]> {
    return api.get<Feature[]>('/features');
  },

  async createFeature(data: CreateFeatureData): Promise<Feature> {
    return api.post<Feature>('/features', data);
  },
};
