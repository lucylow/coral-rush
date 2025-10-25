#!/bin/bash

echo "🚀 Starting Coral Rush Hackathon Demo"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is required but not installed.${NC}"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Kill existing processes on ports 8080 and 5173
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
if check_port 8080; then
    echo "Stopping process on port 8080..."
    kill $(lsof -t -i:8080) 2>/dev/null || true
fi

if check_port 5173; then
    echo "Stopping process on port 5173..."
    kill $(lsof -t -i:5173) 2>/dev/null || true
fi

sleep 2

# Setup Mock Backend
echo -e "${BLUE}📦 Setting up Mock Backend...${NC}"
cd mock-backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend environment configuration..."
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

# Start Mock Backend in background
echo -e "${GREEN}🚀 Starting Mock Backend on port 8080...${NC}"
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if check_port 8080; then
    echo -e "${GREEN}✅ Mock Backend is running at http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Failed to start Mock Backend${NC}"
    exit 1
fi

# Setup Frontend
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd ..

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Create or update .env.local for frontend
echo "Creating frontend environment configuration..."
cat > .env.local << EOL
VITE_CORAL_API_URL=http://localhost:8080
VITE_CORAL_API_KEY=mock_api_key_for_demo
VITE_DEMO_MODE=true
VITE_MOCK_BACKEND=true
EOL

# Start Frontend
echo -e "${GREEN}🌊 Starting Coral Rush Frontend on port 5173...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if frontend is running
if check_port 5173; then
    echo -e "${GREEN}✅ Frontend is running at http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Failed to start Frontend${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Coral Rush Hackathon Demo is ready!${NC}"
echo "============================================="
echo -e "${BLUE}🌐 Frontend Demo:${NC} http://localhost:5173"
echo -e "${BLUE}🤖 Mock Backend API:${NC} http://localhost:8080"
echo -e "${BLUE}📊 Health Check:${NC} http://localhost:8080/health"
echo -e "${BLUE}🎯 Full Demo Scenario:${NC} http://localhost:8080/api/demo/full-scenario"
echo ""
echo -e "${YELLOW}📝 Demo Features Available:${NC}"
echo "  • Voice Command Processing with AI Intent Detection"
echo "  • Multi-Agent Orchestration (ProposalAgent, TreasuryAgent, VotingAgent)"
echo "  • Solana NFT Minting Simulation"
echo "  • DAO Governance Integration"
echo "  • Real-time AI + Blockchain Coordination"
echo ""
echo "Navigate to the Coral Hackathon Demo page to see the full AI + Solana showcase!"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Shutting down demo servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Demo stopped successfully${NC}"
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT

# Keep script running
wait
