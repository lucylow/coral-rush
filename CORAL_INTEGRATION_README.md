# Coral Protocol Integration Guide

This guide explains how to integrate your project with the real Coral Protocol like the [Coral-VoiceInterface-Agent repository](https://github.com/Coral-Protocol/Coral-VoiceInterface-Agent).

## 🚀 What's Been Added

### 1. Real Coral Protocol Backend (`coral-agent/`)
- **LiveKit Agents Framework**: Real-time voice interface using LiveKit
- **MCP Integration**: Model Context Protocol for agent communication
- **Voice Processing**: STT/TTS capabilities with ElevenLabs
- **Agent Orchestration**: Multi-agent coordination through Coral Protocol

### 2. Frontend Integration (`src/components/coral/`)
- **RealCoralOrchestrator**: Real voice interface component
- **LiveKit React SDK**: Voice capture and playback
- **Real-time Agent Status**: Live updates from Coral Protocol
- **Voice Interaction**: Microphone access and audio processing

### 3. API Integration (`supabase/functions/coral-protocol/`)
- **Supabase Edge Functions**: Backend API for Coral Protocol
- **Session Management**: Track voice interactions
- **Agent Status**: Real-time agent monitoring
- **Audio Processing**: Handle voice input/output

## 🔧 Setup Instructions

### Prerequisites
1. **Coral Server**: Install and run Coral Protocol server
2. **LiveKit**: Set up LiveKit server for voice processing
3. **API Keys**: Get required API keys (see Environment Variables)

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install @livekit/components-react @livekit/react-sdk livekit-client

# Install Coral agent dependencies
cd coral-agent
pip install -r requirements.txt
```

### 2. Environment Configuration

Create `.env` files with the following variables:

**Frontend (.env.local):**
```bash
VITE_CORAL_API_URL=http://localhost:8080
VITE_CORAL_API_KEY=your_coral_api_key
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_LIVEKIT_API_KEY=your_livekit_api_key
```

**Coral Agent (coral-agent/.env):**
```bash
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
OPENAI_API_KEY=your_openai_api_key
CORAL_SERVER_URL=http://localhost:8080
CORAL_API_KEY=your_coral_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

**Supabase Functions:**
```bash
CORAL_API_KEY=your_coral_api_key
CORAL_SERVER_URL=http://localhost:8080
```

### 3. Start Coral Protocol Server

```bash
# Clone and run Coral Protocol server
git clone https://github.com/Coral-Protocol/Coral-VoiceInterface-Agent.git
cd Coral-VoiceInterface-Agent
cp .env.example .env
# Edit .env with your credentials
uv sync
uv run python main.py console
```

### 4. Start Your Application

```bash
# Terminal 1: Start Coral Agent
cd coral-agent
python main.py

# Terminal 2: Start Supabase Functions
supabase functions serve coral-protocol

# Terminal 3: Start Frontend
npm run dev
```

## 🎯 How It Works

### Voice Interaction Flow
1. **User speaks** → Microphone captures audio
2. **Audio sent** → Coral Protocol backend processes via LiveKit
3. **STT Processing** → Speech-to-text conversion
4. **Intent Analysis** → Coral Protocol AI analyzes intent
5. **Agent Routing** → Routes to appropriate specialized agent
6. **Action Execution** → Executes Web3 operations
7. **TTS Response** → Generates voice response
8. **User hears** → Real-time voice feedback

### Agent Coordination
- **Listener Agent**: Handles STT/TTS with LiveKit
- **Brain Agent**: Processes intent with Coral Protocol AI
- **Executor Agent**: Executes blockchain operations

## 🔗 Key Differences from Mock Version

| Feature | Mock Version | Real Coral Integration |
|---------|-------------|----------------------|
| Voice Input | ❌ No microphone | ✅ Real microphone access |
| STT/TTS | ❌ Simulated | ✅ LiveKit + ElevenLabs |
| Agent Communication | ❌ Mock delays | ✅ Real Coral Protocol |
| Session Management | ❌ Local state | ✅ Supabase persistence |
| Real-time Updates | ❌ Simulated | ✅ Live agent status |
| Audio Processing | ❌ None | ✅ Actual audio handling |

## 🛠️ Development Mode

For development without full Coral Protocol setup:

```bash
# The RealCoralOrchestrator component will:
# 1. Show "Disconnected" status
# 2. Use mock responses
# 3. Still demonstrate the UI flow
# 4. Allow testing of frontend components
```

## 📊 Monitoring & Debugging

### Agent Status Monitoring
- Real-time agent status updates
- Session tracking in Supabase
- Voice interaction logs
- Performance metrics

### Debug Tools
- Browser console logs
- Supabase function logs
- Coral agent logs
- LiveKit room monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Ensure HTTPS or localhost
   - Check browser permissions
   - Verify microphone is working

2. **Coral Protocol Connection Failed**
   - Check Coral server is running
   - Verify API keys
   - Check network connectivity

3. **LiveKit Connection Issues**
   - Verify LiveKit server URL
   - Check API key/secret
   - Ensure WebSocket connectivity

### Debug Commands

```bash
# Check Coral agent status
curl http://localhost:8080/api/coral/agents/status

# Test voice processing
curl -X POST http://localhost:8080/api/coral/process-voice \
  -F "audio=@test.wav" \
  -F "session_id=test_session"

# Check Supabase functions
supabase functions logs coral-protocol
```

## 🎉 Next Steps

1. **Deploy Coral Server**: Set up production Coral Protocol server
2. **Configure LiveKit**: Set up production LiveKit instance
3. **Add More Agents**: Extend with additional specialized agents
4. **Voice Training**: Customize voice responses for your use case
5. **Analytics**: Add detailed interaction analytics

## 📚 Resources

- [Coral Protocol Documentation](https://coral-protocol.com/docs)
- [LiveKit Agents Guide](https://docs.livekit.io/agents/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Original Coral-VoiceInterface-Agent](https://github.com/Coral-Protocol/Coral-VoiceInterface-Agent)

---

**Your project now has real Coral Protocol integration!** 🎊

The voice interface will work with actual microphone input, real-time agent coordination, and live voice responses through Coral Protocol and LiveKit.

