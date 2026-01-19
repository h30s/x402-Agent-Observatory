'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAgents, Agent, formatAddress, formatAmount } from '@/lib/api';
import { Trophy, TrendingUp, ExternalLink, Medal } from 'lucide-react';

function getRankBadge(rank: number) {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm border border-yellow-200">1</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm border border-gray-200">2</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-sm border border-orange-200">3</div>;
    return <span className="text-sm text-[var(--text-muted)] font-medium pl-2">#{rank}</span>;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAgents()
            .then(res => {
                setAgents(res.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)] font-medium">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agent Leaderboard</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Top performing x402 agents ranked by volume and success rate
                    </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
            </div>

            {/* Top 3 Cards - Clean Professional Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {agents.slice(0, 3).map((agent, i) => (
                    <div
                        key={agent.address}
                        className="card p-6 bg-white border border-[var(--border)] shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <Medal className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="mb-6">{getRankBadge(i + 1)}</div>

                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-white border border-[var(--primary-light)] text-[var(--primary)] text-2xl font-bold flex items-center justify-center mb-4 shadow-sm">
                                {agent.address.slice(2, 4).toUpperCase()}
                            </div>

                            <Link href={`/agents/${agent.address}`} className="font-mono text-base font-medium text-[var(--text-primary)] hover:text-[var(--primary)] hover:underline mb-1">
                                {formatAddress(agent.address)}
                            </Link>

                            <div className="text-3xl font-bold text-[var(--text-primary)] mb-6 tracking-tight">
                                {formatAmount(agent.totalVolume)}
                            </div>

                            <div className="grid grid-cols-2 w-full gap-4 pt-4 border-t border-[var(--border)]">
                                <div className="text-center">
                                    <div className="text-xs uppercase text-[var(--text-muted)] font-semibold mb-1">Success Rate</div>
                                    <div className="font-bold text-green-600">{(parseFloat(agent.successRate) * 100).toFixed(1)}%</div>
                                </div>
                                <div className="text-center border-l border-[var(--border)]">
                                    <div className="text-xs uppercase text-[var(--text-muted)] font-semibold mb-1">Transactions</div>
                                    <div className="font-bold text-[var(--text-primary)]">{agent.totalTransactions}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full leaderboard Table */}
            <div className="card overflow-hidden bg-white border border-[var(--border)] shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">All Agents</h2>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-[var(--text-secondary)]">
                        {agents.length} agents tracking
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-[var(--text-muted)] font-semibold">
                            <tr>
                                <th className="px-6 py-3 w-16 text-center">Rank</th>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3 text-right">Volume</th>
                                <th className="px-6 py-3 text-right">Transactions</th>
                                <th className="px-6 py-3 text-right">Success Rate</th>
                                <th className="px-6 py-3 text-right">Reputation</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {agents.map((agent, i) => (
                                <tr
                                    key={agent.address}
                                    className="hover:bg-[var(--bg-elevated)] transition-colors group"
                                >
                                    <td className="px-6 py-4 text-center">
                                        {getRankBadge(i + 1)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold flex items-center justify-center">
                                                {agent.address.slice(2, 4).toUpperCase()}
                                            </div>
                                            <div>
                                                <Link href={`/agents/${agent.address}`} className="font-mono text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] hover:underline block">
                                                    {formatAddress(agent.address)}
                                                </Link>
                                                <span className="text-[10px] text-[var(--text-muted)]">
                                                    Last active: {new Date(agent.lastActive).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-[var(--text-primary)]">
                                        {formatAmount(agent.totalVolume)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">
                                        {agent.totalTransactions}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                            <TrendingUp className="w-3 h-3" />
                                            {(parseFloat(agent.successRate) * 100).toFixed(1)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                            {parseFloat(agent.reputationScore).toFixed(0)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/agents/${agent.address}`}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors inline-block"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
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
