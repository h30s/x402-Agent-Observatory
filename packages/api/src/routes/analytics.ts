import { Router } from 'express';
import { query } from '../db/index.js';

export const analyticsRouter = Router();

// Helper to get time range filter
function getRangeFilter(range: '1h' | '24h' | '7d') {
    const now = new Date();
    if (range === '1h') return new Date(now.getTime() - 60 * 60 * 1000);
    if (range === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h default
}

// GET /api/v1/analytics/overview
analyticsRouter.get('/overview', async (req, res) => {
    const range = (req.query.range as '1h' | '24h' | '7d') || '24h';
    const since = getRangeFilter(range);

    try {
        // 1. Volume & Counts
        const statsQuery = `
            SELECT 
                COALESCE(SUM(amount), 0) as volume,
                COUNT(*) as count,
                COUNT(DISTINCT agent_address) as unique_agents,
                COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count
            FROM transactions 
            WHERE block_timestamp > $1
        `;
        const stats = (await query(statsQuery, [since]))[0];

        // 2. Protocol Dominance
        const protocolQuery = `
            SELECT protocol as name, COALESCE(SUM(amount), 0) as volume
            FROM transactions
            WHERE block_timestamp > $1
            GROUP BY protocol
            ORDER BY volume DESC
            LIMIT 5
        `;
        const topProtocols = await query(protocolQuery, [since]);

        // 3. Hourly/Daily Volume for Chart
        // For simplicity, let's just do hourly buckets for now
        const chartQuery = `
            SELECT 
                date_trunc('hour', block_timestamp) as hour,
                SUM(amount) as volume,
                COUNT(*) as count
            FROM transactions
            WHERE block_timestamp > $1
            GROUP BY 1
            ORDER BY 1 ASC
        `;
        const chartDataRaw = await query(chartQuery, [since]);

        const hourlyVolume = chartDataRaw.map((row: any) => ({
            hour: new Date(row.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            volume: parseFloat(row.volume),
            count: parseInt(row.count)
        }));

        res.json({
            volume24h: stats.volume,
            transactions24h: parseInt(stats.count),
            uniqueAgents24h: parseInt(stats.unique_agents),
            successRate24h: stats.count > 0 ? (stats.success_count / stats.count).toFixed(4) : '0',
            topProtocols: topProtocols.map((p: any) => ({ name: p.name, volume: parseFloat(p.volume).toFixed(2) })),
            hourlyVolume
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET /api/v1/analytics/health
analyticsRouter.get('/health', async (req, res) => {
    try {
        const since = getRangeFilter('24h');

        const stats = (await query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'success' THEN 1 END) as success,
                COUNT(DISTINCT agent_address) as agents
            FROM transactions 
            WHERE block_timestamp > $1
        `, [since]))[0];

        const total = parseInt(stats.total);
        const success = parseInt(stats.success);
        const successRate = total > 0 ? success / total : 1;

        // Health Score Logic
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
            metrics: {
                transactions24h: total,
                successRate24h: successRate.toFixed(4),
                uniqueAgents24h: parseInt(stats.agents)
            },
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({ error: 'Health check failed' });
    }
});

