import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';
import type { ComparisonResult } from '../../../../core/domain/entities';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBanner } from '../shared/ErrorBanner';
import { useComparison } from '../../hooks/useComparison';

export function CompareTab() {
    const { data, loading, error, refetch } = useComparison();

    if (loading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="space-y-3">
                <ErrorBanner message={error} />
                <button
                    onClick={() => void refetch()}
                    className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Retry
                </button>
            </div>
        );
    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
                <InfoBadge label="Baseline" value={data.baseline.routeId} />
                <InfoBadge label="Baseline GHG" value={`${data.baseline.ghgIntensity} gCO₂e/MJ`} />
                <InfoBadge label="Target (2025)" value={`${data.target} gCO₂e/MJ`} color="blue" />
            </div>

            <ComparisonChart data={data} />
            <ComparisonTable data={data} />
        </div>
    );
}

function InfoBadge({
    label,
    value,
    color = 'gray',
}: {
    label: string;
    value: string;
    color?: 'gray' | 'blue';
}) {
    const cls =
        color === 'blue'
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
    return (
        <div className={`border rounded-lg px-3 py-2 ${cls}`}>
            <span className="text-xs font-medium opacity-70">{label}: </span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    );
}

function ComparisonChart({ data }: { data: ComparisonResult }) {
    const chartData = data.rows.map((r) => ({
        name: r.routeId,
        ghgIntensity: r.ghgIntensity,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                GHG Intensity Comparison (gCO₂e/MJ)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                        formatter={(v) => [`${Number(v).toFixed(2)} gCO₂e/MJ`, 'GHG Intensity']}
                    />
                    <Legend />
                    <ReferenceLine
                        y={data.target}
                        stroke="#3b82f6"
                        strokeDasharray="6 3"
                        label={{ value: `Target ${data.target}`, position: 'right', fontSize: 11, fill: '#3b82f6' }}
                    />
                    <ReferenceLine
                        y={data.baseline.ghgIntensity}
                        stroke="#f59e0b"
                        strokeDasharray="6 3"
                        label={{ value: 'Baseline', position: 'insideTopLeft', fontSize: 11, fill: '#f59e0b' }}
                    />
                    <Bar
                        dataKey="ghgIntensity"
                        name="GHG Intensity"
                        radius={[4, 4, 0, 0]}
                        fill="#6366f1"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function ComparisonTable({ data }: { data: ComparisonResult }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <tr>
                        {[
                            'Route ID',
                            'Vessel',
                            'Fuel',
                            'Year',
                            'GHG (gCO₂e/MJ)',
                            'Baseline GHG',
                            '% vs Baseline',
                            'Compliant vs Target',
                        ].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {data.rows.map((r) => (
                        <tr key={r.routeId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3 font-mono font-medium text-blue-600 dark:text-blue-400">{r.routeId}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.vesselType}</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                    {r.fuelType}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.year}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{r.ghgIntensity.toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.baselineGhgIntensity.toFixed(2)}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`font-medium ${r.percentDiff <= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-red-500 dark:text-red-400'
                                        }`}
                                >
                                    {r.percentDiff >= 0 ? '+' : ''}
                                    {r.percentDiff.toFixed(2)}%
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center text-lg">
                                {r.compliant ? '✅' : '❌'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
