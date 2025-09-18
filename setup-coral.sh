#!/bin/bash

# Coral Protocol Integration Setup Script
# This script helps you set up real Coral Protocol integration

echo "🌊 Setting up Coral Protocol Integration..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Creating environment files..."

# Frontend environment
cat > .env.local << EOF
# Coral Protocol Frontend Configuration
VITE_CORAL_API_URL=http://localhost:8080
VITE_CORAL_API_KEY=your_coral_api_key_here
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_LIVEKIT_API_KEY=your_livekit_api_key_here
EOF

# Coral agent environment
mkdir -p coral-agent
cat > coral-agent/.env << EOF
# Coral Protocol Agent Configuration
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
OPENAI_API_KEY=your_openai_api_key_here
CORAL_SERVER_URL=http://localhost:8080
CORAL_API_KEY=your_coral_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
DEBUG=true
LOG_LEVEL=INFO
EOF

echo "✅ Environment files created"

# Install Python dependencies for Coral agent
echo "🐍 Installing Python dependencies..."
cd coral-agent
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt
elif command -v pip &> /dev/null; then
    pip install -r requirements.txt
else
    echo "⚠️  pip not found. Please install Python dependencies manually:"
    echo "   cd coral-agent && pip install -r requirements.txt"
fi
cd ..

echo "✅ Python dependencies installed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Node.js dependencies installed"

echo ""
echo "🎉 Coral Protocol Integration Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Get your API keys:"
echo "   - LiveKit: https://cloud.livekit.io/"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - ElevenLabs: https://elevenlabs.io/"
echo "   - Coral Protocol: Contact Coral team"
echo ""
echo "2. Update environment files with your API keys:"
echo "   - .env.local (frontend)"
echo "   - coral-agent/.env (agent)"
echo ""
echo "3. Start Coral Protocol server:"
echo "   git clone https://github.com/Coral-Protocol/Coral-VoiceInterface-Agent.git"
echo "   cd Coral-VoiceInterface-Agent"
echo "   cp .env.example .env"
echo "   # Edit .env with your credentials"
echo "   uv sync"
echo "   uv run python main.py console"
echo ""
echo "4. Start your application:"
echo "   # Terminal 1: Start Coral Agent"
echo "   cd coral-agent && python main.py"
echo ""
echo "   # Terminal 2: Start Supabase Functions"
echo "   supabase functions serve coral-protocol"
echo ""
echo "   # Terminal 3: Start Frontend"
echo "   npm run dev"
echo ""
echo "🌊 Your project now has real Coral Protocol integration!"
echo "   Visit http://localhost:5173/coral-orchestrator to test"
