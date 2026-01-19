'use client';

import { Activity, Users, DollarSign, LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import { formatAmount } from '@/lib/api';

interface StatsCardsProps {
    volume24h: string;
    transactions24h: number;
    uniqueAgents24h: number;
    successRate24h: string;
}

export function StatsCards({ volume24h, transactions24h, uniqueAgents24h, successRate24h }: StatsCardsProps) {
    const successRate = parseFloat(successRate24h) * 100;

    return (
        <div className="market-ticker w-full bg-white text-[var(--text-primary)] font-mono text-xs overflow-x-auto whitespace-nowrap">
            {/* Ticker Item: Volume */}
            <div className="ticker-item">
                <span className="text-[var(--text-secondary)]">24H VOL</span>
                <span className="font-bold">{formatAmount(volume24h)}</span>
                <span className="text-[var(--success)] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 12.5%
                </span>
            </div>

            {/* Ticker Item: Txs */}
            <div className="ticker-item">
                <span className="text-[var(--text-secondary)]">TXS</span>
                <span className="font-bold">{transactions24h.toLocaleString()}</span>
                <span className="text-[var(--success)]">+8.2%</span>
            </div>

            {/* Ticker Item: Agents */}
            <div className="ticker-item">
                <span className="text-[var(--text-secondary)]">AGENTS</span>
                <span className="font-bold">{uniqueAgents24h}</span>
                <span className="text-[var(--text-muted)]">ACT</span>
            </div>

            {/* Ticker Item: Success */}
            <div className="ticker-item">
                <span className="text-[var(--text-secondary)]">SUCCESS</span>
                <span className={`font-bold ${successRate > 98 ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                    {successRate.toFixed(2)}%
                </span>
            </div>

            {/* Ticker Item: Gas (Mock) */}
            <div className="ticker-item">
                <span className="text-[var(--text-secondary)]">AVG GAS</span>
                <span className="font-bold">2.4 Gwei</span>
            </div>

            {/* Ticker Item: Block Time (Mock) */}
            <div className="ticker-item border-r-0">
                <span className="text-[var(--text-secondary)]">BLOCK</span>
                <span className="font-bold text-[var(--accent)]">#12,402,918</span>
            </div>
        </div>
    );
}
