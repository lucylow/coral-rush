# AI API Integration for Coral Protocol

This document explains how the AI APIs are integrated into the RUSH Payment Agent's LiveDemo component.

## 🌊 Coral Protocol AI Agents

The LiveDemo component now includes four AI-powered agents that work together to process cross-border payments:

### 1. Voice Listener Agent (OpenAI GPT-4)
- **Purpose**: Processes natural language voice commands
- **API**: OpenAI GPT-4
- **Function**: `processVoiceCommand()`
- **Input**: Voice command text (e.g., "Send $10,000 to Philippines")
- **Output**: Structured JSON with amount, destination, currency, confidence score

### 2. Intent Analysis Agent (Claude 3 Sonnet)
- **Purpose**: Analyzes payment intent and risk assessment
- **API**: Anthropic Claude 3 Sonnet
- **Function**: `analyzeIntent()`
- **Input**: Voice command data
- **Output**: Risk score, routing preference, compliance flags, recommended actions

### 3. Fraud Detection Agent (OpenAI GPT-4)
- **Purpose**: Detects fraudulent payment patterns
- **API**: OpenAI GPT-4
- **Function**: `detectFraud()`
- **Input**: Intent analysis + voice data
- **Output**: Fraud score, risk factors, approval recommendation, confidence level

### 4. Payment Processor Agent (RUSH API)
- **Purpose**: Executes the actual payment transaction
- **API**: RUSH Payment API
- **Function**: `processPayment()`
- **Input**: Fraud analysis + intent data + voice data
- **Output**: Payment result with latency metrics

## 🔧 Configuration

### Environment Variables
Create a `.env` file in your project root with:

```bash
# OpenAI API Key for voice processing and fraud detection
REACT_APP_OPENAI_API_KEY=sk-proj-your-openai-key-here

# Anthropic API Key for intent analysis
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# ORGO Computer Environment API Key
REACT_APP_ORGO_API_KEY=sk_live_your-orgo-key-here
```

### API Key Setup

1. **OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Ensure you have GPT-4 access

2. **Anthropic API Key**:
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Create a new API key
   - Ensure you have Claude 3 Sonnet access

3. **ORGO API Key**:
   - Use the existing ORGO Computer Environment key
   - Default fallback key is included in the code

## 🚀 How It Works

### Payment Flow
1. **Voice Command**: User initiates payment with voice command
2. **Voice Processing**: OpenAI extracts structured data from natural language
3. **Intent Analysis**: Claude analyzes the payment intent and risk
4. **Fraud Detection**: OpenAI checks for fraudulent patterns
5. **Payment Execution**: If approved, RUSH API processes the payment
6. **Real-time Updates**: UI shows live status of each agent

### Real-time Status Display
- **Agent Status Grid**: Shows processing status for each agent
- **AI Insights**: Displays analysis results from each agent
- **Visual Indicators**: Green (completed), Red (error), Yellow (processing)
- **Toast Notifications**: Success/error messages for each step

## 🔄 Error Handling

### Fallback System
- If any AI API fails, the system falls back to demo mode
- Error messages are displayed via toast notifications
- Agent status indicators show error states
- Processing continues with simulated data

### API Error Recovery
- Network timeouts are handled gracefully
- Invalid API responses trigger fallback mode
- User-friendly error messages explain what went wrong
- System remains functional even with API issues

## 📊 AI Analysis Results

### Voice Listener Output
```json
{
  "amount": 10000,
  "destination": "Philippines",
  "currency": "USD",
  "intent_confidence": 0.95,
  "extracted_entities": ["amount", "destination"]
}
```

### Intent Analysis Output
```json
{
  "risk_score": 2.5,
  "routing_preference": "solana_fast",
  "compliance_flags": ["kyc_required"],
  "recommended_actions": ["verify_identity"]
}
```

### Fraud Detection Output
```json
{
  "fraud_score": 1.2,
  "risk_factors": ["high_amount", "international"],
  "recommendation": "approve",
  "confidence_level": 0.92
}
```

## 🎯 Benefits

### Real AI Integration
- **Actual AI Processing**: Uses real OpenAI and Claude APIs
- **Intelligent Analysis**: AI agents provide genuine insights
- **Fraud Prevention**: Real-time fraud detection
- **Natural Language**: Voice commands processed by AI

### Enhanced User Experience
- **Real-time Feedback**: Live status updates for each agent
- **Transparent Process**: Users see exactly what's happening
- **Error Handling**: Graceful fallback when APIs fail
- **Professional UI**: Beautiful agent status display

### Scalable Architecture
- **Modular Design**: Each agent is independent
- **Easy Extension**: Add new agents easily
- **API Agnostic**: Can swap AI providers
- **Production Ready**: Includes proper error handling

## 🛠️ Development

### Adding New Agents
1. Create new agent function following the pattern
2. Add agent status to `agentStatus` state
3. Update the agent status grid UI
4. Integrate into the main payment flow

### Customizing AI Prompts
- Modify the system prompts in each agent function
- Adjust temperature and other model parameters
- Add custom instructions for your use case
- Test with different input variations

### Monitoring
- Check browser console for API call logs
- Monitor agent status indicators
- Review AI insights in the UI
- Use toast notifications for user feedback

## 🔒 Security

### API Key Protection
- Keys are stored in environment variables
- Never commit keys to version control
- Use different keys for development/production
- Rotate keys regularly

### Data Privacy
- Voice commands are processed by external APIs
- No sensitive data is stored locally
- All API calls use HTTPS
- Consider data retention policies

## 📈 Performance

### Optimization Tips
- Cache API responses when possible
- Use appropriate model sizes for your needs
- Implement request debouncing
- Monitor API usage and costs

### Cost Management
- Track API usage in OpenAI/Anthropic dashboards
- Set usage limits and alerts
- Use fallback modes to reduce API calls
- Consider caching for repeated requests

---

This integration demonstrates a production-ready AI-powered payment system with real API calls, comprehensive error handling, and an intuitive user interface.
