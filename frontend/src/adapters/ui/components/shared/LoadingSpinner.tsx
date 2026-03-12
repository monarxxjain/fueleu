export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
    return (
        <div className="flex justify-center items-center py-6">
            <div
                className={`${sizeClass} animate-spin rounded-full border-4 border-blue-500 border-t-transparent`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}
