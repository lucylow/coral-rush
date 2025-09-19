# 🚀 Coral Protocol Hackathon - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install Coral agent dependencies
cd coral-agent
pip install -r requirements.txt
```

### 2. Environment Setup
Create a `.env.local` file in the root directory with:
```bash
# Coral Protocol Configuration
VITE_CORAL_API_URL=http://localhost:8080
VITE_CORAL_API_KEY=your_coral_api_key_here

# LiveKit Configuration
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_LIVEKIT_API_KEY=your_livekit_api_key_here

# AI Services
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Web3 Services
VITE_CROSSMINT_API_KEY=your_crossmint_api_key_here
```

### 3. Run the Application
```bash
# Start Coral Protocol server (if available)
coral-server --port 8080

# Start Coral agent
cd coral-agent
python payment_agent.py

# Start frontend
npm run dev
```

### 4. Access the Demo
Navigate to: `http://localhost:5173/coral-hackathon`

## Demo Features

### Live Demo Tab
- Real voice-to-payment processing
- Multi-agent orchestration visualization
- Real-time performance metrics

### Agent Registry Tab
- Browse available agents
- View performance metrics
- Test agent functionality
- Copy integration code

### Integration Guide Tab
- Quick start code examples
- Available agents overview
- Business impact metrics

## Troubleshooting

### Common Issues

1. **Coral Protocol Connection Failed**
   - Ensure Coral server is running on port 8080
   - Check API key configuration
   - Verify network connectivity

2. **Voice Processing Not Working**
   - Check browser microphone permissions
   - Ensure HTTPS or localhost
   - Verify LiveKit configuration

3. **Agent Registry Empty**
   - Run agent registration from the registry tab
   - Check Coral Protocol server status
   - Verify agent endpoints

### Development Mode
The application will work in development mode even without full Coral Protocol setup:
- Mock responses for agent interactions
- Simulated voice processing
- Demo data for metrics

## Production Deployment

### Prerequisites
- Coral Protocol server
- LiveKit instance
- API keys for all services
- Domain with HTTPS

### Steps
1. Configure production environment variables
2. Deploy Coral Protocol server
3. Set up LiveKit production instance
4. Deploy frontend to hosting service
5. Configure domain and SSL

## Support

For issues or questions:
- Check the console for error messages
- Review the documentation in the demo interface
- Ensure all dependencies are installed
- Verify environment configuration
