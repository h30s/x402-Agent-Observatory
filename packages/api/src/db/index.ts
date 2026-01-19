import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Helper to execute queries
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows;
}

// Helper to get single result
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const result = await pool.query(text, params);
    return result.rows[0] || null;
}
