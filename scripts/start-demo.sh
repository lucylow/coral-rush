#!/bin/bash

# Coral Rush Multi-Agent Demo Startup Script

echo "🚀 Starting Coral Rush Multi-Agent Demo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Setup backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Install backend dependencies
echo "📥 Installing backend dependencies..."
npm install

# Check for environment file
if [ ! -f ".env" ]; then
    echo "⚙️ Creating backend .env file from template..."
    if [ -f "env.template" ]; then
        cp env.template .env
        echo "📝 Please edit backend/.env with your API keys before continuing."
        echo "   Required: SWARMS_API_KEY and SOLANA_LOGGING_KEYPAIR"
        read -p "Press Enter after you've configured the .env file..."
    else
        echo "❌ No env.template found. Please create backend/.env manually."
        exit 1
    fi
fi

# Start backend in background
echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "📦 Setting up frontend..."

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Check for frontend environment file
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating frontend .env.local file from template..."
    if [ -f "env.template" ]; then
        cp env.template .env.local
        echo "✅ Frontend environment configured"
    else
        echo "⚠️ No env.template found for frontend. Using defaults."
    fi
fi

# Wait a moment for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo "🚀 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Coral Rush Multi-Agent System is starting!"
echo ""
echo "📊 Backend: http://localhost:4000"
echo "🌐 Frontend: http://localhost:5173"
echo "📋 Health Check: http://localhost:4000/api/health"
echo ""
echo "🛠️ To stop the demo:"
echo "   Press Ctrl+C, or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to stop
wait
