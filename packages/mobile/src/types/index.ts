export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Vote {
  id: string;
  userId: string;
  featureId: string;
  createdAt: string;
  user?: User;
  feature?: Feature;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CreateFeatureData {
  title: string;
  description: string;
  createdByEmail: string;
}
