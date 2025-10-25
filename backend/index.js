// backend/index.js
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { runMultiAgent } from './swarmsAdapter.js';
import { logToSolanaMemo } from './solanaClient.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

/**
 * POST /api/ai/execute
 * Body: { userWallet: string, command: string, useOnChainLog: boolean }
 * Returns: { agents: {...}, decision: string, txSignature?: string, explorerUrl?: string }
 */
app.post('/api/ai/execute', async (req, res) => {
  try {
    const { userWallet, command, useOnChainLog = true } = req.body;
    if (!command) return res.status(400).json({ error: 'command required' });

    console.log(`🚀 Processing multi-agent request: "${command.slice(0, 50)}..."`);

    // 1) Run multi-agent workflow
    // Define agent roles and prompts (customize these to your product)
    const agentsConfig = [
      { 
        id: 'research', 
        role: 'Research Agent', 
        promptTemplate: 'Research and analyze the latest information about: {{input}}. Provide factual data, current trends, and relevant context.' 
      },
      { 
        id: 'summarizer', 
        role: 'Summarizer Agent', 
        promptTemplate: 'Create a concise, actionable summary for end users based on this research: {{input}}. Focus on key insights and practical implications.' 
      },
      { 
        id: 'voting', 
        role: 'Decision Agent', 
        promptTemplate: 'Based on research and analysis, provide a clear recommendation (approve/reject/hold) with rationale for: {{input}}. Consider risks, benefits, and user context.' 
      }
    ];

    const agentsResult = await runMultiAgent({ command, agentsConfig });

    // 2) Synthesize final decision from agent outputs
    const decisionInput = {
      command,
      research: agentsResult.research?.output || 'No research data available',
      summary: agentsResult.summarizer?.output || 'No summary available',
      voting: agentsResult.voting?.output || 'No decision available'
    };

    // Create aggregated decision
    const decision = agentsResult.voting?.output || 
      `Multi-agent analysis complete for: ${command}. Research findings: ${agentsResult.research?.output?.slice(0, 100) || 'Limited data'}. Recommendation pending review.`;

    console.log(`✅ Multi-agent processing complete. Decision: ${decision.slice(0, 100)}...`);

    // 3) Optionally log to Solana via Memo (cheap; won't store lots of text)
    let txSignature = null;
    let explorerUrl = null;
    
    if (useOnChainLog && process.env.SOLANA_LOGGING_KEYPAIR) {
      try {
        // Create a concise payload for memo (consider hashing for larger content)
        const payload = JSON.stringify({
          type: 'coral_rush_ai_log',
          command: command.slice(0, 50), // keep command short
          decision: decision.slice(0, 150), // keep decision summary short
          agents: Object.keys(agentsResult).length,
          timestamp: new Date().toISOString(),
          user: userWallet ? userWallet.slice(0, 8) + '...' : 'anonymous'
        });

        console.log(`🔗 Logging to Solana: ${payload.length} bytes`);
        const result = await logToSolanaMemo(payload);
        txSignature = result.signature;
        explorerUrl = result.explorerUrl;
        console.log(`✅ Solana log complete: ${txSignature}`);
      } catch (solanaError) {
        console.warn(`⚠️ Solana logging failed: ${solanaError.message}`);
        // Continue without failing the entire request
      }
    }

    return res.json({
      success: true,
      agents: agentsResult,
      decision,
      txSignature,
      explorerUrl,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - req.startTime
    });

  } catch (err) {
    console.error('❌ AI execute error:', err);
    return res.status(500).json({ 
      success: false,
      error: `Multi-agent processing failed: ${err.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    swarms_configured: !!process.env.SWARMS_API_KEY,
    solana_configured: !!process.env.SOLANA_LOGGING_KEYPAIR,
    version: '1.0.0'
  });
});

// Add request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Coral Rush Multi-Agent Backend running on port ${PORT}`);
  console.log(`📊 Swarms API: ${process.env.SWARMS_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🔗 Solana logging: ${process.env.SOLANA_LOGGING_KEYPAIR ? '✅ Configured' : '❌ Not configured'}`);
});

export default app;
