import { Router } from 'express';
import OpenAI from 'openai';
import { searchTransactions as mockSearch } from '../services/mockIndexer.js';
import { query } from '../db/index.js';

export const searchRouter = Router();

// Initialize OpenAI if key is present
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function realSearch(searchQuery: string, limit: number) {
    if (!openai) throw new Error('OpenAI key missing');

    // 1. Generate Embedding
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: searchQuery,
    });
    const embedding = JSON.stringify(response.data[0].embedding);

    // 2. Vector Search
    const vectorQuery = `
        SELECT transaction_id, 1 - (embedding <=> $1) as similarity
        FROM transaction_embeddings
        ORDER BY embedding <=> $1
        LIMIT $2;
    `;

    const vectorResults = await query(vectorQuery, [embedding, limit]);

    if (vectorResults.length === 0) {
        return { results: [], interpretation: "No matching transactions found via semantic search.", totalMatches: 0 };
    }

    const txIds = vectorResults.map(r => r.transaction_id);

    // 3. Fetch Transaction Details
    const txQuery = `
        SELECT * FROM transactions WHERE id = ANY($1)
    `;
    const txResults = await query(txQuery, [txIds]);

    // 4. Map back to format
    const results = txResults.map((tx: any) => ({
        id: tx.id.toString(),
        hash: tx.tx_hash,
        agent: tx.agent_address,
        amount: tx.amount,
        token: tx.token_symbol || 'CRO',
        protocol: tx.protocol,
        type: tx.x402_type || 'payment',
        status: tx.status,
        timestamp: tx.block_timestamp,
    }));

    return {
        results,
        interpretation: `Semantic search for "${searchQuery}"`,
        totalMatches: results.length
    };
}

// POST /api/v1/search
searchRouter.post('/', async (req, res) => {
    const { query, limit = 10 } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // Try Real Search first if configured
        if (openai) {
            try {
                const realResults = await realSearch(query, limit);
                // If real search returns nothing (might be empty DB), maybe fallback? 
                // For now, let's trust it if it worked.
                if (realResults.totalMatches > 0) {
                    return res.json(realResults);
                }
            } catch (e) {
                console.error('Real search failed, falling back to mock:', e);
            }
        }

        // Fallback to Mock
        const result = mockSearch(query, limit);

        // Add a flag to indicate it was a mock result
        res.json({ ...result, _source: 'mock' });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/v1/search
// GET /api/v1/search
searchRouter.get('/', async (req, res) => {
    // Manually invoking the logic to avoid 'handle' type error
    const queryStr = req.query.q as string;
    const limit = parseInt(req.query.limit as string || '10');

    if (!queryStr) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        if (openai) {
            try {
                const realResults = await realSearch(queryStr, limit);
                if (realResults.totalMatches > 0) {
                    return res.json(realResults);
                }
            } catch (e) {
                console.error('Real search failed, falling back to mock:', e);
            }
        }

        const result = mockSearch(queryStr, limit);
        res.json({ ...result, _source: 'mock' });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

