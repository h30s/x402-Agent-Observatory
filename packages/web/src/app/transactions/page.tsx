'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTransactions, Transaction, formatAddress, formatAmount, formatTimestamp } from '@/lib/api';
import { Activity, CheckCircle, XCircle, ExternalLink, ArrowRightLeft } from 'lucide-react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactions({ limit: 50 })
            .then(res => {
                setTransactions(res.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)] font-medium">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transactions</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Recent agent activities and on-chain interactions
                    </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <ArrowRightLeft className="w-6 h-6 text-blue-600" />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card overflow-hidden bg-white border border-[var(--border)] shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Latest Activity</h2>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-[var(--text-secondary)]">
                        Showing last 50
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs uppercase text-[var(--text-muted)] font-semibold">
                            <tr>
                                <th className="px-6 py-3 w-10 text-center">Status</th>
                                <th className="px-6 py-3">Hash</th>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Protocol</th>
                                <th className="px-6 py-3 text-right">Value</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="hover:bg-[var(--bg-elevated)] transition-colors group"
                                >
                                    <td className="px-6 py-4 text-center">
                                        {tx.status === 'success' ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm text-[var(--text-secondary)]">
                                                {formatAddress(tx.hash)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {formatTimestamp(tx.timestamp)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/agents/${tx.agent}`} className="font-mono text-sm font-medium text-[var(--primary)] hover:underline">
                                            {formatAddress(tx.agent)}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${tx.type === 'SWAP' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            tx.type === 'TRANSFER' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                                        {tx.protocol}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-[var(--text-primary)]">
                                        {formatAmount(tx.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors inline-block">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
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
