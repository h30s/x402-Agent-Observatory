'use client';

import { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { searchTransactions, SearchResult, formatAddress, formatAmount, formatTimestamp } from '@/lib/api';

const suggestions = [
    "Failed payments in the last hour",
    "Top swaps over $500 today",
    "Transactions with VVS Finance",
    "Show successful transfers",
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
        <div className="w-full max-w-4xl mx-auto">
            {/* Search input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative mb-4">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search with natural language... (e.g., 'failed swaps over $500 today')"
                        className="w-full pl-14 pr-32 py-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] search-input transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Search
                    </button>
                </div>
            </form>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-6">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="px-4 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {/* Results */}
            {results && (
                <div className="glass-card overflow-hidden">
                    {/* Interpretation */}
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--primary)] bg-opacity-10">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-sm text-[var(--text-secondary)]">Interpreted as:</span>
                        </div>
                        <p className="text-[var(--text-primary)] font-medium mt-1">{results.interpretation}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{results.totalMatches} results found</p>
                    </div>

                    {/* Results list */}
                    <div className="divide-y divide-[var(--border)] max-h-[400px] overflow-y-auto">
                        {results.results.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)]">
                                No transactions match your query
                            </div>
                        ) : (
                            results.results.map((tx) => (
                                <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors">
                                    <div className={`badge ${tx.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                        {tx.status}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-[var(--text-primary)]">
                                                {formatAddress(tx.agent)}
                                            </span>
                                            <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                                            <span className="text-sm text-[var(--secondary)]">{tx.protocol}</span>
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)]">{tx.type} • {formatTimestamp(tx.timestamp)}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[var(--text-primary)]">{formatAmount(tx.amount)}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{tx.token}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
