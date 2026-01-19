'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, HelpCircle, FileText, ExternalLink, LogOut, User, Zap } from 'lucide-react';
import Link from 'next/link';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<'none' | 'help' | 'notifications' | 'profile'>('none');
    const headerRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setActiveDropdown('none');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name: 'help' | 'notifications' | 'profile') => {
        setActiveDropdown(activeDropdown === name ? 'none' : name);
    };

    return (
        <header ref={headerRef} className="h-16 w-full bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-8 relative z-50">
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

                {/* Help Button & Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('help')}
                        className={`p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors ${activeDropdown === 'help' ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' : ''}`}
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {activeDropdown === 'help' && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-[var(--border)] p-2">
                            <div className="text-xs font-semibold text-[var(--text-muted)] px-3 py-2 uppercase">Help & Resources</div>
                            <Link href="/docs" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)]">
                                <FileText className="w-4 h-4 text-[var(--primary)]" />
                                <span>Documentation</span>
                            </Link>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)]">
                                <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                                <span>API Reference</span>
                            </a>
                            <div className="border-t border-[var(--border)] my-1"></div>
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                                Version 0.4.2-beta
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Button & Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('notifications')}
                        className={`relative p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors ${activeDropdown === 'notifications' ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' : ''}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--error)] border-2 border-white"></span>
                    </button>

                    {activeDropdown === 'notifications' && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--border)] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gray-50">
                                <span className="text-sm font-semibold text-[var(--text-primary)]">Notifications</span>
                                <span className="text-xs text-[var(--primary)] hover:underline cursor-pointer">Mark all read</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                <div className="px-4 py-3 border-b border-[var(--border)] hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                                    <div className="pl-4">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">High Gas Anomaly</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Unusual gas spike detected on Cronos chain. +450% above average.</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 border-b border-[var(--border)] hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="pl-4">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">Agent DE Active</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Agent 0xDead...cdEF started a new trading session.</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1">15 mins ago</p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="pl-4">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">System Update</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Observatory indexer patched successfully.</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 border-t border-[var(--border)] text-center">
                                <Link href="/anomalies" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">
                                    View all alerts
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-[var(--border)] mx-1"></div>

                {/* Profile Button & Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('profile')}
                        className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[var(--bg-elevated)] transition-colors ${activeDropdown === 'profile' ? 'bg-[var(--bg-elevated)]' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                            XO
                        </div>
                        <Settings className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>

                    {activeDropdown === 'profile' && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--border)] p-1">
                            <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">Admin Account</p>
                                <p className="text-xs text-[var(--text-muted)]">admin@x402.observatory</p>
                            </div>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-sm text-[var(--text-secondary)] text-left">
                                <User className="w-4 h-4" />
                                <span>Profile Settings</span>
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-sm text-[var(--text-secondary)] text-left">
                                <Zap className="w-4 h-4" />
                                <span>API Keys</span>
                            </button>
                            <div className="border-t border-[var(--border)] my-1"></div>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 text-left">
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
