import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
    return pool.query(text, params);
}

export async function saveTransaction(tx: any) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into transactions
        const queryText = `
            INSERT INTO transactions (
                tx_hash, block_number, block_timestamp, 
                from_address, to_address, agent_address,
                amount, token, token_symbol,
                status, gas_used, gas_price,
                input_data, x402_type, protocol
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            ) 
            ON CONFLICT (tx_hash) DO NOTHING
            RETURNING id;
        `;

        const values = [
            tx.hash, tx.blockNumber, tx.timestamp,
            tx.from, tx.to, tx.from, // Assuming agent is sender
            tx.value, null, 'CRO', // Defaulting to native CRO for simplicity
            tx.status === 1 ? 'success' : 'failed',
            tx.gasUsed, tx.gasPrice,
            tx.data,
            'payment', // Default x402 type
            'Unknown' // Default protocol
        ];

        const res = await client.query(queryText, values);

        if (res.rows.length > 0) {
            const txId = res.rows[0].id;
            // We would generate embeddings here, but let's do it in a separate process or function
        }

        // Upsert Agent Stats
        await client.query(`
            INSERT INTO agents (address, first_seen, last_active)
            VALUES ($1, $2, $2)
            ON CONFLICT (address) DO UPDATE 
            SET last_active = $2,
                total_transactions = agents.total_transactions + 1,
                successful_transactions = agents.successful_transactions + (CASE WHEN $3 = 'success' THEN 1 ELSE 0 END),
                failed_transactions = agents.failed_transactions + (CASE WHEN $3 = 'failed' THEN 1 ELSE 0 END),
                total_volume = agents.total_volume + $4
        `, [tx.from, tx.timestamp, tx.status === 1 ? 'success' : 'failed', tx.value]);

        await client.query('COMMIT');
        return res.rows[0]?.id;
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error saving transaction', e);
        throw e;
    } finally {
        client.release();
    }
}

export async function saveEmbedding(txId: number, embedding: number[], text: string) {
    await query(
        `INSERT INTO transaction_embeddings (transaction_id, embedding, search_text) VALUES ($1, $2, $3)`,
        [txId, JSON.stringify(embedding), text]
    );
}
