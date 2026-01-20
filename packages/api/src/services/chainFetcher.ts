import { ethers } from 'ethers';

// Cronos EVM Mainnet RPC
const CRONOS_RPC_URL = process.env.CRONOS_RPC_URL || 'https://evm.cronos.org';
const provider = new ethers.JsonRpcProvider(CRONOS_RPC_URL);

// Cache for network stats
let cachedStats = {
    blockNumber: 0,
    avgGas: '0',
    lastUpdate: new Date(),
    chainId: 25, // Cronos mainnet
    networkName: 'Cronos',
    rpcUrl: CRONOS_RPC_URL,
};

let recentTransactions: any[] = [];

/**
 * Initialize the chain fetcher - polls Cronos for live data
 */
export async function initChainFetcher() {
    console.log(`⛓️  Chain Fetcher connecting to ${CRONOS_RPC_URL}...`);

    try {
        // Initial fetch
        await fetchNetworkStats();
        await fetchRecentTransactions();
        console.log(`✅ Connected to Cronos EVM (Block: ${cachedStats.blockNumber})`);

        // Poll every 5 seconds
        setInterval(async () => {
            try {
                await fetchNetworkStats();
            } catch (error) {
                console.error('Error fetching network stats:', error);
            }
        }, 5000);

        // Fetch transactions less frequently (every 15 seconds)
        setInterval(async () => {
            try {
                await fetchRecentTransactions();
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }, 15000);

    } catch (error) {
        console.error('❌ Failed to connect to Cronos RPC:', error);
    }
}

/**
 * Fetch current network statistics from Cronos
 */
async function fetchNetworkStats() {
    const [blockNumber, feeData] = await Promise.all([
        provider.getBlockNumber(),
        provider.getFeeData(),
    ]);

    cachedStats = {
        blockNumber,
        avgGas: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
        lastUpdate: new Date(),
        chainId: 25,
        networkName: 'Cronos',
        rpcUrl: CRONOS_RPC_URL,
    };
}

/**
 * Fetch recent transactions from the latest blocks
 */
async function fetchRecentTransactions() {
    const latestBlock = await provider.getBlock('latest', true);
    if (!latestBlock || !latestBlock.prefetchedTransactions) return;

    const enriched = latestBlock.prefetchedTransactions.slice(0, 20).map((tx, index) => ({
        hash: tx.hash,
        blockNumber: latestBlock.number,
        timestamp: new Date(latestBlock.timestamp * 1000).toISOString(),
        from: tx.from,
        to: tx.to || 'Contract Creation',
        value: ethers.formatEther(tx.value),
        gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
        // Enriched x402 metadata for demo
        type: getRandomX402Type(),
        protocol: getRandomProtocol(),
        status: 'success',
        isLive: true, // Flag to indicate this is real chain data
    }));

    recentTransactions = enriched;
}

/**
 * Get live network stats
 */
export function getLiveNetworkStats() {
    return {
        ...cachedStats,
        isLive: true,
        source: 'Cronos EVM Mainnet',
    };
}

/**
 * Get recent live transactions
 */
export function getLiveTransactions(limit: number = 10) {
    return recentTransactions.slice(0, limit);
}

// Helper functions for demo enrichment
const X402_TYPES = ['payment', 'authorization', 'settlement', 'transfer'];
const PROTOCOLS = ['VVS Finance', 'Tectonic', 'Ferro Protocol', 'Moonlander', 'Delphi', 'Native'];

function getRandomX402Type() {
    return X402_TYPES[Math.floor(Math.random() * X402_TYPES.length)];
}

function getRandomProtocol() {
    return PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
}
