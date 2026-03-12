import { useState } from 'react';
import type { Route } from '../../../../core/domain/entities';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBanner } from '../shared/ErrorBanner';
import { useRoutes } from '../../hooks/useRoutes';

const VESSEL_TYPES = ['All', 'Container', 'BulkCarrier', 'Tanker', 'RoRo'];
const FUEL_TYPES = ['All', 'HFO', 'LNG', 'MGO'];
const YEARS = ['All', '2024', '2025'];

export function RoutesTab() {
    const { routes, loading, error, setBaseline } = useRoutes();
    const [filterVessel, setFilterVessel] = useState('All');
    const [filterFuel, setFilterFuel] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [baselineMsg, setBaselineMsg] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const filtered = routes.filter((r: Route) => {
        if (filterVessel !== 'All' && r.vesselType !== filterVessel) return false;
        if (filterFuel !== 'All' && r.fuelType !== filterFuel) return false;
        if (filterYear !== 'All' && r.year !== parseInt(filterYear)) return false;
        return true;
    });

    const handleSetBaseline = async (id: string, routeId: string) => {
        setActionError(null);
        setBaselineMsg(null);
        try {
            await setBaseline(id);
            setBaselineMsg(`✅ ${routeId} is now the baseline`);
        } catch (e) {
            setActionError((e as Error).message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <FilterSelect label="Vessel Type" value={filterVessel} options={VESSEL_TYPES} onChange={setFilterVessel} />
                <FilterSelect label="Fuel Type" value={filterFuel} options={FUEL_TYPES} onChange={setFilterFuel} />
                <FilterSelect label="Year" value={filterYear} options={YEARS} onChange={setFilterYear} />
            </div>

            {error && <ErrorBanner message={error} />}
            {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}
            {baselineMsg && (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                    {baselineMsg}
                </div>
            )}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <tr>
                                {['Route ID', 'Vessel Type', 'Fuel Type', 'Year', 'GHG Intensity (gCO₂e/MJ)', 'Fuel (t)', 'Distance (km)', 'Emissions (t)', 'Baseline', 'Action'].map(
                                    (h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filtered.map((r: Route) => (
                                <tr
                                    key={r.id}
                                    className={`transition-colors ${r.isBaseline
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <td className="px-4 py-3 font-mono font-medium text-blue-600 dark:text-blue-400">{r.routeId}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.vesselType}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                            {r.fuelType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.year}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{r.ghgIntensity.toFixed(1)}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.fuelConsumption.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.distance.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.totalEmissions.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        {r.isBaseline ? (
                                            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold">
                                                BASELINE
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {!r.isBaseline && (
                                            <button
                                                onClick={() => void handleSetBaseline(r.id, r.routeId)}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                            >
                                                Set Baseline
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center py-8 text-gray-400 dark:text-gray-500">
                                        No routes match the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
