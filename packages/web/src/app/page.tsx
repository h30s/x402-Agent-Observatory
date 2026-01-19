'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LiveFeed } from '@/components/dashboard/LiveFeed';
import { VolumeChart, ProtocolPieChart } from '@/components/dashboard/Charts';
import { fetchAnalytics, Analytics } from '@/lib/api';
import { Telescope, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Loading observatory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)] opacity-5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Telescope className="w-8 h-8 text-[var(--primary)]" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)] glow-text">
              x402 Observatory
            </h1>
          </div>
          <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-2xl">
            Real-time visibility into the Cronos agentic economy. Monitor transactions,
            analyze agent behavior, and query the ecosystem with natural language.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/search" className="btn-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try Natural Language Search
            </Link>
            <Link href="/agents" className="btn-secondary flex items-center gap-2">
              View Agent Leaderboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <StatsCards
          volume24h={analytics.volume24h}
          transactions24h={analytics.transactions24h}
          uniqueAgents24h={analytics.uniqueAgents24h}
          successRate24h={analytics.successRate24h}
        />
      )}

      {/* Charts Row */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolumeChart data={analytics.hourlyVolume} />
          <ProtocolPieChart data={analytics.topProtocols} />
        </div>
      )}

      {/* Live Feed */}
      <LiveFeed />
    </div>
  );
}
