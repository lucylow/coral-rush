// backend/swarmsAdapter.js
// Adapter: prefer official SDK if present; fallback to REST fetch.
// Includes mock mode for development without Swarms credits

import fetch from 'node-fetch';

const SWARMS_API_URL = process.env.SWARMS_API_URL || 'https://api.swarms.ai';
const SWARMS_API_KEY = process.env.SWARMS_API_KEY || '';
const MOCK_MODE = process.env.NODE_ENV === 'development' && !SWARMS_API_KEY;

// Mock responses for development/testing
const MOCK_RESPONSES = {
  research: {
    output: "Based on current market analysis, the requested action involves moderate risk with potential for positive outcomes. Key factors include market volatility, regulatory environment, and technical feasibility. Recent trends show increasing adoption in similar use cases."
  },
  summarizer: {
    output: "Summary: Moderate risk opportunity with positive potential. Recommendation to proceed with caution and proper risk management. Key success factors identified: timing, execution quality, and market conditions."
  },
  voting: {
    output: "RECOMMENDATION: APPROVE with conditions. Rationale: Research indicates favorable risk-reward ratio. Suggested approach: phased implementation with milestone checkpoints. Risk mitigation: start with small allocation, monitor progress, scale gradually."
  }
};

async function callSwarmsRest(agentName, prompt, extra = {}) {
  // If in mock mode, return mock responses
  if (MOCK_MODE) {
    console.log(`🎭 Mock mode: Simulating ${agentName} agent response`);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000)); // Simulate API delay
    
    const mockResponse = MOCK_RESPONSES[agentName] || {
      output: `Mock ${agentName} response for: ${prompt.slice(0, 50)}...`
    };
    
    return mockResponse;
  }

  if (!SWARMS_API_KEY) {
    throw new Error('Swarms API key not configured and not in mock mode');
  }

  try {
    // Replace endpoint & body with the correct Swarms REST contract
    // This is a generic implementation - adapt to actual Swarms API documentation
    const requestBody = {
      agent_name: agentName,
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
      ...extra
    };

    console.log(`🤖 Calling Swarms API for ${agentName}...`);
    
    const response = await fetch(`${SWARMS_API_URL}/v1/agents/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWARMS_API_KEY}`,
        'User-Agent': 'coral-rush/1.0.0'
      },
      body: JSON.stringify(requestBody),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Swarms REST error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json();
    console.log(`✅ ${agentName} agent completed successfully`);
    
    // Normalize response format - adapt based on actual Swarms API response structure
    return {
      output: json.output || json.result || json.response || JSON.stringify(json),
      metadata: {
        agent: agentName,
        tokens_used: json.tokens_used || json.usage?.total_tokens || 0,
        processing_time: json.processing_time || 0
      }
    };

  } catch (error) {
    console.error(`❌ Swarms API error for ${agentName}:`, error.message);
    
    // Fallback to mock response on API error to keep demo functional
    console.log(`🎭 Falling back to mock response for ${agentName}`);
    const mockResponse = MOCK_RESPONSES[agentName] || {
      output: `Fallback response for ${agentName}: ${prompt.slice(0, 100)}... (API unavailable)`
    };
    
    mockResponse.metadata = {
      agent: agentName,
      fallback: true,
      error: error.message
    };
    
    return mockResponse;
  }
}

async function runMultiAgent({ command, agentsConfig = [] }) {
  console.log(`🔄 Starting multi-agent orchestration with ${agentsConfig.length} agents`);
  
  try {
    // Run research and summarizer in parallel (first phase)
    const researchTasks = agentsConfig.filter(cfg => cfg.id === 'research' || cfg.id === 'summarizer')
      .map(async (cfg) => {
        const prompt = cfg.promptTemplate.replace('{{input}}', command);
        const result = await callSwarmsRest(cfg.id, prompt, { role: cfg.role });
        return { 
          id: cfg.id, 
          role: cfg.role, 
          output: result.output,
          metadata: result.metadata
        };
      });

    const researchResults = await Promise.allSettled(researchTasks);
    
    // Process first phase results
    const firstPhaseResults = {};
    researchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { id, role, output, metadata } = result.value;
        firstPhaseResults[id] = { role, output, metadata };
      } else {
        console.error(`❌ Agent failed:`, result.reason);
        firstPhaseResults[result.reason?.agentId || 'unknown'] = { 
          error: String(result.reason),
          role: 'failed_agent'
        };
      }
    });

    // Run decision agent with context from first phase (second phase)
    const decisionAgent = agentsConfig.find(cfg => cfg.id === 'voting');
    if (decisionAgent) {
      const contextualPrompt = decisionAgent.promptTemplate.replace('{{input}}', 
        `Original request: ${command}\n\nResearch findings: ${firstPhaseResults.research?.output || 'No research available'}\n\nSummary: ${firstPhaseResults.summarizer?.output || 'No summary available'}`
      );
      
      try {
        const decisionResult = await callSwarmsRest('voting', contextualPrompt, { role: decisionAgent.role });
        firstPhaseResults.voting = {
          role: decisionAgent.role,
          output: decisionResult.output,
          metadata: decisionResult.metadata
        };
      } catch (error) {
        console.error(`❌ Decision agent failed:`, error);
        firstPhaseResults.voting = {
          error: error.message,
          role: 'decision_agent'
        };
      }
    }

    console.log(`✅ Multi-agent orchestration complete: ${Object.keys(firstPhaseResults).length} agents processed`);
    return firstPhaseResults;

  } catch (error) {
    console.error(`❌ Multi-agent orchestration failed:`, error);
    throw new Error(`Multi-agent processing failed: ${error.message}`);
  }
}

// Export functions and configuration info
export { runMultiAgent, callSwarmsRest };

// Export configuration status for health checks
export const isConfigured = () => ({
  api_url: !!SWARMS_API_URL,
  api_key: !!SWARMS_API_KEY,
  mock_mode: MOCK_MODE
});
