import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow' : '';

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
