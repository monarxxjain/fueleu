interface ErrorBannerProps {
    message: string;
    onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
    return (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-4 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠</span>
            <p className="flex-1 text-sm text-red-700 dark:text-red-300">{message}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-red-400 hover:text-red-600 text-xs font-bold"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
