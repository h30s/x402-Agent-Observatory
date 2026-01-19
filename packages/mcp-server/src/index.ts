#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Helper function to fetch from API
async function fetchAPI(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return response.json();
}

// Create server instance
const server = new Server(
    {
        name: 'x402-observatory',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'query_x402_activity',
                description: 'Search x402 agent transactions on Cronos using natural language. Returns transaction data matching the query.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Natural language query about x402 activity (e.g., "show failed payments over $100 today", "find swaps with VVS Finance")',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results to return (default: 10)',
                            default: 10,
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_agent_profile',
                description: 'Get detailed profile and statistics for an x402 agent by their wallet address',
                inputSchema: {
                    type: 'object',
                    properties: {
                        address: {
                            type: 'string',
                            description: 'Ethereum/Cronos wallet address of the agent (0x...)',
                        },
                    },
                    required: ['address'],
                },
            },
            {
                name: 'get_ecosystem_health',
                description: 'Get current health metrics and statistics of the x402 ecosystem on Cronos. Returns volume, transaction counts, success rates, and top protocols.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_top_agents',
                description: 'Get the leaderboard of top-performing x402 agents ranked by volume and success rate',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Number of agents to return (default: 10)',
                            default: 10,
                        },
                    },
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'query_x402_activity': {
                const result = await fetchAPI('/api/v1/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: args?.query,
                        limit: args?.limit || 10,
                    }),
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                interpretation: result.interpretation,
                                totalMatches: result.totalMatches,
                                transactions: result.results.map((tx: any) => ({
                                    hash: tx.hash,
                                    agent: tx.agent,
                                    amount: `${tx.amount} ${tx.token}`,
                                    protocol: tx.protocol,
                                    type: tx.type,
                                    status: tx.status,
                                    timestamp: tx.timestamp,
                                })),
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_agent_profile': {
                const profile = await fetchAPI(`/api/v1/agents/${args?.address}`);

                if (!profile || profile.error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Agent not found: ${args?.address}`,
                            },
                        ],
                    };
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(profile, null, 2),
                        },
                    ],
                };
            }

            case 'get_ecosystem_health': {
                const health = await fetchAPI('/api/v1/analytics/health');

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                status: health.status,
                                healthScore: health.score,
                                metrics: {
                                    volume24h: `$${health.volume24h}`,
                                    transactions24h: health.transactions24h,
                                    uniqueAgents24h: health.uniqueAgents24h,
                                    successRate24h: `${(parseFloat(health.successRate24h) * 100).toFixed(1)}%`,
                                },
                                topProtocols: health.topProtocols,
                                lastUpdated: health.lastUpdated,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_top_agents': {
                const result = await fetchAPI('/api/v1/agents');
                const agents = result.data.slice(0, args?.limit || 10);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                leaderboard: agents.map((agent: any, i: number) => ({
                                    rank: i + 1,
                                    address: agent.address,
                                    totalVolume: `$${agent.totalVolume}`,
                                    totalTransactions: agent.totalTransactions,
                                    successRate: `${(parseFloat(agent.successRate) * 100).toFixed(1)}%`,
                                    reputationScore: agent.reputationScore,
                                })),
                            }, null, 2),
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🔭 x402 Observatory MCP Server running...');
}

main().catch(console.error);
