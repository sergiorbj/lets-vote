import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { useVotes } from '../hooks/useVotes';
import { Container } from '../components/layout/Container';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ApiError } from '../services/api';

export function VotePage() {
  const { user, userEmail, isAuthenticated } = useAuth();
  const { features, loading: featuresLoading } = useFeatures();
  const { votes, submitVote, refetch: refetchVotes } = useVotes();
  const navigate = useNavigate();

  const [selectedFeature, setSelectedFeature] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasVotedInSession, setHasVotedInSession] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Pre-select the feature the user has already voted for
  useEffect(() => {
    if (user && votes.length > 0) {
      const userVote = votes.find((vote) => vote.userId === user.id);
      if (userVote) {
        setSelectedFeature(userVote.featureId);
      }
    }
  }, [user, votes]);

  const handleSubmit = async () => {
    if (!userEmail) {
      setError('User email not found');
      return;
    }

    if (!selectedFeature) {
      setError('Please select a feature');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitVote(selectedFeature, userEmail);
      await refetchVotes();
      setHasVotedInSession(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to submit vote. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Vote for a Feature
          </h2>
          <p className="text-gray-600 mb-4">
            Help us prioritize features for our <strong>AI Studies Manager</strong> product.
          </p>
          <p className="text-gray-600">
            Select the feature you'd most like to see implemented. You can change your vote at any time.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {featuresLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading features...</p>
          </div>
        ) : hasVotedInSession ? (
          <div className="text-center py-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thank you for voting!
              </h3>
              <p className="text-gray-600">
                Your vote for <strong>{features.find((f) => f.id === selectedFeature)?.title}</strong> has been recorded.
              </p>
            </div>
            <Button
              onClick={() => navigate('/ranking')}
              className="px-8"
              data-testid="view-rankings-button"
            >
              View Rankings
            </Button>
          </div>
        ) : (
          <>
            <Card className="mb-8">
              <label className="block mb-4">
                <span className="text-gray-700 font-medium mb-2 block">
                  Select a feature:
                </span>
                <select
                  value={selectedFeature}
                  onChange={(e) => {
                    setSelectedFeature(e.target.value);
                    setError('');
                  }}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="feature-select"
                >
                  <option value="">-- Choose a feature --</option>
                  {features.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.title}
                    </option>
                  ))}
                </select>
              </label>

              {selectedFeature && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {features.find((f) => f.id === selectedFeature)?.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {features.find((f) => f.id === selectedFeature)?.description}
                  </p>
                </div>
              )}
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedFeature || submitting}
                className="flex-1"
                data-testid="submit-vote-button"
              >
                {submitting ? 'Submitting...' : 'Submit Vote'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/ranking')}
                className="flex-1"
              >
                View Rankings
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
