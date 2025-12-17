import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { useVotes } from '../hooks/useVotes';
import { Container } from '../components/layout/Container';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { ApiError } from '../services/api';
import { featureService } from '../services/featureService';

export function VotePage() {
  const { user, userEmail, isAuthenticated } = useAuth();
  const { features, loading: featuresLoading, refetch: refetchFeatures } = useFeatures();
  const { votes, submitVote, refetch: refetchVotes } = useVotes();
  const navigate = useNavigate();

  const [selectedFeature, setSelectedFeature] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasVotedInSession, setHasVotedInSession] = useState(false);

  // Create feature form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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

  const handleCreateFeature = async () => {
    if (!userEmail) {
      setCreateError('User email not found');
      return;
    }

    if (!newFeatureTitle.trim() || !newFeatureDescription.trim()) {
      setCreateError('Please fill in all fields');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const newFeature = await featureService.createFeature({
        title: newFeatureTitle.trim(),
        description: newFeatureDescription.trim(),
        createdByEmail: userEmail,
      });

      // Refetch features to update the dropdown
      await refetchFeatures();

      // Auto-select the newly created feature
      setSelectedFeature(newFeature.id);

      // Reset form
      setNewFeatureTitle('');
      setNewFeatureDescription('');
      setShowCreateForm(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError('Failed to create feature. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  };

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
          <Alert 
            type="error" 
            title="Error" 
            onDismiss={() => setError('')}
            className="mb-6"
          >
            {error}
          </Alert>
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
            {/* Create New Feature Section */}
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Feature</h3>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowCreateForm(!showCreateForm);
                    setCreateError('');
                  }}
                  data-testid="toggle-create-form-button"
                >
                  {showCreateForm ? 'Cancel' : '+ Add New Feature'}
                </Button>
              </div>

              {showCreateForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        Feature Title
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newFeatureTitle}
                      onChange={(e) => setNewFeatureTitle(e.target.value)}
                      placeholder="Enter feature title (5-100 characters)"
                      disabled={creating}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                      data-testid="new-feature-title-input"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        Feature Description
                      </span>
                    </label>
                    <textarea
                      value={newFeatureDescription}
                      onChange={(e) => setNewFeatureDescription(e.target.value)}
                      placeholder="Enter feature description (10-500 characters)"
                      disabled={creating}
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 resize-none"
                      data-testid="new-feature-description-input"
                    />
                  </div>

                  {createError && (
                    <Alert 
                      type="error" 
                      onDismiss={() => setCreateError('')}
                    >
                      {createError}
                    </Alert>
                  )}

                  <Button
                    onClick={handleCreateFeature}
                    disabled={creating || !newFeatureTitle.trim() || !newFeatureDescription.trim()}
                    className="w-full"
                    data-testid="create-feature-button"
                  >
                    {creating ? 'Creating...' : 'Create Feature'}
                  </Button>
                </div>
              )}
            </Card>

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
