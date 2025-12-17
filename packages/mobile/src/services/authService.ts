import { api } from './api';
import { User } from '../types';

export const authService = {
  async verifyUser(email: string): Promise<User> {
    return api.get<User>(`/users/${encodeURIComponent(email)}`);
  },
};
