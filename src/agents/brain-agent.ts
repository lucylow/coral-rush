import { Server } from "@modelcontextprotocol/sdk/dist/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/dist/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/dist/types.js";
import { Mistral } from '@mistralai/mistralai';

// Import Aethir GPU integration
import { aethirAnalyzeIntent, getAethirStats } from '../services/aethirService';

interface AnalysisContext {
  user_wallet?: string;
  recent_transactions?: string[];
  connected_dapps?: string[];
  session_history?: string[];
  user_expertise_level?: 'beginner' | 'intermediate' | 'expert';
}

interface AnalysisResult {
  intent: string;
  confidence: number;
  entities: {
    transaction_hash?: string;
    wallet_address?: string;
    token_symbol?: string;
    amount?: string;
    network?: string;
    dapp_name?: string;
    issue_type?: string;
    urgency_level?: 'low' | 'medium' | 'high' | 'critical';
  };
  action: {
    type: string;
    priority: number;
    parameters: Record<string, any>;
    estimated_duration?: string;
    requires_user_confirmation?: boolean;
  };
  response_text: string;
  follow_up_questions?: string[];
  educational_content?: {
    title: string;
    summary: string;
    helpful_links?: string[];
  };
}

class BrainAgent {
  private server: Server;
  private mistralClient: Mistral;
  private defaultModel: string = "mistral-large-latest";
  private contextMemory: Map<string, AnalysisContext> = new Map();

  constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY environment variable is required");
    }

    this.mistralClient = new Mistral({ apiKey });

    this.server = new Server(
      {
        name: "brain-agent",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "analyze_support_query",
          description: "Analyze user query for Web3 support and determine appropriate actions",
          inputSchema: {
            type: "object",
            properties: {
              user_query: {
                type: "string",
                description: "The user's support query or complaint"
              },
              context: {
                type: "object",
                description: "Additional context about the user and session",
                properties: {
                  user_wallet: { type: "string" },
                  recent_transactions: { type: "array", items: { type: "string" } },
                  connected_dapps: { type: "array", items: { type: "string" } },
                  session_history: { type: "array", items: { type: "string" } },
                  user_expertise_level: { 
                    type: "string", 
                    enum: ["beginner", "intermediate", "expert"]
                  }
                }
              },
              session_id: {
                type: "string",
                description: "Unique session identifier for context tracking"
              }
            },
            required: ["user_query"]
          }
        },
        {
          name: "generate_educational_response",
          description: "Generate educational content to help users understand Web3 concepts",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description: "Web3 topic to explain (e.g., 'gas fees', 'NFT minting', 'DeFi liquidity')"
              },
              user_level: {
                type: "string",
                enum: ["beginner", "intermediate", "expert"],
                description: "User's expertise level for content personalization"
              },
              context_query: {
                type: "string",
                description: "Original user query that prompted the educational need"
              }
            },
            required: ["topic", "user_level"]
          }
        },
        {
          name: "classify_support_urgency",
          description: "Classify the urgency and priority of a support request",
          inputSchema: {
            type: "object",
            properties: {
              user_query: { type: "string" },
              financial_impact: { type: "string", description: "Estimated financial impact" },
              time_sensitive: { type: "boolean", description: "Whether issue is time-sensitive" }
            },
            required: ["user_query"]
          }
        },
        {
          name: "suggest_preventive_measures",
          description: "Suggest preventive measures based on common issues",
          inputSchema: {
            type: "object",
            properties: {
              issue_type: { type: "string" },
              user_context: { type: "object" }
            },
            required: ["issue_type"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "analyze_support_query":
            return await this.handleAnalyzeSupportQuery(args as any);
          
          case "generate_educational_response":
            return await this.handleGenerateEducationalResponse(args as any);
          
          case "classify_support_urgency":
            return await this.handleClassifySupportUrgency(args as any);
          
          case "suggest_preventive_measures":
            return await this.handleSuggestPreventiveMeasures(args as any);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  private async handleAnalyzeSupportQuery(args: {
    user_query: string;
    context?: AnalysisContext;
    session_id?: string;
  }) {
    try {
      // Store context for session continuity
      if (args.session_id && args.context) {
        this.contextMemory.set(args.session_id, args.context);
      }

      // Try Aethir GPU-accelerated intent analysis first
      try {
        console.log("🚀 Using Aethir GPU for intent analysis...");
        
        const aethirResult = await aethirAnalyzeIntent(args.user_query, args.context);
        
        if (!aethirResult.error) {
          // Use Aethir GPU results
          const enhancedResult = {
            intent: aethirResult.intent,
            confidence: aethirResult.confidence,
            entities: aethirResult.entities,
            action: {
              type: aethirResult.intent,
              priority: aethirResult.confidence > 0.9 ? 1 : 2,
              parameters: aethirResult.entities,
              requires_user_confirmation: aethirResult.confidence < 0.8
            },
            response_text: aethirResult.responseSuggestion || `I understand you want to ${aethirResult.intent.replace('_', ' ')}. Let me help you with that.`,
            follow_up_questions: [],
            educational_content: {
              title: `About ${aethirResult.intent.replace('_', ' ')}`,
              summary: "GPU-accelerated analysis complete",
              helpful_links: []
            },
            gpu_processing: {
              aethir_node: aethirResult.processingNode,
              model: aethirResult.model,
              gpu_accelerated: aethirResult.gpuAccelerated
            }
          };

          console.log(`✅ Aethir GPU analysis completed: ${aethirResult.intent} (${aethirResult.confidence})`);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  analysis: enhancedResult,
                  agent_type: "brain",
                  timestamp: new Date().toISOString(),
                  operation: "analyze_support_query",
                  session_id: args.session_id,
                  aethir_gpu_used: true,
                  processing_node: aethirResult.processingNode
                }, null, 2)
              }
            ]
          };
        } else {
          console.warn(`⚠️ Aethir GPU analysis failed: ${aethirResult.error}, falling back to Mistral AI`);
        }
      } catch (gpu_error: any) {
        console.warn(`⚠️ Aethir GPU unavailable: ${gpu_error.message}, using Mistral AI`);
      }

      // Fallback to Mistral AI
      console.log("🔧 Using local Mistral AI analysis...");

      const systemPrompt = this.buildSystemPrompt(args.context);
      const analysisPrompt = this.buildAnalysisPrompt(args.user_query, args.context);

      const chatResponse = await this.mistralClient.chat.complete({
        model: this.defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: analysisPrompt }
        ],
        responseFormat: { type: "json_object" },
        temperature: 0.1,
        maxTokens: 1500
      });

      const responseContent = chatResponse.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response content received from Mistral AI");
      }

      const contentString = typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent);
      const analysisResult: AnalysisResult = JSON.parse(contentString);

      // Validate and enhance the response
      const enhancedResult = await this.enhanceAnalysisResult(
        analysisResult,
        args.user_query, 
        args.context
      );

      // Mark as fallback processing
      (enhancedResult as any).gpu_processing = {
        aethir_gpu_used: false,
        fallback_mode: true,
        local_processing: true
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              analysis: enhancedResult,
              agent_type: "brain",
              timestamp: new Date().toISOString(),
              operation: "analyze_support_query",
              session_id: args.session_id,
              aethir_gpu_used: false,
              fallback_mode: true
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Query analysis failed: ${error.message}`,
              agent_type: "brain",
              timestamp: new Date().toISOString(),
              operation: "analyze_support_query"
            }, null, 2)
          }
        ]
      };
    }
  }

  private buildSystemPrompt(context?: AnalysisContext): string {
    const basePrompt = `You are an expert Web3 customer support AI agent specializing in blockchain transactions, DeFi, NFTs, and cryptocurrency wallets. Your role is to:

1. Analyze user queries about Web3 issues with high accuracy
2. Extract key entities (transaction hashes, wallet addresses, tokens, etc.)
3. Determine appropriate resolution actions
4. Provide clear, empathetic responses
5. Assess urgency and priority levels
6. Suggest educational content when helpful

Always respond with a JSON object containing:
- intent: Primary intent classification
- confidence: Confidence score (0-1)
- entities: Extracted information
- action: Recommended action with parameters
- response_text: Clear, helpful response for the user
- follow_up_questions: Optional clarifying questions
- educational_content: Optional educational resources

Common Web3 issue categories:
- Failed/stuck transactions
- Missing tokens/NFTs
- Wallet connection problems
- Gas fee issues
- Smart contract interactions
- DeFi protocol issues
- Bridge/cross-chain problems
- Security concerns`;

    if (context) {
      const contextInfo = `

Current user context:
- Expertise level: ${context.user_expertise_level || 'unknown'}
- Connected wallet: ${context.user_wallet || 'not provided'}
- Recent transactions: ${context.recent_transactions?.length || 0} available
- Connected dApps: ${context.connected_dapps?.join(', ') || 'none'}
- Session history: ${context.session_history?.length || 0} previous interactions

Tailor your response appropriately to the user's expertise level and context.`;
      
      return basePrompt + contextInfo;
    }

    return basePrompt;
  }

  private buildAnalysisPrompt(userQuery: string, context?: AnalysisContext): string {
    let prompt = `Analyze this Web3 support request:

User Query: "${userQuery}"`;

    if (context?.session_history && context.session_history.length > 0) {
      prompt += `\n\nRecent conversation history:\n${context.session_history.slice(-3).join('\n')}`;
    }

    prompt += `\n\nProvide a comprehensive analysis as a JSON object with all required fields. Focus on:
1. Understanding the core issue
2. Identifying actionable items
3. Determining urgency level
4. Crafting an empathetic response
5. Suggesting educational content if beneficial`;

    return prompt;
  }

  private async enhanceAnalysisResult(
    result: AnalysisResult, 
    originalQuery: string, 
    context?: AnalysisContext
  ): Promise<AnalysisResult> {
    // Add urgency classification if not present
    if (!result.entities.urgency_level) {
      result.entities.urgency_level = this.classifyUrgency(originalQuery, result);
    }

    // Add estimated duration if not present
    if (!result.action.estimated_duration) {
      result.action.estimated_duration = this.estimateActionDuration(result.action.type);
    }

    // Add user confirmation requirement
    if (result.action.requires_user_confirmation === undefined) {
      result.action.requires_user_confirmation = this.requiresUserConfirmation(result.action.type);
    }

    // Generate follow-up questions if none provided
    if (!result.follow_up_questions || result.follow_up_questions.length === 0) {
      result.follow_up_questions = this.generateFollowUpQuestions(result, originalQuery);
    }

    // Add educational content for beginners
    if (context?.user_expertise_level === 'beginner' && !result.educational_content) {
      result.educational_content = this.generateEducationalContent(result.intent);
    }

    return result;
  }

  private classifyUrgency(query: string, result: AnalysisResult): 'low' | 'medium' | 'high' | 'critical' {
    const urgentKeywords = ['stuck', 'lost', 'missing', 'failed', 'error', 'problem', 'help'];
    const criticalKeywords = ['hacked', 'stolen', 'scam', 'phishing', 'drained', 'emergency'];
    
    const queryLower = query.toLowerCase();
    
    if (criticalKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'critical';
    }
    
    if (urgentKeywords.filter(keyword => queryLower.includes(keyword)).length >= 2) {
      return 'high';
    }
    
    if (urgentKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private estimateActionDuration(actionType: string): string {
    const durations: Record<string, string> = {
      'check_transaction': '10-30 seconds',
      'verify_ownership': '5-15 seconds',
      'mint_compensation_nft': '1-3 minutes',
      'provide_information': '5-10 seconds',
      'troubleshoot_wallet': '30 seconds - 2 minutes',
      'analyze_smart_contract': '1-5 minutes',
      'bridge_assistance': '2-10 minutes'
    };
    
    return durations[actionType] || '30 seconds - 2 minutes';
  }

  private requiresUserConfirmation(actionType: string): boolean {
    const confirmationRequired = [
      'mint_compensation_nft',
      'execute_transaction',
      'transfer_tokens',
      'approve_spending',
      'revoke_approval',
      'bridge_tokens'
    ];
    
    return confirmationRequired.includes(actionType);
  }

  private generateFollowUpQuestions(result: AnalysisResult, originalQuery: string): string[] {
    const questions: string[] = [];
    
    if (!result.entities.transaction_hash && result.intent.includes('transaction')) {
      questions.push("Could you provide the transaction hash so I can check its status on the blockchain?");
    }
    
    if (!result.entities.wallet_address && result.intent.includes('wallet')) {
      questions.push("Which wallet address are you having issues with?");
    }
    
    if (result.entities.urgency_level === 'high' || result.entities.urgency_level === 'critical') {
      questions.push("Are you able to access your wallet safely right now?");
    }
    
    if (result.intent.includes('defi') || result.intent.includes('liquidity')) {
      questions.push("Which DeFi protocol or platform are you using?");
    }
    
    return questions.slice(0, 2); // Limit to 2 questions to avoid overwhelming
  }

  private generateEducationalContent(intent: string): { title: string; summary: string; helpful_links: string[] } {
    const educationalContent = {
      transaction: {
        title: "Understanding Blockchain Transactions",
        summary: "Transactions on blockchain networks require gas fees and can sometimes fail due to network congestion or insufficient gas. They are recorded permanently on the blockchain once confirmed.",
        helpful_links: [
          "https://ethereum.org/en/developers/docs/transactions/",
          "https://academy.binance.com/en/articles/what-are-blockchain-transaction-fees"
        ]
      },
      nft: {
        title: "NFT Basics",
        summary: "NFTs (Non-Fungible Tokens) are unique digital assets stored on blockchain networks. They can represent art, collectibles, or other digital items with verified ownership.",
        helpful_links: [
          "https://ethereum.org/en/nft/",
          "https://opensea.io/learn/what-are-nfts"
        ]
      },
      defi: {
        title: "Decentralized Finance (DeFi)",
        summary: "DeFi protocols allow you to lend, borrow, and trade cryptocurrencies without traditional intermediaries. Always understand the risks and smart contract interactions involved.",
        helpful_links: [
          "https://ethereum.org/en/defi/",
          "https://academy.binance.com/en/articles/the-complete-beginners-guide-to-decentralized-finance-defi"
        ]
      }
    };

    // Match intent to content
    if (intent.includes('transaction') || intent.includes('gas') || intent.includes('fee')) {
      return educationalContent.transaction;
    }
    
    if (intent.includes('nft') || intent.includes('token')) {
      return educationalContent.nft;
    }
    
    if (intent.includes('defi') || intent.includes('liquidity') || intent.includes('yield')) {
      return educationalContent.defi;
    }

    return {
      title: "Web3 Basics",
      summary: "Web3 represents the next generation of internet applications built on blockchain technology, offering decentralization, transparency, and user ownership of data and assets.",
      helpful_links: [
        "https://ethereum.org/en/web3/",
        "https://academy.binance.com/en/articles/what-is-web3"
      ]
    };
  }

  private async handleGenerateEducationalResponse(args: {
    topic: string;
    user_level: 'beginner' | 'intermediate' | 'expert';
    context_query?: string;
  }) {
    try {
      const educationalPrompt = `Create educational content about "${args.topic}" for a ${args.user_level} level Web3 user.

${args.context_query ? `This is in response to their question: "${args.context_query}"` : ''}

Provide a comprehensive explanation that includes:
1. Clear definition and overview
2. Key concepts they should understand
3. Common pitfalls and how to avoid them
4. Practical tips and best practices
5. Resources for further learning

Format as a JSON object with:
title, summary, key_points (array), tips (array), resources (array)`;

      const response = await this.mistralClient.chat.complete({
        model: this.defaultModel,
        messages: [
          { role: "system", content: "You are an expert Web3 educator. Create clear, accurate educational content." },
          { role: "user", content: educationalPrompt }
        ],
        responseFormat: { type: "json_object" },
        temperature: 0.2,
        maxTokens: 1000
      });

      const responseContent = response.choices[0]?.message?.content;
      const contentString = typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent);
      const educationalContent = JSON.parse(contentString || "{}");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              educational_content: educationalContent,
              topic: args.topic,
              user_level: args.user_level,
              agent_type: "brain",
              timestamp: new Date().toISOString(),
              operation: "generate_educational_response"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Educational content generation failed: ${error.message}`,
              agent_type: "brain",
              timestamp: new Date().toISOString(),
              operation: "generate_educational_response"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleClassifySupportUrgency(args: {
    user_query: string;
    financial_impact?: string;
    time_sensitive?: boolean;
  }) {
    const urgency = this.classifyUrgency(args.user_query, {} as AnalysisResult);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            urgency_classification: {
              level: urgency,
              financial_impact: args.financial_impact || 'unknown',
              time_sensitive: args.time_sensitive || false,
              recommended_sla: this.getSLAForUrgency(urgency)
            },
            agent_type: "brain",
            timestamp: new Date().toISOString(),
            operation: "classify_support_urgency"
          }, null, 2)
        }
      ]
    };
  }

  private async handleSuggestPreventiveMeasures(args: {
    issue_type: string;
    user_context?: any;
  }) {
    const preventiveMeasures = this.getPreventiveMeasures(args.issue_type);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            preventive_measures: preventiveMeasures,
            issue_type: args.issue_type,
            agent_type: "brain",
            timestamp: new Date().toISOString(),
            operation: "suggest_preventive_measures"
          }, null, 2)
        }
      ]
    };
  }

  private getSLAForUrgency(urgency: string): string {
    const slas = {
      'critical': '5 minutes',
      'high': '15 minutes',
      'medium': '1 hour',
      'low': '24 hours'
    };
    return slas[urgency as keyof typeof slas] || '1 hour';
  }

  private getPreventiveMeasures(issueType: string): string[] {
    const measures: Record<string, string[]> = {
      transaction_failure: [
        "Always check gas price recommendations before sending transactions",
        "Set appropriate gas limits based on transaction complexity",
        "Monitor network congestion before important transactions",
        "Use transaction simulation tools when available"
      ],
      wallet_security: [
        "Use hardware wallets for large amounts",
        "Never share your seed phrase or private keys",
        "Verify URLs before connecting your wallet",
        "Enable two-factor authentication where possible"
      ],
      smart_contract: [
        "Research and audit smart contracts before interacting",
        "Start with small amounts when trying new protocols",
        "Understand the risks of each DeFi protocol",
        "Keep track of your approvals and revoke unnecessary ones"
      ]
    };

    return measures[issueType] || [
      "Stay informed about Web3 security best practices",
      "Keep your wallet software updated",
      "Be cautious with unknown protocols and websites"
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

export default BrainAgent;

if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new BrainAgent();
  agent.run().catch(console.error);
}
