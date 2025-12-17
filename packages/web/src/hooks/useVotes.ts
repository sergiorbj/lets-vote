import { useState, useEffect } from 'react';
import { voteService } from '../services/voteService';
import type { Vote } from '../types';
import { ApiError } from '../services/api';

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await voteService.getAllVotes();
      setVotes(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch votes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const submitVote = async (featureId: string, userEmail: string) => {
    setError(null);
    try {
      const result = await voteService.voteOnFeature(featureId, { userEmail });
      // Don't update votes state here - let the caller refetch to get accurate state
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        throw err;
      } else {
        const error = new Error('Failed to submit vote');
        setError(error.message);
        throw error;
      }
    }
  };

  const getUserVotedFeatureIds = (): string[] => {
    return votes.map((vote) => vote.featureId);
  };

  const refetch = () => {
    return fetchVotes();
  };

  return {
    votes,
    loading,
    error,
    submitVote,
    getUserVotedFeatureIds,
    refetch,
  };
}
