'use client';

import { useState } from 'react';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border)] z-40 flex items-center justify-between px-8">
            {/* Search */}
            <div className="flex-1 max-w-lg">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Global search..."
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Live indicator */}
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--success-bg)] rounded-full border border-green-100 mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] live-pulse" />
                    <span className="text-xs font-semibold text-[var(--success)]">System Operational</span>
                </div>

                <button className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>

                <button className="relative p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--error)] border-2 border-white"></span>
                </button>

                <div className="w-px h-6 bg-[var(--border)] mx-1"></div>

                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[var(--bg-elevated)] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                        XO
                    </div>
                    <Settings className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
            </div>
        </header>
    );
}
