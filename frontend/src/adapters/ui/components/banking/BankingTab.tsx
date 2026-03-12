import { useState } from 'react';
import { KPICard } from '../shared/KPICard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorBanner } from '../shared/ErrorBanner';
import { useBanking } from '../../hooks/useBanking';
import type { BankRecord } from '../../../../core/domain/entities';

const SHIP_IDS = ['R001', 'R002', 'R003', 'R004', 'R005'];
const YEARS = [2024, 2025];

export function BankingTab() {
    const { cb, adjustedCB, records, loading, error, computeCB, bank, applyBanked } =
        useBanking();

    const [selectedShip, setSelectedShip] = useState(SHIP_IDS[0]);
    const [selectedYear, setSelectedYear] = useState(YEARS[0]);
    const [bankAmount, setBankAmount] = useState('');
    const [applyAmount, setApplyAmount] = useState('');

    const handleCompute = () => void computeCB(selectedShip, selectedYear);

    const handleBank = async () => {
        const amt = parseFloat(bankAmount);
        if (isNaN(amt) || amt <= 0) return;
        await bank(selectedShip, selectedYear, amt);
        setBankAmount('');
    };

    const handleApply = async () => {
        const amt = parseFloat(applyAmount);
        if (isNaN(amt) || amt <= 0) return;
        await applyBanked(selectedShip, selectedYear, amt);
        setApplyAmount('');
    };

    const cbValue = adjustedCB?.cbAdjusted ?? cb?.cbGco2eq ?? 0;
    const hasSurplus = cbValue > 0;
    const bankedTotal = adjustedCB?.bankedTotal ?? 0;
    const hasBanked = bankedTotal > 0;

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Ship / Route</label>
                    <select
                        value={selectedShip}
                        onChange={(e) => setSelectedShip(e.target.value)}
                        className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {SHIP_IDS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {YEARS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleCompute}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                    {loading ? 'Computing…' : 'Compute CB'}
                </button>
            </div>

            {error && <ErrorBanner message={error} />}

            {loading && !cb && <LoadingSpinner />}

            {/* KPI Cards */}
            {(cb || adjustedCB) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KPICard
                        label="Raw CB"
                        value={Math.round(cb?.cbGco2eq ?? 0)}
                        unit="gCO₂eq"
                        description="Compliance Balance before banking"
                    />
                    <KPICard
                        label="Total Banked"
                        value={Math.round(bankedTotal)}
                        unit="gCO₂eq"
                        description="Net banked surplus (positive) / applied (negative)"
                    />
                    <KPICard
                        label="Adjusted CB"
                        value={Math.round(cbValue)}
                        unit="gCO₂eq"
                        description="CB after banking operations"
                    />
                </div>
            )}

            {/* Banking Actions */}
            {cb && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Surplus */}
                    <ActionCard
                        title="Bank Surplus (Art. 20)"
                        description="Save positive CB credit for future use"
                        disabled={!hasSurplus}
                        disabledReason={!hasSurplus ? 'No surplus to bank (CB ≤ 0)' : undefined}
                    >
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={bankAmount}
                                onChange={(e) => setBankAmount(e.target.value)}
                                placeholder="Amount (gCO₂eq)"
                                min={1}
                                max={cbValue}
                                className="flex-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                onClick={() => void handleBank()}
                                disabled={loading || !hasSurplus || !bankAmount}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                            >
                                Bank
                            </button>
                        </div>
                    </ActionCard>

                    {/* Apply Banked */}
                    <ActionCard
                        title="Apply Banked Surplus"
                        description="Apply previously banked credit to cover a deficit"
                        disabled={!hasBanked}
                        disabledReason={!hasBanked ? 'No banked surplus available' : undefined}
                    >
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={applyAmount}
                                onChange={(e) => setApplyAmount(e.target.value)}
                                placeholder="Amount (gCO₂eq)"
                                min={1}
                                max={bankedTotal}
                                className="flex-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => void handleApply()}
                                disabled={loading || !hasBanked || !applyAmount}
                                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </ActionCard>
                </div>
            )}

            {/* Transaction History */}
            {records.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                        Transaction History
                    </h3>
                    <div className="space-y-2">
                        {records.map((r: BankRecord) => (
                            <div
                                key={r.id}
                                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                                <span className="text-gray-500 dark:text-gray-400">
                                    {new Date(r.createdAt).toLocaleString()}
                                </span>
                                <span
                                    className={`font-mono font-medium ${r.amountGco2eq > 0
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-red-500 dark:text-red-400'
                                        }`}
                                >
                                    {r.amountGco2eq > 0 ? '+' : ''}
                                    {Math.round(r.amountGco2eq).toLocaleString()} gCO₂eq
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionCard({
    title,
    description,
    disabled,
    disabledReason,
    children,
}: {
    title: string;
    description: string;
    disabled?: boolean;
    disabledReason?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl border p-4 space-y-3 ${disabled
                    ? 'border-gray-200 dark:border-gray-700 opacity-60'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
        >
            <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            {disabledReason && (
                <p className="text-xs text-amber-600 dark:text-amber-400">⚠ {disabledReason}</p>
            )}
            {children}
        </div>
    );
}
