'use client';

import { useState } from 'react';
import { Search, Sparkles, ArrowRight, CornerDownRight, Command } from 'lucide-react';
import { searchTransactions, SearchResult, formatAddress, formatAmount, formatTimestamp } from '@/lib/api';

const suggestions = [
    "Failed payments > $500",
    "High slippage VVS swaps",
    "Anomalous agent spikes",
    "Liquidity pool interactions",
];

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setQuery(searchQuery);

        try {
            const res = await searchTransactions(searchQuery);
            setResults(res);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto font-mono">
            {/* Terminal Input */}
            <div className="mb-6">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-[var(--success)] mr-2">➜</span>
                        <span className="text-[var(--text-muted)]">~</span>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="query_network --filter='failed swaps'"
                        className="block w-full pl-12 pr-12 py-4 bg-[var(--bg-app)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-secondary)] font-mono shadow-inner transition-colors"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <CornerDownRight className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                    </div>
                </form>

                {/* Quick Commands */}
                <div className="flex gap-2 mt-2 text-xs">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSearch(suggestion)}
                            className="px-2 py-1 bg-[var(--bg-panel)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terminal Output Results */}
            {results && (
                <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm overflow-hidden">
                    {/* Output Header */}
                    <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-app)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--success)]">✔</span>
                            <span className="text-[var(--text-secondary)]">INTERPRETATION:</span>
                            <span className="text-[var(--text-primary)] font-bold">"{results.interpretation}"</span>
                        </div>
                        <div className="text-[var(--text-muted)]">
                            {results.totalMatches} MATCHES FOUND
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="divide-y divide-[var(--border)] max-h-[60vh] overflow-y-auto text-xs">
                        {results.results.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)]">
                                NO DATA RETURNED
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[var(--bg-app)] text-[var(--text-muted)]">
                                    <tr>
                                        <th className="p-3 font-medium">STATUS</th>
                                        <th className="p-3 font-medium">TIMESTAMP</th>
                                        <th className="p-3 font-medium">AGENT</th>
                                        <th className="p-3 font-medium">PROTOCOL</th>
                                        <th className="p-3 font-medium">TYPE</th>
                                        <th className="p-3 font-medium text-right">VALUE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {results.results.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-[var(--bg-hover)] cursor-pointer group transition-colors">
                                            <td className="p-3">
                                                <div className={`w-2 h-2 rounded-full ${tx.status === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--error)]'
                                                    }`} />
                                            </td>
                                            <td className="p-3 text-[var(--text-secondary)]">{formatTimestamp(tx.timestamp)}</td>
                                            <td className="p-3 text-[var(--primary)] font-medium font-mono">{formatAddress(tx.agent)}</td>
                                            <td className="p-3">{tx.protocol}</td>
                                            <td className="p-3 uppercase text-[10px] tracking-wide">{tx.type}</td>
                                            <td className="p-3 text-right font-medium">{formatAmount(tx.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
