import { Router } from 'express';
import { searchTransactions } from '../services/mockIndexer.js';

export const searchRouter = Router();

// POST /api/v1/search
searchRouter.post('/', (req, res) => {
    const { query, limit = 10 } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const result = searchTransactions(query, limit);
    res.json(result);
});

// GET /api/v1/search (for convenience)
searchRouter.get('/', (req, res) => {
    const { q, limit = '10' } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const result = searchTransactions(q as string, parseInt(limit as string));
    res.json(result);
});
