import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Medal } from '../ui/Medal';
import type { Feature } from '../../types';

interface RankingCardProps {
  feature: Feature;
  rank: number;
}

export function RankingCard({ feature, rank }: RankingCardProps) {
  const isTopThree = rank <= 3;

  return (
    <Card className={isTopThree ? 'border-2 border-primary-500' : ''}>
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2">
          <Medal rank={rank} />
          <span className="text-xl font-bold text-gray-500">#{rank}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <Badge variant={isTopThree ? 'success' : 'gray'}>
              {feature.voteCount} votes
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      </div>
    </Card>
  );
}
