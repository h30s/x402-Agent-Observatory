import { ethers } from 'ethers';
import OpenAI from 'openai';
import 'dotenv/config';
import { saveTransaction, saveEmbedding } from './db';

const RPC_URL = process.env.CRONOS_RPC_URL || 'https://evm.cronos.org';
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Initialize OpenAI only if key is present
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function generateEmbedding(text: string) {
    if (!openai) return null;
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
    }
}

async function processBlock(blockNumber: number) {
    try {
        const block = await provider.getBlock(blockNumber, true);
        if (!block) return;

        console.log(`Processing block ${blockNumber} with ${block.prefetchedTransactions.length} txs`);

        for (const tx of block.prefetchedTransactions) {
            // In a real scenario, we filters for x402 specific txs
            // For now, index everything to show activity

            const receipt = await provider.getTransactionReceipt(tx.hash);
            if (!receipt) continue;

            const txData = {
                hash: tx.hash,
                blockNumber: block.number,
                timestamp: new Date(block.timestamp * 1000), // Convert to JS Date
                from: tx.from,
                to: tx.to || '',
                value: ethers.formatEther(tx.value),
                data: tx.data,
                status: receipt.status, // 1 = success, 0 = fail
                gasUsed: receipt.gasUsed.toString(),
                gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
            };

            const txId = await saveTransaction(txData);

            // Generate Embedding for Search
            if (txId && openai) {
                const searchText = `Transaction ${tx.hash} from ${tx.from} to ${tx.to} value ${txData.value} CRO status ${txData.status === 1 ? 'success' : 'failed'}. Type: payment.`;
                const embedding = await generateEmbedding(searchText);
                if (embedding) {
                    await saveEmbedding(txId, embedding, searchText);
                }
            }
        }
    } catch (error) {
        console.error(`Error processing block ${blockNumber}:`, error);
    }
}

async function main() {
    console.log(`🚀 x402 Indexer starting... Connected to ${RPC_URL}`);

    let lastBlock = await provider.getBlockNumber();

    // Polling loop
    while (true) {
        try {
            const currentBlock = await provider.getBlockNumber();

            if (currentBlock > lastBlock) {
                for (let i = lastBlock + 1; i <= currentBlock; i++) {
                    await processBlock(i);
                }
                lastBlock = currentBlock;
            }

            // Wait 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('Error in main loop:', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

main().catch(console.error);
