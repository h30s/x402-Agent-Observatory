'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Telescope, Search, Bell, Settings } from 'lucide-react';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border)] z-40 flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search transactions, agents, protocols..."
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] search-input transition-all"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Live indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] rounded-full border border-[var(--border)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--success)] live-pulse" />
                    <span className="text-xs font-medium text-[var(--success)]">LIVE</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
                    <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--error)] text-[10px] font-bold flex items-center justify-center">3</span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
                    <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
            </div>
        </header>
    );
}
