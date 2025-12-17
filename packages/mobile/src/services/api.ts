import { API_BASE_URL } from '../constants/api';

export class ApiError extends Error {
  constructor(public message: string, public status?: number, public details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
  }
}

function formatValidationErrors(details?: Array<{ field: string; message: string }>): string {
  if (!details || details.length === 0) {
    return 'Validation failed';
  }
  return details.map(d => d.message).join('. ');
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMessage = data.details 
      ? formatValidationErrors(data.details) 
      : (data.error || 'Request failed');
    throw new ApiError(errorMessage, response.status, data.details);
  }

  return data.data;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
