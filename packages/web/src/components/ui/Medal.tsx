interface MedalProps {
  rank: number;
}

export function Medal({ rank }: MedalProps) {
  const medals: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  if (rank < 1 || rank > 3) {
    return null;
  }

  return <span className="text-2xl mr-2">{medals[rank]}</span>;
}
