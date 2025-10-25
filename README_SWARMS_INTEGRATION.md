# Coral Rush - Multi-Agent System Integration

This document describes the integration of Swarms multi-agent orchestration into Coral Rush, transforming it from a single-agent system into a powerful distributed AI platform with on-chain logging to Solana.

## 🌟 Overview

Coral Rush now features:

- **Multi-Agent Orchestration**: Research, Summarizer, and Decision agents working in parallel
- **Swarms API Integration**: Professional-grade AI agent orchestration platform
- **On-Chain Logging**: Transparent decision tracking on Solana blockchain
- **Fallback Systems**: Mock mode for development and API resilience
- **Modern UI**: Beautiful React interface showing real-time agent outputs

## 🏗️ Architecture

```
Frontend (React) → Backend (Express) → Swarms API → Solana Blockchain
     ↓                   ↓               ↓              ↓
Voice/Text Input → Multi-Agent Flow → Agent Outputs → On-Chain Log
```

### Agent Flow

1. **Research Agent**: Analyzes and gathers data about the user query
2. **Summarizer Agent**: Creates actionable summaries from research
3. **Decision Agent**: Provides recommendations based on combined analysis
4. **On-Chain Logger**: Records decision summary to Solana via Memo instruction

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start
```

### 2. Frontend Setup

```bash
# In project root
npm install
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

### 3. Environment Configuration

#### Backend (.env)
```env
# Required for Swarms Integration
SWARMS_API_URL=https://api.swarms.ai
SWARMS_API_KEY=sk_test_YOUR_KEY_HERE

# Required for Solana Logging
SOLANA_LOGGING_KEYPAIR=your_keypair_here
SOLANA_RPC_URL=https://api.devnet.solana.com
```

#### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:4000
```

## 🔑 Solana Keypair Setup

Generate a keypair for logging (devnet testing):

```bash
# Install Solana CLI
solana-keygen new --no-bip39-passphrase --silent --outfile keypair.json

# Get the private key (copy this to SOLANA_LOGGING_KEYPAIR)
cat keypair.json

# Get some devnet SOL for transactions
solana airdrop 1 $(solana-keygen pubkey keypair.json) --url devnet
```

## 🤖 Swarms Credits Integration

### Why We Use Swarms

- **Professional Multi-Agent Orchestration**: Advanced agent coordination and communication
- **Scalable Infrastructure**: Handle multiple concurrent agent workflows
- **Advanced AI Models**: Access to state-of-the-art language models
- **Production Ready**: Enterprise-grade reliability and monitoring

### Expected Usage

- **Throughput**: 100+ agent calls per day during development
- **Concurrency**: 3-5 agents per request, 2-3 simultaneous users
- **Use Cases**: 
  - Web3 research and analysis
  - DeFi opportunity assessment  
  - Risk evaluation for crypto investments
  - NFT market trend analysis

### Requesting Swarms Credits

When applying for Swarms credits, include:

1. **Repository Link**: `https://github.com/your-org/coral-rush`
2. **Integration Type**: Multi-agent orchestration with research → summary → decision flow
3. **Expected Volume**: 10,000+ tokens/month for agent coordination
4. **Business Use Case**: Web3 AI assistant with blockchain audit trail
5. **Demo Video**: Show the multi-agent workflow in action

## 📝 API Endpoints

### POST `/api/ai/execute`
Execute multi-agent workflow

**Request:**
```json
{
  "command": "Analyze DeFi yield farming opportunities",
  "userWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "useOnChainLog": true
}
```

**Response:**
```json
{
  "success": true,
  "agents": {
    "research": {
      "role": "Research Agent",
      "output": "Current DeFi yields range from 5-15% APY...",
      "metadata": {
        "tokens_used": 245,
        "processing_time": 1200
      }
    },
    "summarizer": {...},
    "voting": {...}
  },
  "decision": "RECOMMENDATION: Moderate allocation to blue-chip DeFi protocols...",
  "txSignature": "4xJ8s9Kq...",
  "explorerUrl": "https://explorer.solana.com/tx/4xJ8s9Kq...?cluster=devnet"
}
```

### GET `/api/health`
Check system status

**Response:**
```json
{
  "status": "healthy",
  "swarms_configured": true,
  "solana_configured": true,
  "version": "1.0.0"
}
```

## 🎯 Mock Mode for Development

When `SWARMS_API_KEY` is not set, the system automatically uses mock responses:

```javascript
// Automatically enabled in development
const MOCK_RESPONSES = {
  research: "Based on current market analysis, the requested action involves...",
  summarizer: "Summary: Moderate risk opportunity with positive potential...",
  voting: "RECOMMENDATION: APPROVE with conditions..."
};
```

This allows full development and testing without Swarms credits.

## 🧪 Testing

### Test Multi-Agent Workflow
```bash
# Start backend
cd backend && npm start

# Test endpoint
curl -X POST http://localhost:4000/api/ai/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"Test multi-agent system"}'
```

### Test Solana Integration
The system will automatically log decisions to Solana devnet. Check transactions at:
`https://explorer.solana.com/address/YOUR_KEYPAIR_ADDRESS?cluster=devnet`

## 🎨 Frontend Integration

Import and use the VoiceAgent component:

```tsx
import VoiceAgent from '@/components/VoiceAgent';

function App() {
  return (
    <div>
      <VoiceAgent />
    </div>
  );
}
```

The component provides:
- Multi-agent command input
- Real-time processing status
- Individual agent output display
- Solana transaction links
- Error handling and fallbacks

## 🔄 Integration with Existing Coral Rush

The multi-agent system integrates seamlessly with existing Coral Rush features:

1. **Wallet Integration**: Uses existing Solana wallet adapters
2. **UI Components**: Built with existing shadcn/ui components
3. **State Management**: Compatible with existing Zustand stores
4. **Routing**: Can be added to existing React Router setup

## 🚨 Security Considerations

- **API Keys**: Never commit keys to git, use environment variables
- **Solana Keypair**: Use dedicated logging keypair with minimal SOL
- **Rate Limiting**: Implement rate limiting for production usage
- **Input Validation**: Sanitize user inputs before processing
- **Error Handling**: Graceful fallbacks prevent system crashes

## 📊 Monitoring & Analytics

Track system performance:
- Agent response times
- Swarms API usage and costs  
- Solana transaction success rates
- User engagement with multi-agent features

## 🎪 Demo Script for Pharos Submission

### What to Show

1. **Multi-Agent Coordination**: 
   - Input: "Analyze the risks of the new Solana DeFi protocol XYZ"
   - Show: Research agent gathering data → Summarizer creating insights → Decision agent making recommendation

2. **On-Chain Transparency**:
   - Show: Solana transaction link with decision hash
   - Explain: Audit trail for AI decision-making

3. **Swarms Integration**:
   - Show: Code demonstrating Swarms API calls
   - Explain: How credits enable professional-grade multi-agent orchestration

4. **Production Readiness**:
   - Show: Fallback systems, error handling, scalable architecture
   - Explain: Ready for high-throughput usage with Swarms credits

### Key Talking Points

- **Innovation**: First Web3 AI assistant with multi-agent blockchain audit trail
- **Scalability**: Swarms enables handling many concurrent users with complex agent workflows  
- **Transparency**: On-chain logging provides unprecedented AI decision auditability
- **User Experience**: Beautiful real-time UI showing agent coordination in action

## 🔗 Useful Links

- [Swarms Documentation](https://docs.swarms.ai)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [SPL Memo Program](https://spl.solana.com/memo)
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)

---

Built with ❤️ for the future of decentralized AI
