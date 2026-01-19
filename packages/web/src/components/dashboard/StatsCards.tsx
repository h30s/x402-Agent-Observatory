'use client';

import { TrendingUp, TrendingDown, Activity, Users, DollarSign, CheckCircle } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    subtitle?: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon, subtitle }: StatCardProps) {
    return (
        <div className="glass-card stat-card p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[var(--primary)] bg-opacity-20">
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'positive' ? 'text-[var(--success)]' :
                            changeType === 'negative' ? 'text-[var(--error)]' : 'text-[var(--text-muted)]'
                        }`}>
                        {changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
                        {changeType === 'negative' && <TrendingDown className="w-4 h-4" />}
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] glow-text animate-number">
                {value}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">{title}</p>
            {subtitle && (
                <p className="text-xs text-[var(--text-secondary)] mt-2">{subtitle}</p>
            )}
        </div>
    );
}

interface StatsCardsProps {
    volume24h: string;
    transactions24h: number;
    uniqueAgents24h: number;
    successRate24h: string;
}

export function StatsCards({ volume24h, transactions24h, uniqueAgents24h, successRate24h }: StatsCardsProps) {
    const successRatePercent = (parseFloat(successRate24h) * 100).toFixed(1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Volume (24h)"
                value={`$${parseFloat(volume24h).toLocaleString()}`}
                change="+12.5%"
                changeType="positive"
                icon={<DollarSign className="w-5 h-5 text-[var(--primary)]" />}
                subtitle="Across all protocols"
            />
            <StatCard
                title="Transactions (24h)"
                value={transactions24h.toLocaleString()}
                change="+8.2%"
                changeType="positive"
                icon={<Activity className="w-5 h-5 text-[var(--secondary)]" />}
                subtitle="x402 payments processed"
            />
            <StatCard
                title="Active Agents"
                value={uniqueAgents24h.toString()}
                change="+3"
                changeType="positive"
                icon={<Users className="w-5 h-5 text-[var(--accent)]" />}
                subtitle="Unique agents today"
            />
            <StatCard
                title="Success Rate"
                value={`${successRatePercent}%`}
                changeType={parseFloat(successRatePercent) > 90 ? 'positive' : 'negative'}
                icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />}
                subtitle="Transaction success"
            />
        </div>
    );
}
