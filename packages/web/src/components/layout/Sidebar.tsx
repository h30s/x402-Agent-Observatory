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
    Settings
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/agents', label: 'Agents', icon: Users },
    { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/anomalies', label: 'Anomalies', icon: AlertTriangle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-14 bg-[var(--bg-app)] border-r border-[var(--border)] flex flex-col items-center py-4 z-50">
            {/* Brand Icon */}
            <div className="mb-6">
                <div className="w-8 h-8 rounded bg-[var(--text-primary)] text-white flex items-center justify-center">
                    <Telescope className="w-4 h-4" />
                </div>
            </div>

            {/* Navigation Icons */}
            <nav className="flex-1 flex flex-col gap-4 w-full items-center">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={label}
                            className={`w-9 h-9 rounded flex items-center justify-center transition-all ${isActive
                                    ? 'bg-[var(--bg-active)] text-[var(--text-primary)] shadow-sm'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Icons */}
            <div className="mt-auto flex flex-col gap-4">
                <button className="w-9 h-9 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
                    <Settings className="w-4 h-4" />
                </button>
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" title="System Operational"></div>
            </div>
        </aside>
    );
}
