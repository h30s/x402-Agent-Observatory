import { Router } from 'express';
import { v4 as uuid } from 'uuid';

export const anomaliesRouter = Router();

const ANOMALY_TYPES = [
    'HIGH_FREQUENCY_TRADING',
    'WASH_TRADING_SUSPICION',
    'UNUSUAL_GAS_USAGE',
    'FLASH_LOAN_ATTACK_ATTEMPT',
    'ARBITRAGE_LOOP_DETECTED',
];

const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const AGENTS = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f8fEfb',
    '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    '0x1234567890AbcdEF1234567890AbcdEF12345678',
];

// Generate mock anomalies
function getMockAnomalies() {
    return Array.from({ length: 12 }).map(() => {
        const type = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)];
        const severity = SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)];

        let description = '';
        switch (type) {
            case 'HIGH_FREQUENCY_TRADING':
                description = `Agent executed ${Math.floor(Math.random() * 50) + 50} transactions in 1 minute.`;
                break;
            case 'WASH_TRADING_SUSPICION':
                description = 'Repeated circular trades detected between associated wallets.';
                break;
            case 'UNUSUAL_GAS_USAGE':
                description = `Gas price paid 500% above network average (${(Math.random() * 50).toFixed(1)} Gwei).`;
                break;
            case 'FLASH_LOAN_ATTACK_ATTEMPT':
                description = 'Complex flash loan sequence reverted with high value impact.';
                break;
            case 'ARBITRAGE_LOOP_DETECTED':
                description = 'Rapid arbitrage cycle detected across 3 DEX protocols.';
                break;
        }

        return {
            id: uuid(),
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
            type,
            severity,
            agent: AGENTS[Math.floor(Math.random() * AGENTS.length)],
            description,
            confidenceScore: (Math.random() * 0.2 + 0.8).toFixed(2), // 0.80 - 0.99
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// GET /api/v1/anomalies
anomaliesRouter.get('/', (req, res) => {
    const anomalies = getMockAnomalies();
    res.json(anomalies);
});
