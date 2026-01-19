'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAgents, Agent, formatAddress, formatAmount } from '@/lib/api';
import { Trophy, TrendingUp, Activity, ExternalLink, Crown, Medal, Award } from 'lucide-react';

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm text-[var(--text-muted)] font-medium">#{rank}</span>;
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
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Agent Leaderboard</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Top performing x402 agents ranked by volume and success rate
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-[var(--accent)]" />
                </div>
            </div>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {agents.slice(0, 3).map((agent, i) => (
                    <div
                        key={agent.address}
                        className={`glass-card p-6 text-center relative overflow-hidden ${i === 0 ? 'border-yellow-400/30' : i === 1 ? 'border-gray-300/30' : 'border-amber-600/30'
                            }`}
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
                        <div className="mb-3">{getRankIcon(i + 1)}</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {agent.address.slice(2, 4).toUpperCase()}
                            </span>
                        </div>
                        <p className="font-mono text-sm text-[var(--text-primary)] mb-2">
                            {formatAddress(agent.address)}
                        </p>
                        <p className="text-2xl font-bold text-[var(--text-primary)] glow-text">
                            {formatAmount(agent.totalVolume)}
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                            <span className="text-[var(--success)]">
                                {(parseFloat(agent.successRate) * 100).toFixed(1)}% success
                            </span>
                            <span className="text-[var(--text-muted)]">
                                {agent.totalTransactions} txs
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full leaderboard */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">All Agents</h2>
                </div>
                <div className="divide-y divide-[var(--border)]">
                    {agents.map((agent, i) => (
                        <div
                            key={agent.address}
                            className="flex items-center gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                            {/* Rank */}
                            <div className="w-8 flex items-center justify-center">
                                {getRankIcon(i + 1)}
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {agent.address.slice(2, 4).toUpperCase()}
                                </span>
                            </div>

                            {/* Address */}
                            <div className="flex-1">
                                <p className="font-mono text-[var(--text-primary)]">
                                    {formatAddress(agent.address)}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Last active: {new Date(agent.lastActive).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="text-right mr-4">
                                <p className="font-semibold text-[var(--text-primary)]">
                                    {formatAmount(agent.totalVolume)}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                    {agent.totalTransactions} transactions
                                </p>
                            </div>

                            {/* Success rate */}
                            <div className="w-24 text-right">
                                <div className="flex items-center gap-1 justify-end">
                                    <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                                    <span className="font-medium text-[var(--success)]">
                                        {(parseFloat(agent.successRate) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            {/* Reputation */}
                            <div className="w-20 text-right">
                                <span className="badge badge-info">
                                    {parseFloat(agent.reputationScore).toFixed(0)} pts
                                </span>
                            </div>

                            {/* View link */}
                            <Link
                                href={`/agents/${agent.address}`}
                                className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
