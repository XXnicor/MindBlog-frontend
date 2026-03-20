import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-[var(--color-error)]/10 border border-[var(--color-error)]/50 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-[var(--color-error)] font-semibold mb-2">Erro</h3>
          <p className="text-[var(--color-ink-light)] text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-error)]/20 hover:bg-[var(--color-error)]/30 text-[var(--color-error)] rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}