-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Main transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    
    -- Parties
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    agent_address VARCHAR(42),
    
    -- Payment details
    amount DECIMAL(38, 18) NOT NULL,
    token_address VARCHAR(42),
    token_symbol VARCHAR(20),
    
    -- x402 specific
    x402_type VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    
    -- Classification
    protocol VARCHAR(100),
    tx_type VARCHAR(50),
    
    -- Gas
    gas_used BIGINT,
    gas_price DECIMAL(38, 18),
    gas_cost_usd DECIMAL(18, 6),
    
    -- Raw data
    input_data TEXT,
    decoded_data JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_transactions_agent ON transactions(agent_address);
CREATE INDEX idx_transactions_timestamp ON transactions(block_timestamp);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_protocol ON transactions(protocol);
CREATE INDEX idx_transactions_amount ON transactions(amount);

-- Agent profiles (aggregated)
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    
    -- Stats
    total_transactions INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    failed_transactions INT DEFAULT 0,
    total_volume DECIMAL(38, 18) DEFAULT 0,
    
    -- Activity
    first_seen TIMESTAMP,
    last_active TIMESTAMP,
    
    -- Reputation (calculated)
    success_rate DECIMAL(5, 4),
    avg_gas_efficiency DECIMAL(10, 4),
    reputation_score DECIMAL(5, 2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- For semantic search
CREATE TABLE transaction_embeddings (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id),
    embedding vector(1536),
    search_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Anomalies detected
CREATE TABLE anomalies (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    related_transactions JSONB,
    detected_at TIMESTAMP DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT FALSE
);

-- Protocol registry
CREATE TABLE protocols (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contract_addresses JSONB,
    category VARCHAR(50),
    logo_url TEXT,
    website TEXT
);

-- Insert known Cronos protocols
INSERT INTO protocols (name, contract_addresses, category) VALUES
('VVS Finance', '["0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae"]', 'DEX'),
('Moonlander', '["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"]', 'Perpetuals'),
('Delphi', '["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"]', 'Prediction Markets'),
('Ferro Protocol', '["0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"]', 'Stablecoin DEX'),
('Tectonic', '["0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"]', 'Lending');
