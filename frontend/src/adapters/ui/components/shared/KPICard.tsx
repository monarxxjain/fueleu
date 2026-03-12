import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

interface KPICardProps {
    label: string;
    value: number;
    unit?: string;
    positive?: boolean; // green if positive, red if negative
    description?: string;
}

export function KPICard({ label, value, unit = '', positive, description }: KPICardProps) {
    const mv = useMotionValue(0);
    const spring = useSpring(mv, { stiffness: 80, damping: 20 });
    const displayed = useTransform(spring, (v) =>
        v.toLocaleString('en-US', { maximumFractionDigits: 0 })
    );

    useEffect(() => {
        mv.set(value);
    }, [mv, value]);

    // Determine color based on value sign (when positive prop not given, infer from value)
    const isGood = positive !== undefined ? positive : value >= 0;
    const colorClass = isGood
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-500 dark:text-red-400';

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {label}
            </p>
            <div className={`flex items-baseline gap-1 ${colorClass}`}>
                <motion.span className="text-2xl font-bold tabular-nums">{displayed}</motion.span>
                {unit && <span className="text-sm font-medium">{unit}</span>}
            </div>
            {description && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
            )}
        </div>
    );
}
