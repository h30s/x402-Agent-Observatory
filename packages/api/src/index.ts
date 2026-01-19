import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { transactionsRouter } from './routes/transactions.js';
import { agentsRouter } from './routes/agents.js';
import { searchRouter } from './routes/search.js';
import { analyticsRouter } from './routes/analytics.js';
import { anomaliesRouter } from './routes/anomalies.js';
import { startMockIndexer } from './services/mockIndexer.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/agents', agentsRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/anomalies', anomaliesRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Export io for use in other modules
export { io };

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🔭 x402 Observatory API running on port ${PORT}`);
    console.log(`   WebSocket ready for real-time updates`);

    // Start mock indexer for demo
    startMockIndexer(io);
});
