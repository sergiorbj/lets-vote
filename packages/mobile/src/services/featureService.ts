import { api } from './api';
import { Feature } from '../types';

export const featureService = {
  async getAllFeatures(): Promise<Feature[]> {
    return api.get<Feature[]>('/features');
  },
};
