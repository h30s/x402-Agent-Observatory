import { Router } from 'express';
import { getAgentProfile, getAllAgents } from '../services/mockIndexer.js';

export const agentsRouter = Router();

// GET /api/v1/agents
agentsRouter.get('/', (req, res) => {
    const agents = getAllAgents();
    res.json({
        data: agents,
        total: agents.length,
    });
});

// GET /api/v1/agents/:address
agentsRouter.get('/:address', (req, res) => {
    const { address } = req.params;
    const profile = getAgentProfile(address);

    if (!profile) {
        return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(profile);
});
