import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { Container } from '../components/layout/Container';
import { Header } from '../components/layout/Header';
import { RankingCard } from '../components/features/RankingCard';
import { Button } from '../components/ui/Button';

export function RankingPage() {
  const { isAuthenticated } = useAuth();
  const { features, loading } = useFeatures();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Features are already sorted by voteCount in descending order from the backend
  const rankedFeatures = [...features].sort((a, b) => b.voteCount - a.voteCount);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Feature Rankings
          </h2>
          <p className="text-gray-600">
            See which features are most popular with our community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading rankings...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {rankedFeatures.map((feature, index) => (
                <RankingCard
                  key={feature.id}
                  feature={feature}
                  rank={index + 1}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/vote')}
              >
                Back to Voting
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
