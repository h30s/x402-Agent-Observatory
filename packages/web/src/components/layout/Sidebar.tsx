'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Telescope,
    LayoutDashboard,
    Search,
    Users,
    ArrowLeftRight,
    BarChart3,
    AlertTriangle,
    Code,
    ExternalLink
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/agents', label: 'Agents', icon: Users },
    { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/anomalies', label: 'Anomalies', icon: AlertTriangle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                    <Telescope className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-[var(--text-primary)] text-lg leading-none">x402</h1>
                    <p className="text-xs text-[var(--text-muted)]">Observatory</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? 'bg-[var(--primary)] bg-opacity-20 text-[var(--primary)] border border-[var(--primary)] border-opacity-30'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* MCP Status */}
            <div className="p-3 border-t border-[var(--border)]">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-[var(--secondary)]" />
                        <span className="text-xs font-semibold text-[var(--text-primary)]">MCP Server</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-3">
                        AI assistants can query this observatory
                    </p>
                    <a
                        href="#"
                        className="flex items-center gap-1 text-xs text-[var(--secondary)] hover:underline"
                    >
                        View docs <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Version */}
            <div className="px-5 py-3 text-[10px] text-[var(--text-muted)]">
                v1.0.0 • Cronos Testnet
            </div>
        </aside>
    );
}
