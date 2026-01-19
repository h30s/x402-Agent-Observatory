import { Router } from 'express';
import { getAnalytics, mockTransactions, mockAgentStats } from '../services/mockIndexer.js';

export const analyticsRouter = Router();

// GET /api/v1/analytics/overview
analyticsRouter.get('/overview', (req, res) => {
    const range = (req.query.range as '1h' | '24h' | '7d') || '24h';
    const analytics = getAnalytics(range);
    res.json(analytics);
});

// GET /api/v1/analytics/health
analyticsRouter.get('/health', (req, res) => {
    const analytics = getAnalytics();
    const successRate = parseFloat(analytics.successRate24h);

    // Determine ecosystem health
    let healthStatus = 'healthy';
    let healthScore = 100;

    if (successRate < 0.7) {
        healthStatus = 'critical';
        healthScore = 30;
    } else if (successRate < 0.85) {
        healthStatus = 'warning';
        healthScore = 60;
    } else if (successRate < 0.95) {
        healthStatus = 'good';
        healthScore = 85;
    }

    res.json({
        status: healthStatus,
        score: healthScore,
        ...analytics,
        totalTransactionsIndexed: mockTransactions.length,
        totalAgentsTracked: mockAgentStats.size,
        lastUpdated: new Date().toISOString(),
    });
});

// GET /api/v1/analytics/protocols
analyticsRouter.get('/protocols', (req, res) => {
    const protocolStats: Record<string, { transactions: number; volume: number; successRate: number }> = {};

    mockTransactions.forEach(tx => {
        if (!protocolStats[tx.protocol]) {
            protocolStats[tx.protocol] = { transactions: 0, volume: 0, successRate: 0 };
        }
        protocolStats[tx.protocol].transactions++;
        protocolStats[tx.protocol].volume += parseFloat(tx.amount);
    });

    // Calculate success rates
    Object.keys(protocolStats).forEach(protocol => {
        const protocolTxs = mockTransactions.filter(tx => tx.protocol === protocol);
        const successful = protocolTxs.filter(tx => tx.status === 'success').length;
        protocolStats[protocol].successRate = protocolTxs.length > 0
            ? successful / protocolTxs.length
            : 0;
    });

    const protocols = Object.entries(protocolStats)
        .map(([name, stats]) => ({
            name,
            transactions: stats.transactions,
            volume: stats.volume.toFixed(2),
            successRate: stats.successRate.toFixed(4),
        }))
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));

    res.json({ protocols });
});
