import { v4 as uuid } from 'uuid';
import type { Server } from 'socket.io';

// Mock data generators
const AGENTS = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f8fEfb',
    '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    '0x1234567890AbcdEF1234567890AbcdEF12345678',
    '0xDeadBeef1234567890AbcdEF1234567890AbcdEF',
    '0xCafeBABE1234567890AbcdEF1234567890AbcdEF',
    '0xFACEB00C1234567890AbcdEF1234567890AbcdEF',
    '0xC0FFEE001234567890AbcdEF1234567890AbcdEF',
];

const PROTOCOLS = [
    { name: 'VVS Finance', category: 'DEX' },
    { name: 'Moonlander', category: 'Perpetuals' },
    { name: 'Delphi', category: 'Prediction Markets' },
    { name: 'Ferro Protocol', category: 'Stablecoin DEX' },
    { name: 'Tectonic', category: 'Lending' },
];

const TOKEN_SYMBOLS = ['CRO', 'USDC', 'USDT', 'WCRO', 'VVS', 'TONIC'];

const TX_TYPES = ['swap', 'transfer', 'stake', 'unstake', 'borrow', 'repay', 'provide_liquidity'];

const X402_TYPES = ['payment', 'authorization', 'settlement'];

// In-memory store for demo (replace with DB in production)
export const mockTransactions: any[] = [];
export const mockAgentStats: Map<string, any> = new Map();

function generateMockTransaction() {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
    const token = TOKEN_SYMBOLS[Math.floor(Math.random() * TOKEN_SYMBOLS.length)];
    const txType = TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)];
    const x402Type = X402_TYPES[Math.floor(Math.random() * X402_TYPES.length)];
    const isSuccess = Math.random() > 0.08; // 92% success rate

    const amount = (Math.random() * 10000).toFixed(2);
    const gasUsed = Math.floor(21000 + Math.random() * 200000);

    const tx = {
        id: uuid(),
        hash: `0x${uuid().replace(/-/g, '')}${uuid().replace(/-/g, '').slice(0, 2)}`,
        blockNumber: 12000000 + Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),

        agent,
        from: agent,
        to: `0x${uuid().replace(/-/g, '').slice(0, 40)}`,

        amount,
        token,
        tokenAddress: `0x${uuid().replace(/-/g, '').slice(0, 40)}`,

        protocol: protocol.name,
        protocolCategory: protocol.category,
        type: txType,
        x402Type,

        status: isSuccess ? 'success' : 'failed',
        errorMessage: isSuccess ? null : ['Insufficient funds', 'Slippage too high', 'Gas limit exceeded', 'Contract reverted'][Math.floor(Math.random() * 4)],

        gasUsed,
        gasPrice: (Math.random() * 50 + 5).toFixed(2),
        gasCostUsd: ((gasUsed * (Math.random() * 50 + 5)) / 1e9 * 0.1).toFixed(4),
    };

    // Update agent stats
    const stats = mockAgentStats.get(agent) || {
        address: agent,
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        totalVolume: 0,
        firstSeen: tx.timestamp,
        lastActive: tx.timestamp,
        protocols: new Set(),
    };

    stats.totalTransactions++;
    if (isSuccess) {
        stats.successfulTransactions++;
    } else {
        stats.failedTransactions++;
    }
    stats.totalVolume += parseFloat(amount);
    stats.lastActive = tx.timestamp;
    stats.protocols.add(protocol.name);

    mockAgentStats.set(agent, stats);

    return tx;
}

export function startMockIndexer(io: Server) {
    console.log('🚀 Starting mock transaction indexer...');

    // Generate initial batch
    for (let i = 0; i < 50; i++) {
        const tx = generateMockTransaction();
        tx.timestamp = new Date(Date.now() - Math.random() * 3600000).toISOString(); // Random time in last hour
        mockTransactions.push(tx);
    }

    // Sort by timestamp
    mockTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Emit new transactions periodically
    setInterval(() => {
        const tx = generateMockTransaction();
        mockTransactions.unshift(tx);

        // Keep only last 1000 transactions
        if (mockTransactions.length > 1000) {
            mockTransactions.pop();
        }

        // Emit to all connected clients
        io.emit('transaction', tx);
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds
}

export function getTransactions(filters: {
    limit?: number;
    offset?: number;
    status?: string;
    agent?: string;
    protocol?: string;
    minAmount?: number;
    maxAmount?: number;
}) {
    let filtered = [...mockTransactions];

    if (filters.status) {
        filtered = filtered.filter(tx => tx.status === filters.status);
    }
    if (filters.agent) {
        filtered = filtered.filter(tx => tx.agent.toLowerCase() === filters.agent!.toLowerCase());
    }
    if (filters.protocol) {
        filtered = filtered.filter(tx => tx.protocol.toLowerCase().includes(filters.protocol!.toLowerCase()));
    }
    if (filters.minAmount) {
        filtered = filtered.filter(tx => parseFloat(tx.amount) >= filters.minAmount!);
    }
    if (filters.maxAmount) {
        filtered = filtered.filter(tx => parseFloat(tx.amount) <= filters.maxAmount!);
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    return {
        data: filtered.slice(offset, offset + limit),
        pagination: {
            total: filtered.length,
            limit,
            offset,
        },
    };
}

export function getAgentProfile(address: string) {
    const stats = mockAgentStats.get(address);
    if (!stats) {
        return null;
    }

    return {
        address: stats.address,
        totalTransactions: stats.totalTransactions,
        successfulTransactions: stats.successfulTransactions,
        failedTransactions: stats.failedTransactions,
        successRate: stats.totalTransactions > 0
            ? (stats.successfulTransactions / stats.totalTransactions).toFixed(4)
            : '0',
        totalVolume: stats.totalVolume.toFixed(2),
        firstSeen: stats.firstSeen,
        lastActive: stats.lastActive,
        favoriteProtocols: Array.from(stats.protocols),
        reputationScore: ((stats.successfulTransactions / Math.max(stats.totalTransactions, 1)) * 100).toFixed(1),
    };
}

export function getAllAgents() {
    return Array.from(mockAgentStats.values()).map(stats => ({
        address: stats.address,
        totalTransactions: stats.totalTransactions,
        successRate: stats.totalTransactions > 0
            ? (stats.successfulTransactions / stats.totalTransactions).toFixed(4)
            : '0',
        totalVolume: stats.totalVolume.toFixed(2),
        lastActive: stats.lastActive,
        reputationScore: ((stats.successfulTransactions / Math.max(stats.totalTransactions, 1)) * 100).toFixed(1),
    })).sort((a, b) => parseFloat(b.totalVolume) - parseFloat(a.totalVolume));
}

export function getAnalytics(timeRange: '1h' | '24h' | '7d' = '24h') {
    const now = Date.now();

    // Determine start time based on range
    let rangeStart = now;
    if (timeRange === '1h') rangeStart = now - 60 * 60 * 1000;
    else if (timeRange === '7d') rangeStart = now - 7 * 24 * 60 * 60 * 1000;
    else rangeStart = now - 24 * 60 * 60 * 1000; // default 24h

    // Filter transactions for the selected range to calculate totals
    const rangeTxs = mockTransactions.filter(tx => new Date(tx.timestamp).getTime() > rangeStart);

    const rangeVolume = rangeTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const rangeSuccessful = rangeTxs.filter(tx => tx.status === 'success').length;

    // Protocol volumes (always based on current range)
    const protocolVolumes: Record<string, number> = {};
    rangeTxs.forEach(tx => {
        protocolVolumes[tx.protocol] = (protocolVolumes[tx.protocol] || 0) + parseFloat(tx.amount);
    });

    const topProtocols = Object.entries(protocolVolumes)
        .map(([name, volume]) => ({ name, volume: volume.toFixed(2) }))
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
        .slice(0, 5);

    // Dynamic Chart Bucketing
    const chartData: { hour: string; volume: number; count: number }[] = [];

    if (timeRange === '1h') {
        // 5-minute intervals for 1H
        for (let i = 11; i >= 0; i--) {
            const bucketStart = new Date(now - i * 5 * 60 * 1000);
            bucketStart.setSeconds(0, 0); // round to minute
            // further round to nearest 5 min
            const min = bucketStart.getMinutes();
            bucketStart.setMinutes(min - (min % 5));

            const bucketEnd = new Date(bucketStart.getTime() + 5 * 60 * 1000);

            const bucketTxs = mockTransactions.filter(tx => {
                const txTime = new Date(tx.timestamp).getTime();
                return txTime >= bucketStart.getTime() && txTime < bucketEnd.getTime();
            });

            chartData.push({
                hour: bucketStart.toISOString().slice(11, 16), // HH:MM
                volume: bucketTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
                count: bucketTxs.length
            });
        }
    } else if (timeRange === '7d') {
        // Daily intervals for 7D
        for (let i = 6; i >= 0; i--) {
            const bucketStart = new Date(now - i * 24 * 60 * 60 * 1000);
            bucketStart.setHours(0, 0, 0, 0); // Start of day
            const bucketEnd = new Date(bucketStart.getTime() + 24 * 60 * 60 * 1000);

            const bucketTxs = mockTransactions.filter(tx => {
                const txTime = new Date(tx.timestamp).getTime();
                return txTime >= bucketStart.getTime() && txTime < bucketEnd.getTime();
            });

            // Format day like 'Mon', 'Tue'
            const dayName = bucketStart.toLocaleDateString('en-US', { weekday: 'short' });

            chartData.push({
                hour: dayName,
                volume: bucketTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
                count: bucketTxs.length
            });
        }
    } else {
        // Default 24H: Hourly intervals
        for (let i = 23; i >= 0; i--) {
            const bucketStart = new Date(now - i * 60 * 60 * 1000);
            bucketStart.setMinutes(0, 0, 0);
            const bucketEnd = new Date(bucketStart.getTime() + 60 * 60 * 1000);

            const bucketTxs = mockTransactions.filter(tx => {
                const txTime = new Date(tx.timestamp).getTime();
                return txTime >= bucketStart.getTime() && txTime < bucketEnd.getTime();
            });

            chartData.push({
                hour: bucketStart.toISOString().slice(11, 16), // HH:MM
                volume: bucketTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
                count: bucketTxs.length,
            });
        }
    }

    return {
        volume24h: rangeVolume.toFixed(2), // This key name is retained for compatibility, but value reflects range
        transactions24h: rangeTxs.length,
        uniqueAgents24h: new Set(rangeTxs.map(tx => tx.agent)).size,
        successRate24h: rangeTxs.length > 0 ? (rangeSuccessful / rangeTxs.length).toFixed(4) : '0',
        topProtocols,
        hourlyVolume: chartData, // Key retained as 'hourlyVolume' but content varies
    };
}

export function searchTransactions(query: string, limit: number = 10) {
    const queryLower = query.toLowerCase();

    // Simple keyword-based search for demo
    let filtered = [...mockTransactions];
    let interpretation = '';

    // Parse common patterns
    if (queryLower.includes('failed')) {
        filtered = filtered.filter(tx => tx.status === 'failed');
        interpretation += 'Failed transactions';
    } else if (queryLower.includes('success')) {
        filtered = filtered.filter(tx => tx.status === 'success');
        interpretation += 'Successful transactions';
    }

    // Amount filters
    const overMatch = queryLower.match(/over \$?(\d+)/);
    if (overMatch) {
        const amount = parseFloat(overMatch[1]);
        filtered = filtered.filter(tx => parseFloat(tx.amount) > amount);
        interpretation += ` with amount > $${amount}`;
    }

    const underMatch = queryLower.match(/under \$?(\d+)/);
    if (underMatch) {
        const amount = parseFloat(underMatch[1]);
        filtered = filtered.filter(tx => parseFloat(tx.amount) < amount);
        interpretation += ` with amount < $${amount}`;
    }

    // Time filters
    if (queryLower.includes('today') || queryLower.includes('last 24') || queryLower.includes('24h')) {
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        filtered = filtered.filter(tx => new Date(tx.timestamp).getTime() > dayAgo);
        interpretation += ' in last 24 hours';
    } else if (queryLower.includes('hour') || queryLower.includes('last hour')) {
        const hourAgo = Date.now() - 60 * 60 * 1000;
        filtered = filtered.filter(tx => new Date(tx.timestamp).getTime() > hourAgo);
        interpretation += ' in last hour';
    }

    // Protocol filters
    for (const protocol of PROTOCOLS) {
        if (queryLower.includes(protocol.name.toLowerCase())) {
            filtered = filtered.filter(tx => tx.protocol === protocol.name);
            interpretation += ` on ${protocol.name}`;
            break;
        }
    }

    // Type filters
    if (queryLower.includes('swap')) {
        filtered = filtered.filter(tx => tx.type === 'swap');
        interpretation += ' (swaps only)';
    } else if (queryLower.includes('transfer')) {
        filtered = filtered.filter(tx => tx.type === 'transfer');
        interpretation += ' (transfers only)';
    }

    if (!interpretation) {
        interpretation = 'All matching transactions';
    }

    return {
        results: filtered.slice(0, limit),
        interpretation: interpretation.trim(),
        totalMatches: filtered.length,
    };
}
