# Coral Rush Mock Backend

A comprehensive mock backend for demonstrating Coral Rush's AI + Solana integrations at hackathons without spending real SOL.

## Features

🎯 **Voice Command Processing** - Converts voice input to actionable intents  
🤖 **Multi-Agent Orchestration** - Simulates ProposalAgent, TreasuryAgent, VotingAgent coordination  
⛓️ **Solana Integration** - Mock NFT minting, transaction status, wallet operations  
🗳️ **DAO Governance** - Proposal voting and treasury management simulation  
📊 **AI Logs & Analytics** - Session history and on-chain audit trails  
🎬 **Demo Scenarios** - Full end-to-end hackathon demo data  

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will start on `http://localhost:8080`

## API Endpoints

### Core Coral Protocol
- `POST /api/coral/connect` - Connect to Coral Protocol
- `POST /api/coral/process-voice` - Process voice input with AI agents
- `POST /api/coral/message` - Send text message for processing
- `GET /api/coral/agents/status` - Get agent status
- `GET /api/coral/agents/registry` - Get available agents

### Solana Integration
- `POST /api/solana/mint-nft` - Mint coral conservation NFTs
- `GET /api/solana/wallet/:address` - Get wallet information
- `GET /api/solana/transaction/:hash` - Check transaction status

### DAO Governance
- `GET /api/dao/treasury` - Get DAO treasury status
- `GET /api/dao/proposals` - Get governance proposals
- `POST /api/dao/proposals/:id/vote` - Vote on proposals

### AI & Analytics
- `GET /api/ai/logs` - Get AI interaction logs
- `GET /api/coral/sessions/:sessionId/history` - Get session history

### Demo & Testing
- `GET /api/demo/full-scenario` - Get complete hackathon demo scenario
- `GET /health` - Health check endpoint

## Example Usage

### Voice Processing Demo
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'voice_input.wav');
formData.append('session_id', 'demo_session_123');

const response = await fetch('http://localhost:8080/api/coral/process-voice', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// Returns: transcript, intent, multi-agent response, Solana transactions
```

### NFT Minting Demo
```javascript
const response = await fetch('http://localhost:8080/api/solana/mint-nft', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipient_wallet: 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
    quantity: 3,
    collection_id: 'coral-conservation'
  })
});

const result = await response.json();
// Returns: mint addresses, transaction signatures, explorer URLs
```

### Full Demo Scenario
```javascript
const response = await fetch('http://localhost:8080/api/demo/full-scenario');
const demoData = await response.json();

// Contains:
// - Voice command → Intent detection
// - Multi-agent orchestration results  
// - Solana NFT minting transactions
// - DAO governance voting
// - AI conversation flow
// - On-chain audit logs
```

## Mock Data Structure

The backend generates realistic mock data for:

### Voice Commands
- "Mint 3 coral NFTs for conservation"
- "Check my wallet balance and transactions"
- "Vote on proposal 42 to approve funding"
- "Show DAO treasury status"

### AI Agents
- **ProposalAgent** - Analyzes governance proposals
- **TreasuryAgent** - Manages treasury operations
- **VotingAgent** - Handles community voting
- **ExecutorAgent** - Executes blockchain transactions
- **ListenerAgent** - Processes voice/audio input

### Solana Transactions
- Realistic transaction signatures
- Devnet explorer URLs
- NFT metadata with coral conservation themes
- Transaction fees and confirmation times

### DAO Governance
- Active proposals with voting data
- Treasury balances across multiple tokens
- Community voting power and quorum tracking

## Configuration

Modify `config.js` to customize:

```javascript
mock: {
  enableRealisticDelays: true,           // Simulate processing time
  mockAgentProcessingTime: true,         // Agent response delays
  simulateNetworkLatency: true,          // Network simulation
  demoMode: true,                        // Full demo features
  autoGenerateTransactions: true         // Background activity
}
```

## Integration with Frontend

Update your frontend's API base URL to point to this mock backend:

```javascript
// In your React app
const API_BASE_URL = 'http://localhost:8080';

// Replace real Solana calls with mock endpoints
const mintNFT = async (quantity) => {
  const response = await fetch(`${API_BASE_URL}/api/solana/mint-nft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  return response.json();
};
```

## Perfect for Hackathons

✅ **No Real SOL Required** - All transactions are simulated  
✅ **Instant Responses** - No waiting for blockchain confirmations  
✅ **Rich Demo Data** - Comprehensive AI + Solana feature showcase  
✅ **Realistic UX** - Feels like real blockchain interactions  
✅ **Easy Setup** - Works out of the box for demos  

## Demo Flow Example

1. User speaks: *"Mint 3 coral NFTs for conservation"*
2. Voice → Text transcription
3. AI Intent Detection: `mint_nft`
4. Multi-Agent Orchestration:
   - ProposalAgent: ✅ Environmental impact approved
   - TreasuryAgent: ✅ Sufficient SOL available  
   - VotingAgent: ✅ Community consensus reached
5. Solana NFT Minting: 3 transactions confirmed
6. Display: Explorer links, NFT metadata, success metrics

Perfect for impressing hackathon judges with a smooth, feature-rich demo! 🚀
