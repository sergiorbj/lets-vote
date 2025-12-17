export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: User;
}

export interface Vote {
  id: string;
  userId: string;
  featureId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface CreateFeatureData {
  title: string;
  description: string;
  userEmail: string;
}

export interface VoteData {
  userEmail: string;
}
