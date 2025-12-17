import { useState, useEffect } from 'react';
import { featureService } from '../services/featureService';
import type { Feature } from '../types';
import { ApiError } from '../services/api';

export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await featureService.getAllFeatures();
      setFeatures(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch features');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const refetch = () => {
    return fetchFeatures();
  };

  return {
    features,
    loading,
    error,
    refetch,
  };
}
