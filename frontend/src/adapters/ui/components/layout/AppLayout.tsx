import type { ReactNode } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'] as const;
export type TabName = (typeof tabs)[number];

interface AppLayoutProps {
    activeTab: TabName;
    onTabChange: (tab: TabName) => void;
    children: ReactNode;
}

export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
    const { isDark, toggle } = useDarkMode();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            {/* Top nav */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚓</span>
                            <div>
                                <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                                    FuelEU Maritime
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Compliance Dashboard
                                </p>
                            </div>
                        </div>

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggle}
                            aria-label="Toggle dark mode"
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            style={{
                                backgroundColor: isDark ? '#3b82f6' : '#d1d5db',
                            }}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                            <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Tab bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-4 py-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Page content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
    );
}
