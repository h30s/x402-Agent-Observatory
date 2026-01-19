'use client';

import { useEffect, useState } from 'react';
import {
    fetchEcosystemHealth,
    fetchProtocols,
    ProtocolStats,
    formatAmount
} from '@/lib/api';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Shield,
    TrendingUp,
    BarChart3,
    Server
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface HealthData {
    status: string;
    score: number;
    volume24h: string;
    transactions24h: number;
    uniqueAgents24h: number;
    successRate24h: string;
    hourlyVolume: { hour: string; volume: number; count: number }[];
    lastUpdated: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function AnalyticsPage() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [protocols, setProtocols] = useState<ProtocolStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchEcosystemHealth(), fetchProtocols()])
            .then(([healthData, protocolsData]) => {
                setHealth(healthData);
                setProtocols(protocolsData.protocols);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    if (isLoading || !health) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)] font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const successRate = parseFloat(health.successRate24h) * 100;

    // Transform hourly data for chart
    const volumeChartData = health.hourlyVolume.map(item => ({
        time: item.hour,
        volume: item.volume,
        transactions: item.count
    }));

    return (
        <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ecosystem Analytics</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Network health, protocol performance, and real-time metrics
                    </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
            </div>

            {/* Health Status & Key Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Health Score Card */}
                <div className={`card p-6 border ${health.score >= 85 ? 'bg-green-50 border-green-100' : health.score >= 60 ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">System Health</span>
                        <Shield className={`w-5 h-5 ${health.score >= 85 ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                        <span className={`text-4xl font-bold ${health.score >= 85 ? 'text-green-700' : 'text-yellow-700'}`}>
                            {health.score}/100
                        </span>
                    </div>
                    <div className={`text-sm ${health.score >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {health.status === 'good' ? 'All systems operational' : 'Performance degraded'}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="card p-6 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <Activity className="w-4 h-4" /> 24h Volume
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                        {formatAmount(health.volume24h)}
                    </div>
                    <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs yesterday
                    </div>
                </div>

                <div className="card p-6 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <Server className="w-4 h-4" /> Transactions
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                        {health.transactions24h.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                        Across {health.uniqueAgents24h} active agents
                    </div>
                </div>

                <div className="card p-6 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <CheckCircle className="w-4 h-4" /> Success Rate
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                        {successRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                        Global execution success
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Volume Chart */}
                <div className="lg:col-span-2 card p-6 bg-white border border-[var(--border)]">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Transaction Volume (24h)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={volumeChartData}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 12, fill: '#666' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#666' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Volume']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorVolume)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Protocol Dominance (Top 5 by Volume) */}
                <div className="card p-6 bg-white border border-[var(--border)]">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Protocol Dominance</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={protocols.slice(0, 5)} layout="vertical" barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 11, fill: '#666' }}
                                    width={70}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                                />
                                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                                    {protocols.slice(0, 5).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Protocols Performance Table */}
            <div className="card overflow-hidden bg-white border border-[var(--border)] shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Protocol Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-[var(--text-muted)] font-semibold">
                            <tr>
                                <th className="px-6 py-3">Protocol</th>
                                <th className="px-6 py-3 text-right">Volume</th>
                                <th className="px-6 py-3 text-right">Transactions</th>
                                <th className="px-6 py-3 text-right">Success Rate</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {protocols.map((protocol) => (
                                <tr key={protocol.name} className="hover:bg-[var(--bg-elevated)] transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                                        {protocol.name}
                                    </td>
                                    <td className="px-6 py-4 text-right text-[var(--text-primary)]">
                                        {formatAmount(protocol.volume)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-[var(--text-secondary)]">
                                        {protocol.transactions}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${parseFloat(protocol.successRate) >= 0.9
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {(parseFloat(protocol.successRate) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle className="w-3 h-3" /> Operational
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
