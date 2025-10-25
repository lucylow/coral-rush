#!/bin/bash

echo "🚀 Starting Coral Rush Hackathon Demo Backend..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment configuration..."
    cat > .env << EOL
PORT=8080
NODE_ENV=development
CORAL_API_URL=http://localhost:8080
CORAL_API_KEY=mock_api_key_for_demo
SOLANA_NETWORK=devnet
ENABLE_REALISTIC_DELAYS=true
DEMO_MODE=true
AUTO_GENERATE_TRANSACTIONS=true
EOL
fi

echo "🌊 Starting Coral Rush Mock Backend..."
echo "📊 Health check will be available at: http://localhost:8080/health"
echo "🎯 Demo endpoint: http://localhost:8080/api/demo/full-scenario"
echo "🤖 Voice processing: http://localhost:8080/api/coral/process-voice"
echo "⛓️ NFT minting: http://localhost:8080/api/solana/mint-nft"
echo ""
echo "✨ Ready for hackathon demo! Press Ctrl+C to stop."
echo "=================================================="

# Start the server
npm start
