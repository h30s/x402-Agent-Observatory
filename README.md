# 🔭 x402 Agent Observatory

> **The Control Tower for the Cronos Agentic Economy**

Real-time indexing, visualization, and search for all x402 agent activity on Cronos blockchain.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cronos](https://img.shields.io/badge/network-Cronos-blue)
![x402](https://img.shields.io/badge/protocol-x402-purple)

## 🌟 Features

### Core Capabilities
- **Real-Time Transaction Stream** - Live WebSocket feed of all x402 transactions
- **Natural Language Search** - Query the ecosystem using plain English
- **MCP Server for AI** - Claude and ChatGPT can directly query the observatory
- **Analytics Dashboard** - Beautiful visualizations of ecosystem health

### What Problem Does It Solve?
AI agents on Cronos using x402 operate in the dark. Developers have no way to:
- See what agents are doing across the ecosystem
- Search historical agent activity
- Query agent behavior programmatically
- Detect patterns or anomalies

**x402 Observatory provides complete visibility.**

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker (for PostgreSQL)
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/your-team/x402-observatory
cd x402-observatory

# Install dependencies
npm install

# Start database
npm run db:up

# Start API server (terminal 1)
cd packages/api && npm run dev

# Start frontend (terminal 2)
cd packages/web && npm run dev
```

Open http://localhost:3000 to view the dashboard.

## 📦 Project Structure

```
x402-observatory/
├── packages/
│   ├── api/              # Express.js REST API + WebSocket
│   ├── web/              # Next.js 14 frontend dashboard
│   └── mcp-server/       # MCP server for AI assistants
├── scripts/
│   └── init.sql          # Database schema
├── docker-compose.yml    # PostgreSQL setup
└── package.json          # Monorepo root
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/transactions` | GET | List transactions with filters |
| `/api/v1/search` | POST | Natural language search |
| `/api/v1/agents` | GET | Agent leaderboard |
| `/api/v1/agents/:address` | GET | Agent profile |
| `/api/v1/analytics/overview` | GET | 24h analytics |
| `/api/v1/analytics/health` | GET | Ecosystem health |

## 🤖 MCP Integration

The observatory exposes an MCP server that AI assistants can use to query the ecosystem.

### Available Tools

| Tool | Description |
|------|-------------|
| `query_x402_activity` | Search transactions with natural language |
| `get_agent_profile` | Get detailed agent stats |
| `get_ecosystem_health` | Check ecosystem metrics |
| `get_top_agents` | Get agent leaderboard |

### Claude Desktop Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "x402-observatory": {
      "command": "node",
      "args": ["/path/to/packages/mcp-server/dist/index.js"],
      "env": {
        "API_URL": "http://localhost:3001"
      }
    }
  }
}
```

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js, Socket.io |
| Database | PostgreSQL + pgvector |
| Frontend | Next.js 14, Tailwind CSS, Recharts |
| MCP | @modelcontextprotocol/sdk |

## 🏆 Hackathon Track

**Best Dev Tooling / Data Virtualization Layer**

This project delivers:
- ✅ Data virtualization / unified data layers
- ✅ Indexing, search and agent-readable feeds  
- ✅ MCP-compatible developer tools
- ✅ Debugging, monitoring & observability

## 📄 License

MIT License - see LICENSE file for details.

---

Built with 💜 for the Cronos x402 Paytech Hackathon
