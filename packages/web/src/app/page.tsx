'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LiveFeed } from '@/components/dashboard/LiveFeed';
import { VolumeChart, ProtocolPieChart } from '@/components/dashboard/Charts';
import { fetchAnalytics, Analytics } from '@/lib/api';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(console.error);
    const interval = setInterval(() => fetchAnalytics().then(setAnalytics), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Ticker Bar */}
      {analytics && (
        <StatsCards
          volume24h={analytics.volume24h}
          transactions24h={analytics.transactions24h}
          uniqueAgents24h={analytics.uniqueAgents24h}
          successRate24h={analytics.successRate24h}
        />
      )}

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] overflow-hidden">

        {/* Left Panel: Analytics Grids */}
        <div className="bg-[var(--bg-app)] p-4 overflow-y-auto">
          {/* Chart Container */}
          <div className="grid grid-cols-1 gap-4 h-full">

            {/* Volume Chart Panel */}
            <div className="bg-white border border-[var(--border)] rounded-sm p-4 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Volume / 24H</h3>
                <div className="flex gap-2 text-[10px] font-mono">
                  <button className="px-2 py-0.5 bg-[var(--bg-active)] rounded text-[var(--text-primary)]">1H</button>
                  <button className="px-2 py-0.5 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">24H</button>
                  <button className="px-2 py-0.5 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">7D</button>
                </div>
              </div>
              <div className="flex-1">
                {analytics && <VolumeChart data={analytics.hourlyVolume} />}
              </div>
            </div>

            {/* Protocol Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[var(--border)] rounded-sm p-4 h-[300px]">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Protocol Dominance</h3>
                {analytics && <ProtocolPieChart data={analytics.topProtocols} />}
              </div>

              {/* Placeholder for future map/network graph */}
              <div className="bg-white border border-[var(--border)] rounded-sm p-4 h-[300px] relative flex flex-col items-center justify-center text-[var(--text-muted)] border-dashed">
                <h3 className="absolute top-4 left-4 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Network Map</h3>
                <div className="text-sm">Signal Visualization</div>
                <div className="text-xs mt-1 opacity-50 font-mono">Coming Soon</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel: Market Tape */}
        <div className="h-full overflow-hidden border-l border-[var(--border)] bg-white">
          <LiveFeed />
        </div>

      </div>
    </div>
  );
}
