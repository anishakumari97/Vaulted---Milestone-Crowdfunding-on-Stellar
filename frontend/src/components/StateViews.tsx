export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-space-400">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-space-700 border-t-violet-500" />
        <div className="absolute inset-2 rounded-full bg-violet-500/10" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-status-red/30 bg-status-red/5 px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-red/15 text-status-red font-bold">
        !
      </div>
      <p className="font-semibold text-space-100">{title}</p>
      <p className="max-w-sm text-sm text-space-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full border border-space-600 px-4 py-1.5 text-sm transition hover:border-violet-500 hover:text-violet-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-space-700 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-space-700 bg-space-900">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 4v6M10 14v.5" stroke="#4a5499" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="8" stroke="#4a5499" strokeWidth="1.5"/>
        </svg>
      </div>
      <p className="font-display text-lg font-semibold text-space-100">{title}</p>
      <p className="max-w-sm text-sm text-space-400">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
