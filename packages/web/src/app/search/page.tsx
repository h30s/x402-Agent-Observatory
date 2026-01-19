import { SearchBar } from '@/components/search/SearchBar';
import { Sparkles } from 'lucide-react';

export default function SearchPage() {
    return (
        <div className="py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] bg-opacity-20 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--primary)] font-medium">AI-Powered Search</span>
                </div>
                <h1 className="text-4xl font-bold text-[var(--text-primary)] glow-text mb-4">
                    Natural Language Search
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Query the entire x402 ecosystem using natural language.
                    Find transactions, analyze patterns, and discover insights.
                </p>
            </div>

            {/* Search */}
            <SearchBar />
        </div>
    );
}
