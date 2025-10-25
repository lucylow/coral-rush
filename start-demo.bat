@echo off
echo.
echo 🚀 Starting Coral Rush Hackathon Demo
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is required but not installed.
    pause
    exit /b 1
)

echo 📦 Setting up Mock Backend...
cd mock-backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating backend environment configuration...
    echo PORT=8080> .env
    echo NODE_ENV=development>> .env
    echo CORAL_API_URL=http://localhost:8080>> .env
    echo CORAL_API_KEY=mock_api_key_for_demo>> .env
    echo SOLANA_NETWORK=devnet>> .env
    echo ENABLE_REALISTIC_DELAYS=true>> .env
    echo DEMO_MODE=true>> .env
    echo AUTO_GENERATE_TRANSACTIONS=true>> .env
)

echo.
echo 🚀 Starting Mock Backend on port 8080...
echo 📊 Health check: http://localhost:8080/health
echo 🎯 Demo endpoint: http://localhost:8080/api/demo/full-scenario
echo 🤖 Voice processing: http://localhost:8080/api/coral/process-voice
echo ⛓️ NFT minting: http://localhost:8080/api/solana/mint-nft
echo.
echo Starting backend server...
start "Coral Rush Backend" cmd /k "npm start"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

cd ..

echo.
echo 📦 Setting up Frontend...

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Create .env.local for frontend
echo Creating frontend environment configuration...
echo VITE_CORAL_API_URL=http://localhost:8080> .env.local
echo VITE_CORAL_API_KEY=mock_api_key_for_demo>> .env.local
echo VITE_DEMO_MODE=true>> .env.local
echo VITE_MOCK_BACKEND=true>> .env.local

echo.
echo 🌊 Starting Coral Rush Frontend on port 5173...
echo Starting frontend development server...
start "Coral Rush Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Coral Rush Hackathon Demo is starting!
echo ==========================================
echo.
echo 🌐 Frontend Demo: http://localhost:5173
echo 🤖 Mock Backend API: http://localhost:8080
echo 📊 Health Check: http://localhost:8080/health
echo 🎯 Full Demo Scenario: http://localhost:8080/api/demo/full-scenario
echo.
echo 📝 Demo Features Available:
echo   • Voice Command Processing with AI Intent Detection
echo   • Multi-Agent Orchestration (ProposalAgent, TreasuryAgent, VotingAgent)
echo   • Solana NFT Minting Simulation
echo   • DAO Governance Integration
echo   • Real-time AI + Blockchain Coordination
echo.
echo Navigate to http://localhost:5173 and find the Hackathon Demo page!
echo.
echo Two terminal windows will open - keep both running during your demo.
echo Close the terminal windows when you're done with the demo.
echo.
pause
