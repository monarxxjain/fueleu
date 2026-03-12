import { useState, useEffect } from 'react';
import { usePooling } from '../../hooks/usePooling';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBanner } from '../shared/ErrorBanner';
import type { PoolMember } from '../../../../core/domain/entities';

const ALL_SHIPS = ['R001', 'R002', 'R003', 'R004', 'R005'];
const YEARS = [2024, 2025];

export function PoolingTab() {
    const { memberCBs, poolResult, loading, error, fetchMemberCB, createPool } = usePooling();

    const [selectedShips, setSelectedShips] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState(YEARS[0]);

    // Fetch CB for each selected ship automatically
    useEffect(() => {
        for (const shipId of selectedShips) {
            if (!memberCBs[shipId]) {
                void fetchMemberCB(shipId, selectedYear);
            }
        }
    }, [selectedShips, selectedYear, memberCBs, fetchMemberCB]);

    const toggleShip = (shipId: string) => {
        setSelectedShips((prev) =>
            prev.includes(shipId) ? prev.filter((s) => s !== shipId) : [...prev, shipId]
        );
    };

    const selectedCBs = selectedShips.map((s) => memberCBs[s]?.cbAdjusted ?? 0);
    const sumCB = selectedCBs.reduce((a, b) => a + b, 0);
    const isPoolValid = selectedShips.length >= 2 && sumCB >= 0;

    const handleCreatePool = () => {
        void createPool(
            selectedYear,
            selectedShips.map((s) => ({ shipId: s, year: selectedYear }))
        );
    };

    return (
        <div className="space-y-6">
            {/* Year selector */}
            <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Year</label>
                <select
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(parseInt(e.target.value));
                        setSelectedShips([]);
                    }}
                    className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    Select at least 2 ships to form a pool. CBs are loaded automatically.
                </p>
            </div>

            {error && <ErrorBanner message={error} />}

            {/* Ship selection grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ALL_SHIPS.map((shipId) => {
                    const cbData = memberCBs[shipId];
                    const isSelected = selectedShips.includes(shipId);
                    const cb = cbData?.cbAdjusted;
                    return (
                        <button
                            key={shipId}
                            onClick={() => toggleShip(shipId)}
                            className={`rounded-xl p-3 border-2 text-left transition-all ${isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <p className="font-mono font-bold text-sm text-gray-800 dark:text-gray-200">{shipId}</p>
                            {cb !== undefined ? (
                                <p
                                    className={`text-xs font-medium ${cb >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                                        }`}
                                >
                                    {Math.round(cb).toLocaleString()} gCO₂eq
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">No CB data</p>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Pool sum indicator */}
            {selectedShips.length >= 2 && (
                <div
                    className={`rounded-xl p-4 border-2 flex items-center justify-between ${sumCB >= 0
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        }`}
                >
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Pool Sum
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedShips.join(' + ')} — must be ≥ 0
                        </p>
                    </div>
                    <div className="text-right">
                        <p
                            className={`text-xl font-bold tabular-nums ${sumCB >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                                }`}
                        >
                            {sumCB >= 0 ? '+' : ''}{Math.round(sumCB).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">gCO₂eq</p>
                    </div>
                </div>
            )}

            <button
                onClick={handleCreatePool}
                disabled={!isPoolValid || loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm"
            >
                {loading ? 'Creating Pool…' : 'Create Pool'}
            </button>

            {!isPoolValid && selectedShips.length >= 2 && sumCB < 0 && (
                <p className="text-xs text-red-500 dark:text-red-400">
                    ❌ Pool invalid — total adjusted CB is negative ({Math.round(sumCB).toLocaleString()} gCO₂eq)
                </p>
            )}

            {loading && <LoadingSpinner />}

            {/* Pool result */}
            {poolResult && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Pool Created — {new Date(poolResult.createdAt).toLocaleString()}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500">ID: {poolResult.id}</p>
                    </div>
                    <PoolMemberTable members={poolResult.members} />
                </div>
            )}
        </div>
    );
}

function PoolMemberTable({ members }: { members: PoolMember[] }) {
    return (
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                    {['Ship ID', 'CB Before (gCO₂eq)', 'CB After (gCO₂eq)', 'Delta', 'Status'].map(
                        (h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                                {h}
                            </th>
                        )
                    )}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {members.map((m) => {
                    const delta = m.cbAfter - m.cbBefore;
                    return (
                        <tr key={m.shipId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3 font-mono font-medium text-blue-600 dark:text-blue-400">
                                {m.shipId}
                            </td>
                            <td className={`px-4 py-3 font-medium ${m.cbBefore >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                {Math.round(m.cbBefore).toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 font-medium ${m.cbAfter >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                {Math.round(m.cbAfter).toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 font-mono text-sm ${delta > 0 ? 'text-emerald-500' : delta < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                {delta > 0 ? '+' : ''}{Math.round(delta).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center text-lg">
                                {m.cbAfter >= 0 ? '✅' : '❌'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
