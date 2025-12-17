import { api } from './api';
import type { User, ApiResponse } from '../types';

export const userService = {
  async getUserByEmail(email: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      `/api/users/${encodeURIComponent(email)}`
    );
    return response.data;
  },
};
