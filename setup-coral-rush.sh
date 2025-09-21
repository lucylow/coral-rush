#!/bin/bash

# RUSH Coral Protocol Setup Script
# Sets up the complete Coral Protocol integration for the Internet of Agents Hackathon

echo "🌊 Setting up RUSH Coral Protocol Integration"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p coral_agents
mkdir -p src/coral
mkdir -p src/components/coral

# Install Python dependencies for Coral agents
echo "🐍 Setting up Python environment for Coral agents..."
if command -v python3 &> /dev/null; then
    python3 -m venv coral_env
    source coral_env/bin/activate
    
    # Install required Python packages
    pip install asyncio python-dotenv
    
    echo "✅ Python environment created"
else
    echo "⚠️ Python3 not found. Please install Python 3.8+ to run Coral agents"
fi

# Install additional Node.js dependencies
echo "📦 Installing additional dependencies..."
npm install framer-motion

# Create environment configuration
echo "⚙️ Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp coral-config.env .env
    echo "✅ Created .env file from coral-config.env"
    echo "📝 Please update .env with your actual API keys"
else
    echo "⚠️ .env file already exists. Please manually add Coral Protocol variables"
fi

# Create Coral agent startup script
echo "🚀 Creating Coral agent startup script..."
cat > start-coral-agents.sh << 'EOF'
#!/bin/bash

# Start all RUSH Coral agents
echo "🌊 Starting RUSH Coral Protocol Agents"
echo "======================================"

# Activate Python environment
if [ -d "coral_env" ]; then
    source coral_env/bin/activate
fi

# Start agents in background
echo "🎤 Starting Voice Listener Agent..."
python3 coral_agents/rush_voice_listener_agent.py &
VOICE_PID=$!

echo "🧠 Starting Brain Agent..."
python3 coral_agents/rush_brain_agent.py &
BRAIN_PID=$!

echo "🔧 Starting Coraliser Integration..."
python3 coral_agents/coraliser_integration.py &
CORALISER_PID=$!

echo "✅ All Coral agents started"
echo "Voice Listener PID: $VOICE_PID"
echo "Brain Agent PID: $BRAIN_PID"
echo "Coraliser PID: $CORALISER_PID"

# Wait for user input to stop
echo "Press Enter to stop all agents..."
read

# Kill all agents
kill $VOICE_PID $BRAIN_PID $CORALISER_PID 2>/dev/null
echo "🛑 All agents stopped"
EOF

chmod +x start-coral-agents.sh

# Create Coral Protocol demo script
echo "🎭 Creating Coral Protocol demo script..."
cat > coral-demo.sh << 'EOF'
#!/bin/bash

# Coral Protocol Demo Script
echo "🌊 Coral Protocol Demo for RUSH"
echo "==============================="

echo "1. Starting Coral agents..."
./start-coral-agents.sh &

echo "2. Starting RUSH frontend..."
npm run dev &

echo "3. Opening Coral Protocol dashboard..."
sleep 5
echo "✅ Demo ready! Visit http://localhost:5173 and navigate to the Coral Protocol tab"

echo "Press Ctrl+C to stop the demo"
wait
EOF

chmod +x coral-demo.sh

# Create README for Coral integration
echo "📚 Creating Coral integration documentation..."
cat > CORAL_INTEGRATION_README.md << 'EOF'
# 🌊 RUSH Coral Protocol Integration

This directory contains the complete Coral Protocol integration for RUSH, demonstrating advanced multi-agent coordination, registry monetization, and MCP-native architecture.

## 🚀 Quick Start

1. **Setup Environment**
   ```bash
   ./setup-coral-rush.sh
   ```

2. **Configure API Keys**
   - Copy `coral-config.env` to `.env`
   - Add your actual API keys

3. **Start Coral Agents**
   ```bash
   ./start-coral-agents.sh
   ```

4. **Run Demo**
   ```bash
   ./coral-demo.sh
   ```

## 📁 Directory Structure

```
coral_agents/
├── rush_voice_listener_agent.py    # Voice processing agent
├── rush_brain_agent.py             # AI reasoning agent
└── coraliser_integration.py        # Automatic agent generation

src/coral/
├── CoralServerClient.ts            # MCP client integration
├── CoralRegistry.ts                # Registry monetization
└── ThreadManager.ts                # Thread-based coordination

src/components/coral/
├── CoralOrchestrationDashboard.tsx # Live orchestration UI
├── CoralRegistryShowcase.tsx       # Registry marketplace
└── CoralWorkflowVisualizer.tsx     # Workflow visualization
```

## 🌟 Key Features

### 1. MCP-Native Architecture
- True Coral Protocol v1 integration
- Standardized agent communication
- Cross-framework compatibility

### 2. Agent Registry & Monetization
- Real revenue generation through agent rental
- Live marketplace with pricing
- Developer earnings tracking

### 3. Thread-Based Orchestration
- Structured multi-agent coordination
- Real-time workflow visualization
- Error handling and recovery

### 4. Coraliser Integration
- Automatic agent generation from MCP tools
- Seamless tool-to-agent conversion
- Registry registration automation

## 🎯 Coral Protocol Value Propositions

1. **Zero-trust agent orchestration** - Agents work together without trusting each other
2. **Cross-framework compatibility** - LangChain, AutoGen, and other frameworks
3. **Monetizable agent rental** - Real revenue generation model
4. **Decentralized agent discovery** - Registry-based agent marketplace
5. **Automatic payouts** - Solana-based compensation system

## 🔧 Configuration

### Environment Variables
```bash
# Coral Protocol
VITE_CORAL_SSE_URL=http://localhost:5555/devmode/rushApp/privkey/session1/sse
VITE_CORAL_AGENT_ID=rush-voice-first-agent
VITE_CORAL_API_KEY=your_coral_api_key
VITE_CORAL_REGISTRY_URL=https://registry.coralprotocol.org
VITE_CORAL_DEVELOPER_ID=rush-team

# AI Services
VITE_OPENAI_API_KEY=your_openai_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_MISTRAL_API_KEY=your_mistral_key
```

## 🎭 Demo Features

- **Live Agent Coordination** - Watch agents work together in real-time
- **Registry Marketplace** - Browse and rent available agents
- **Revenue Dashboard** - Track earnings and performance metrics
- **Thread Visualization** - See multi-agent conversations
- **Coraliser Magic** - Watch tools become Coral agents automatically

## 🏆 Hackathon Submission

This implementation demonstrates RUSH as the **definitive example** of what's possible with Coral Protocol v1:

- ✅ Real Coral Server MCP integration
- ✅ Agent registry with pricing and metadata
- ✅ Thread-based multi-agent coordination
- ✅ Revenue metrics and payout demonstration
- ✅ Coraliser integration showing tool conversion
- ✅ Live agent discovery and rental capability
- ✅ Professional dashboard showing Coral ecosystem value

## 📞 Support

For questions about the Coral Protocol integration:
- Check the [Coral Protocol Documentation](https://docs.coralprotocol.org)
- Review the agent implementations in `coral_agents/`
- Examine the UI components in `src/components/coral/`

---

**Built for the Internet of Agents Hackathon** 🚀
EOF

echo ""
echo "✅ Coral Protocol integration setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your API keys"
echo "2. Run: ./start-coral-agents.sh"
echo "3. Run: ./coral-demo.sh"
echo "4. Visit http://localhost:5173 and check the Coral Protocol tab"
echo ""
echo "📚 Documentation: CORAL_INTEGRATION_README.md"
echo "🎭 Demo: ./coral-demo.sh"
echo ""
echo "🌊 Welcome to the future of multi-agent AI with Coral Protocol!"
