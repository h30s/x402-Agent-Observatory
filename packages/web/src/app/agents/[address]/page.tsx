'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchAgentProfile, Agent, formatAddress, formatAmount } from '@/lib/api';
import { User, Activity, TrendingUp, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AgentProfilePage() {
    const params = useParams();
    const address = params.address as string;
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (address) {
            fetchAgentProfile(address)
                .then(data => {
                    if (data) {
                        setAgent(data);
                    } else {
                        setError('Agent not found');
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load agent profile');
                    setIsLoading(false);
                });
        }
    }, [address]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)] font-medium">Loading agent profile...</p>
                </div>
            </div>
        );
    }

    if (error || !agent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <XCircle className="w-12 h-12 text-red-500" />
                <p className="text-lg text-[var(--text-primary)]">{error || 'Agent not found'}</p>
                <Link href="/agents" className="text-[var(--primary)] hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
                </Link>
            </div>
        );
    }

    const successRate = parseFloat(agent.successRate) * 100;

    return (
        <div className="px-8 py-8 space-y-8 max-w-4xl mx-auto">
            {/* Back Link */}
            <Link href="/agents" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Agents
            </Link>

            {/* Header */}
            <div className="flex items-center gap-6 border-b border-[var(--border)] pb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] font-mono">{formatAddress(address)}</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1 font-mono">{address}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <Activity className="w-4 h-4" /> Total Txns
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                        {agent.totalTransactions.toLocaleString()}
                    </div>
                </div>

                <div className="card p-4 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <TrendingUp className="w-4 h-4" /> Volume
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                        {formatAmount(agent.totalVolume)}
                    </div>
                </div>

                <div className="card p-4 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        <CheckCircle className="w-4 h-4" /> Success Rate
                    </div>
                    <div className={`text-xl font-bold ${successRate >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {successRate.toFixed(1)}%
                    </div>
                </div>

                <div className="card p-4 bg-white border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1 text-[var(--text-muted)] text-xs font-semibold uppercase">
                        Reputation
                    </div>
                    <div className="text-xl font-bold text-[var(--text-primary)]">
                        {agent.reputationScore}
                    </div>
                </div>
            </div>

            {/* Activity Info */}
            <div className="card p-6 bg-white border border-[var(--border)]">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Activity</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-[var(--text-muted)]">First Seen:</span>
                        <span className="ml-2 text-[var(--text-primary)]">{agent.firstSeen ? new Date(agent.firstSeen).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Last Active:</span>
                        <span className="ml-2 text-[var(--text-primary)]">{new Date(agent.lastActive).toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Successful:</span>
                        <span className="ml-2 text-green-600">{agent.successfulTransactions ?? 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Failed:</span>
                        <span className="ml-2 text-red-600">{agent.failedTransactions ?? 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
