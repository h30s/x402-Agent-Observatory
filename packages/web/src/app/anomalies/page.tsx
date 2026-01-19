'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAnomalies, Anomaly, formatAddress, formatTimestamp } from '@/lib/api';
import { AlertTriangle, ShieldAlert, AlertOctagon, Info, Zap } from 'lucide-react';

export default function AnomaliesPage() {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnomalies()
            .then(res => {
                setAnomalies(res);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)] font-medium">Scanning for network anomalies...</p>
                </div>
            </div>
        );
    }

    const getSeverityDetails = (severity: Anomaly['severity']) => {
        switch (severity) {
            case 'CRITICAL':
                return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertOctagon };
            case 'HIGH':
                return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: ShieldAlert };
            case 'MEDIUM':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: AlertTriangle };
            case 'LOW':
                return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Info };
        }
    };

    return (
        <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Anomaly Detection</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        AI-powered monitoring of suspicious agent behaviors and network irregularities
                    </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <Zap className="w-6 h-6 text-red-600" />
                </div>
            </div>

            <div className="grid gap-4">
                {anomalies.map((anomaly) => {
                    const style = getSeverityDetails(anomaly.severity);
                    const Icon = style.icon;
                    return (
                        <div key={anomaly.id} className={`card p-6 border ${style.border} hover:shadow-md transition-all`}>
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${style.bg} h-fit`}>
                                        <Icon className={`w-6 h-6 ${style.color}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-[var(--text-primary)]">
                                                {anomaly.type.replace(/_/g, ' ')}
                                            </h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.bg} ${style.color}`}>
                                                {anomaly.severity}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-sm mb-4 max-w-2xl">
                                            {anomaly.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold uppercase tracking-wider">Detected</span>
                                                <span>{formatTimestamp(anomaly.timestamp)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold uppercase tracking-wider">Source</span>
                                                <Link href={`/agents/${anomaly.agent}`} className="font-mono text-[var(--primary)] hover:underline">
                                                    {formatAddress(anomaly.agent)}
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold uppercase tracking-wider">AI Confidence</span>
                                                <span className="text-[var(--text-primary)] font-medium">
                                                    {(parseFloat(anomaly.confidenceScore) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
