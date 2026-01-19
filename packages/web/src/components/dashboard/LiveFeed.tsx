'use client';

import { useEffect, useState } from 'react';
import { useTransactionStream } from '@/hooks/useSocket';
import { fetchTransactions, formatAddress, formatAmount, formatTimestamp, Transaction } from '@/lib/api';
import { ArrowRight, CheckCircle, XCircle, Pause, Play } from 'lucide-react';

interface TransactionRowProps {
    tx: Transaction;
    isNew?: boolean;
}

function TransactionRow({ tx, isNew }: TransactionRowProps) {
    return (
        <div className={`flex items-center gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors ${isNew ? 'animate-slide-in' : ''}`}>
            {/* Status */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.status === 'success'
                    ? 'bg-[var(--success)] bg-opacity-20'
                    : 'bg-[var(--error)] bg-opacity-20'
                }`}>
                {tx.status === 'success'
                    ? <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                    : <XCircle className="w-4 h-4 text-[var(--error)]" />
                }
            </div>

            {/* Agent & Protocol */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-[var(--text-primary)]">
                        {formatAddress(tx.agent)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--secondary)]">{tx.protocol}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="badge badge-info">{tx.type}</span>
                    <span className="text-xs text-[var(--text-muted)]">{tx.x402Type}</span>
                </div>
            </div>

            {/* Amount */}
            <div className="text-right">
                <p className="font-semibold text-[var(--text-primary)]">
                    {formatAmount(tx.amount)} <span className="text-sm text-[var(--text-muted)]">{tx.token}</span>
                </p>
                <p className="text-xs text-[var(--text-muted)]">{formatTimestamp(tx.timestamp)}</p>
            </div>
        </div>
    );
}

export function LiveFeed() {
    const { transactions, isConnected, setTransactions } = useTransactionStream(30);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial transactions
    useEffect(() => {
        fetchTransactions({ limit: 30 })
            .then(res => {
                setTransactions(res.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [setTransactions]);

    return (
        <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--success)] live-pulse' : 'bg-[var(--error)]'}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Live x402 Transactions
                    </h2>
                    <span className="text-sm text-[var(--text-muted)]">
                        {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                </div>
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
            </div>

            {/* Transaction list */}
            <div className="divide-y divide-[var(--border)] max-h-[500px] overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-[var(--text-muted)]">Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                        Waiting for transactions...
                    </div>
                ) : (
                    transactions.map((tx, i) => (
                        <TransactionRow key={tx.id} tx={tx} isNew={i === 0} />
                    ))
                )}
            </div>
        </div>
    );
}
