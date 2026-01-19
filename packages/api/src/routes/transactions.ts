import { Router } from 'express';
import { getTransactions, mockTransactions } from '../services/mockIndexer.js';

export const transactionsRouter = Router();

// GET /api/v1/transactions
transactionsRouter.get('/', (req, res) => {
    const {
        limit = '50',
        offset = '0',
        status,
        agent,
        protocol,
        minAmount,
        maxAmount,
    } = req.query;

    const result = getTransactions({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        status: status as string,
        agent: agent as string,
        protocol: protocol as string,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
    });

    res.json(result);
});

// GET /api/v1/transactions/:hash
transactionsRouter.get('/:hash', (req, res) => {
    const { hash } = req.params;
    const tx = mockTransactions.find(t => t.hash === hash);

    if (!tx) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(tx);
});
