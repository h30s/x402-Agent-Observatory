'use client';

import { useEffect, useState } from 'react';
import { useTransactionStream } from '@/hooks/useSocket';
import { fetchTransactions, formatAddress, formatAmount, formatTimestamp, Transaction } from '@/lib/api';
import { Pause, Play, Activity } from 'lucide-react';

export function LiveFeed() {
    const { transactions, isConnected, setTransactions } = useTransactionStream(50);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetchTransactions({ limit: 50 }).then(res => setTransactions(res.data)).catch(console.error);
    }, [setTransactions]);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-panel)] border-l border-[var(--border)]">
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-3 border-b border-[var(--border)] bg-[var(--bg-app)]">
                <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Market Tape</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`} />
                    <button onClick={() => setIsPaused(!isPaused)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* Data List */}
            <div className="flex-1 overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-[60px_1fr_80px] px-3 py-2 border-b border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-app)] sticky top-0 font-medium">
                    <div>TIME</div>
                    <div>AGENT / ACTION</div>
                    <div className="text-right">VALUE</div>
                </div>

                {transactions.map((tx) => (
                    <div key={tx.id} className="grid grid-cols-[60px_1fr_80px] px-3 py-1.5 border-b border-[var(--border)] hover:bg-[var(--bg-hover)] items-center cursor-default group transition-colors">
                        <div className="text-[var(--text-muted)]">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div className="truncate pr-2">
                            <span className="text-[var(--primary)] font-medium mr-2">{formatAddress(tx.agent)}</span>
                            <span className={`px-1 rounded text-[10px] uppercase ${tx.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {tx.type}
                            </span>
                            <span className="ml-2 text-[var(--text-secondary)] text-[10px]">{tx.protocol}</span>
                        </div>
                        <div className="text-right font-medium">
                            {formatAmount(tx.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
