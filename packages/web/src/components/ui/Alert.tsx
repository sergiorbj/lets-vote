import { ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const typeStyles: Record<AlertType, { bg: string; border: string; text: string; icon: string; titleColor: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    titleColor: 'text-emerald-800',
    icon: '✓',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    titleColor: 'text-red-800',
    icon: '✕',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    titleColor: 'text-amber-800',
    icon: '⚠',
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    text: 'text-sky-700',
    titleColor: 'text-sky-800',
    icon: 'ℹ',
  },
};

export function Alert({ type = 'info', title, children, onDismiss, className = '' }: AlertProps) {
  const styles = typeStyles[type];

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border-l-4
        ${styles.bg} ${styles.border} ${styles.text}
        ${className}
      `}
      role="alert"
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 text-sm font-bold shadow-sm">
        {styles.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold mb-1 ${styles.titleColor}`}>{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity text-xl font-bold leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

