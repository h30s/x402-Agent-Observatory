const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Transaction {
    id: string;
    hash: string;
    blockNumber: number;
    timestamp: string;
    agent: string;
    from: string;
    to: string;
    amount: string;
    token: string;
    tokenAddress: string;
    protocol: string;
    protocolCategory: string;
    type: string;
    x402Type: string;
    status: 'success' | 'failed';
    errorMessage: string | null;
    gasUsed: number;
    gasPrice: string;
    gasCostUsd: string;
}

export interface Agent {
    address: string;
    totalTransactions: number;
    successfulTransactions?: number;
    failedTransactions?: number;
    successRate: string;
    totalVolume: string;
    firstSeen?: string;
    lastActive: string;
    favoriteProtocols?: string[];
    reputationScore: string;
}

export interface Analytics {
    volume24h: string;
    transactions24h: number;
    uniqueAgents24h: number;
    successRate24h: string;
    topProtocols: { name: string; volume: string }[];
    hourlyVolume: { hour: string; volume: number; count: number }[];
}

export interface SearchResult {
    results: Transaction[];
    interpretation: string;
    totalMatches: number;
}

// Fetch transactions
export async function fetchTransactions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    agent?: string;
    protocol?: string;
}) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.agent) searchParams.set('agent', params.agent);
    if (params?.protocol) searchParams.set('protocol', params.protocol);

    const res = await fetch(`${API_URL}/api/v1/transactions?${searchParams}`);
    return res.json();
}

// Fetch analytics
export async function fetchAnalytics(): Promise<Analytics> {
    const res = await fetch(`${API_URL}/api/v1/analytics/overview`);
    return res.json();
}

// Fetch ecosystem health
export async function fetchEcosystemHealth() {
    const res = await fetch(`${API_URL}/api/v1/analytics/health`);
    return res.json();
}

// Fetch agents
export async function fetchAgents(): Promise<{ data: Agent[]; total: number }> {
    const res = await fetch(`${API_URL}/api/v1/agents`);
    return res.json();
}

// Fetch agent profile
export async function fetchAgentProfile(address: string): Promise<Agent | null> {
    const res = await fetch(`${API_URL}/api/v1/agents/${address}`);
    if (!res.ok) return null;
    return res.json();
}

// Search transactions
export async function searchTransactions(query: string, limit?: number): Promise<SearchResult> {
    const res = await fetch(`${API_URL}/api/v1/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: limit || 20 }),
    });
    return res.json();
}

// Format address for display
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format amount
export function formatAmount(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
}

// Format timestamp
export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}
