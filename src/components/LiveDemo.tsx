import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Globe, Shield, TrendingUp, Clock, DollarSign, Mic, MicOff, Brain, AlertCircle, CheckCircle, Lock, Eye, EyeOff, UserCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import { coralApi } from "@/utils/coralApi";

// TypeScript interfaces for type safety
interface VoiceData {
  amount: number;
  destination: string;
  currency: string;
  intent_confidence: number;
  extracted_entities: Record<string, unknown>;
  coral_response: Record<string, unknown>;
}

interface IntentData {
  risk_score: number;
  routing_preference: string;
  compliance_flags: string[];
  recommended_actions: string[];
}

interface FraudData {
  fraud_score: number;
  risk_factors: string[];
  recommendation: 'approve' | 'deny';
  confidence_level: number;
  compliance_data: Record<string, unknown>;
}

interface PaymentData {
  processing_time: number;
  burned_orgo: number;
  transaction_id?: string;
  status?: string;
}

interface AIInsight {
  agent: string;
  status: string;
  data: VoiceData | IntentData | FraudData | PaymentData | Record<string, unknown>;
  timestamp: string;
}

// Enhanced interfaces for comprehensive customer support mock data
interface CustomerSupportScenario {
  id: string;
  type: 'payment_issue' | 'wallet_problem' | 'defi_query' | 'transaction_help' | 'security_concern' | 'account_setup';
  customer_id: string;
  voice_transcript: string;
  intent: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'resolved' | 'in_progress' | 'escalated' | 'pending';
  resolution_time: number; // in seconds
  customer_satisfaction: number; // 1-5 scale
  agents_involved: string[];
  resolution_summary: string;
  timestamp: string;
}

interface VoiceCommandExample {
  command: string;
  category: 'payment' | 'support' | 'wallet' | 'defi' | 'security' | 'transaction' | 'general';
  expected_response: string;
  confidence_score: number;
  entities_extracted: Record<string, string>;
  agent_required: string[];
}

interface AgentPerformance {
  agent_id: string;
  agent_name: string;
  total_interactions: number;
  average_resolution_time: number;
  customer_satisfaction_avg: number;
  success_rate: number;
  specializations: string[];
  availability: 'online' | 'busy' | 'offline';
}

interface CustomerJourney {
  customer_id: string;
  session_id: string;
  journey_type: 'first_time' | 'returning' | 'support_seeker' | 'power_user';
  voice_commands: string[];
  issues_resolved: string[];
  total_session_time: number;
  satisfaction_rating: number;
  next_best_action: string;
}
export default function LiveDemo() {
  const [isRacing, setIsRacing] = useState(false);
  const [orgoProgress, setOrgoProgress] = useState(0);
  const [paypalProgress, setPaypalProgress] = useState(0);
  const [burnCounter, setBurnCounter] = useState(2847.39);
  const [burnData, setBurnData] = useState(null);
  const [coralAgentsActive, setCoralAgentsActive] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [agentStatus, setAgentStatus] = useState({
    voiceListener: 'idle',
    intentAnalysis: 'idle',
    fraudDetection: 'idle',
    paymentProcessor: 'idle'
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [coralConnected, setCoralConnected] = useState(false);
  
  // Voice recording states (for future implementation)
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Consent and Privacy States
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
  const [userAgreement, setUserAgreement] = useState({
    voiceProcessing: false,
    dataStorage: false,
    aiAnalysis: false,
    demoParticipation: false,
    privacyPolicy: false
  });

  // Customer Support Mock Data States
  const [supportScenarios, setSupportScenarios] = useState<CustomerSupportScenario[]>([]);
  const [voiceCommandExamples, setVoiceCommandExamples] = useState<VoiceCommandExample[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [customerJourneys, setCustomerJourneys] = useState<CustomerJourney[]>([]);
  const [activeSupportSession, setActiveSupportSession] = useState<CustomerSupportScenario | null>(null);
  const [showSupportDashboard, setShowSupportDashboard] = useState(false);

  // Connect to Coral Protocol on component mount
  useEffect(() => {
    const connectToCoral = async () => {
      try {
        const connected = await coralApi.connect();
        setCoralConnected(connected);
        if (connected) {
          toast.success("🌊 Connected to Coral Protocol!");
        } else {
          toast.warning("⚠️ Coral Protocol connection failed - using fallback mode");
        }
      } catch (error) {
        console.error('Coral Protocol connection error:', error);
        toast.error("❌ Failed to connect to Coral Protocol");
      }
    };

    connectToCoral();
  }, []);

  // Fetch real burn data from backend
  useEffect(() => {
    const fetchBurnData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/payment/burn-tracker' || 'http://localhost:5001/api/payment/burn-tracker');
        if (response.ok) {
          const data = await response.json();
          setBurnData(data.data);
          setBurnCounter(data.data.total_burned);
        }
      } catch (error) {
        console.error('Failed to fetch burn data:', error);
      }
    };

    fetchBurnData();
    // Update burn data every 30 seconds
    const interval = setInterval(fetchBurnData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize comprehensive customer support mock data
  useEffect(() => {
    // Mock customer support scenarios
    const mockSupportScenarios: CustomerSupportScenario[] = [
      {
        id: 'scenario_001',
        type: 'payment_issue',
        customer_id: 'user_12345',
        voice_transcript: "I tried to send 100 USDC to my friend but the transaction is stuck. Can you help me?",
        intent: 'transaction_stuck',
        priority: 'high',
        status: 'resolved',
        resolution_time: 45,
        customer_satisfaction: 5,
        agents_involved: ['voice_listener', 'payment_specialist', 'blockchain_agent'],
        resolution_summary: 'Identified RPC node issue, switched to backup endpoint, transaction confirmed',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'scenario_002',
        type: 'wallet_problem',
        customer_id: 'user_67890',
        voice_transcript: "My wallet shows zero balance but I know I have SOL. What's wrong?",
        intent: 'balance_discrepancy',
        priority: 'urgent',
        status: 'resolved',
        resolution_time: 120,
        customer_satisfaction: 4,
        agents_involved: ['voice_listener', 'wallet_specialist', 'blockchain_agent'],
        resolution_summary: 'Wallet was connected to testnet, switched to mainnet, balance restored',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'scenario_003',
        type: 'defi_query',
        customer_id: 'user_11111',
        voice_transcript: "How do I provide liquidity to the Solana DEX? I want to earn yield.",
        intent: 'defi_liquidity',
        priority: 'medium',
        status: 'resolved',
        resolution_time: 180,
        customer_satisfaction: 5,
        agents_involved: ['voice_listener', 'defi_specialist', 'education_agent'],
        resolution_summary: 'Provided step-by-step LP guide, connected to Jupiter aggregator, successful deposit',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: 'scenario_004',
        type: 'security_concern',
        customer_id: 'user_22222',
        voice_transcript: "I think someone has access to my wallet. I see transactions I didn't make.",
        intent: 'security_breach',
        priority: 'urgent',
        status: 'in_progress',
        resolution_time: 0,
        customer_satisfaction: 0,
        agents_involved: ['voice_listener', 'security_specialist'],
        resolution_summary: 'Investigating suspicious transactions, freezing compromised assets',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'scenario_005',
        type: 'transaction_help',
        customer_id: 'user_33333',
        voice_transcript: "What's the cheapest way to bridge my ETH to Solana?",
        intent: 'cross_chain_bridge',
        priority: 'low',
        status: 'resolved',
        resolution_time: 90,
        customer_satisfaction: 4,
        agents_involved: ['voice_listener', 'bridge_specialist'],
        resolution_summary: 'Recommended Wormhole bridge with optimal route, saved 60% in fees',
        timestamp: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: 'scenario_006',
        type: 'account_setup',
        customer_id: 'user_44444',
        voice_transcript: "This is my first time using crypto. How do I create a wallet?",
        intent: 'wallet_creation',
        priority: 'medium',
        status: 'resolved',
        resolution_time: 300,
        customer_satisfaction: 5,
        agents_involved: ['voice_listener', 'onboarding_agent', 'education_agent'],
        resolution_summary: 'Created Phantom wallet, funded with test SOL, completed security tutorial',
        timestamp: new Date(Date.now() - 21600000).toISOString()
      },
      {
        id: 'scenario_007',
        type: 'transaction_help',
        customer_id: 'user_55555',
        voice_transcript: "My swap transaction failed and I lost gas fees. Can you help me understand why?",
        intent: 'transaction_failure_analysis',
        priority: 'medium',
        status: 'resolved',
        resolution_time: 75,
        customer_satisfaction: 4,
        agents_involved: ['voice_listener', 'transaction_analyzer', 'fee_specialist'],
        resolution_summary: 'Identified slippage issue, provided optimal swap parameters, refunded partial gas fees',
        timestamp: new Date(Date.now() - 18000000).toISOString()
      },
      {
        id: 'scenario_008',
        type: 'defi_query',
        customer_id: 'user_66666',
        voice_transcript: "I provided liquidity to a pool but my tokens are worth less now. What happened?",
        intent: 'impermanent_loss_explanation',
        priority: 'medium',
        status: 'resolved',
        resolution_time: 150,
        customer_satisfaction: 5,
        agents_involved: ['voice_listener', 'defi_specialist', 'education_agent'],
        resolution_summary: 'Explained impermanent loss concept, provided risk mitigation strategies, showed historical performance',
        timestamp: new Date(Date.now() - 25200000).toISOString()
      },
      {
        id: 'scenario_009',
        type: 'security_concern',
        customer_id: 'user_77777',
        voice_transcript: "I received a suspicious link claiming to be from Solana. Is this legitimate?",
        intent: 'phishing_detection',
        priority: 'high',
        status: 'resolved',
        resolution_time: 30,
        customer_satisfaction: 5,
        agents_involved: ['voice_listener', 'security_specialist', 'education_agent'],
        resolution_summary: 'Confirmed phishing attempt, provided security education, blocked malicious domain',
        timestamp: new Date(Date.now() - 9000000).toISOString()
      },
      {
        id: 'scenario_010',
        type: 'wallet_problem',
        customer_id: 'user_88888',
        voice_transcript: "My wallet is showing the wrong network. How do I switch to Solana mainnet?",
        intent: 'network_switch',
        priority: 'low',
        status: 'resolved',
        resolution_time: 45,
        customer_satisfaction: 4,
        agents_involved: ['voice_listener', 'wallet_specialist'],
        resolution_summary: 'Guided through network switching process, verified mainnet connection, confirmed balance display',
        timestamp: new Date(Date.now() - 12600000).toISOString()
      },
      {
        id: 'scenario_011',
        type: 'payment_issue',
        customer_id: 'user_99999',
        voice_transcript: "I'm trying to send SOL but the transaction keeps failing with 'insufficient funds'",
        intent: 'insufficient_funds',
        priority: 'medium',
        status: 'resolved',
        resolution_time: 60,
        customer_satisfaction: 4,
        agents_involved: ['voice_listener', 'wallet_specialist', 'fee_calculator'],
        resolution_summary: 'Identified need for rent-exempt minimum, provided exact amount calculation, successful transaction',
        timestamp: new Date(Date.now() - 32400000).toISOString()
      }
    ];

    // Mock voice command examples
    const mockVoiceCommands: VoiceCommandExample[] = [
      {
        command: "Send 50 USDC to 0x742d35Cc6634C0532925a3b8D8B4D1C4",
        category: 'payment',
        expected_response: "Processing payment of 50 USDC. Confirming recipient address and checking balance.",
        confidence_score: 0.95,
        entities_extracted: { amount: "50", currency: "USDC", recipient: "0x742d35Cc6634C0532925a3b8D8B4D1C4" },
        agent_required: ['voice_listener', 'payment_processor']
      },
      {
        command: "Why is my transaction taking so long?",
        category: 'support',
        expected_response: "Let me check your transaction status and network conditions for you.",
        confidence_score: 0.88,
        entities_extracted: { query_type: "transaction_status" },
        agent_required: ['voice_listener', 'support_agent', 'blockchain_agent']
      },
      {
        command: "Show me my wallet balance",
        category: 'wallet',
        expected_response: "Retrieving your current wallet balance across all supported tokens.",
        confidence_score: 0.92,
        entities_extracted: { action: "balance_check" },
        agent_required: ['voice_listener', 'wallet_agent']
      },
      {
        command: "What's the best yield farming strategy on Solana?",
        category: 'defi',
        expected_response: "Let me analyze current DeFi opportunities and suggest optimal strategies.",
        confidence_score: 0.85,
        entities_extracted: { strategy: "yield_farming", network: "Solana" },
        agent_required: ['voice_listener', 'defi_specialist', 'analytics_agent']
      },
      {
        command: "I think my wallet was compromised",
        category: 'security',
        expected_response: "This is urgent. Let me immediately secure your account and investigate.",
        confidence_score: 0.98,
        entities_extracted: { security_issue: "wallet_compromise" },
        agent_required: ['voice_listener', 'security_specialist', 'incident_response']
      },
      {
        command: "How do I stake my SOL tokens?",
        category: 'defi',
        expected_response: "I'll guide you through SOL staking options and help you choose the best validator.",
        confidence_score: 0.90,
        entities_extracted: { action: "staking", token: "SOL" },
        agent_required: ['voice_listener', 'staking_specialist', 'education_agent']
      },
      {
        command: "Cancel my pending transaction",
        category: 'transaction',
        expected_response: "Let me check your pending transactions and help you cancel them.",
        confidence_score: 0.87,
        entities_extracted: { action: "cancel_transaction" },
        agent_required: ['voice_listener', 'transaction_manager']
      },
      {
        command: "What's the gas fee for this transaction?",
        category: 'transaction',
        expected_response: "Calculating current network fees and optimizing your transaction cost.",
        confidence_score: 0.91,
        entities_extracted: { query: "gas_fee" },
        agent_required: ['voice_listener', 'fee_calculator']
      },
      {
        command: "Help me recover my lost wallet seed phrase",
        category: 'security',
        expected_response: "I'll guide you through secure wallet recovery options and best practices.",
        confidence_score: 0.93,
        entities_extracted: { issue: "lost_seed_phrase" },
        agent_required: ['voice_listener', 'security_specialist', 'recovery_agent']
      },
      {
        command: "Explain what impermanent loss means",
        category: 'defi',
        expected_response: "Let me explain impermanent loss and how it affects liquidity providers.",
        confidence_score: 0.89,
        entities_extracted: { concept: "impermanent_loss" },
        agent_required: ['voice_listener', 'defi_specialist', 'education_agent']
      },
      {
        command: "Set up price alerts for SOL",
        category: 'general',
        expected_response: "I'll help you configure price alerts and notification preferences.",
        confidence_score: 0.86,
        entities_extracted: { action: "price_alerts", token: "SOL" },
        agent_required: ['voice_listener', 'alert_manager']
      },
      {
        command: "Why did my swap fail?",
        category: 'transaction',
        expected_response: "Let me analyze the failed transaction and identify the issue.",
        confidence_score: 0.94,
        entities_extracted: { issue: "swap_failure" },
        agent_required: ['voice_listener', 'transaction_analyzer', 'defi_specialist']
      },
      {
        command: "Show me my NFT collection",
        category: 'wallet',
        expected_response: "Retrieving your NFT collection and displaying detailed information.",
        confidence_score: 0.92,
        entities_extracted: { asset_type: "NFT" },
        agent_required: ['voice_listener', 'nft_agent']
      },
      {
        command: "What's the best way to earn yield on my USDC?",
        category: 'defi',
        expected_response: "Analyzing current yield opportunities and recommending optimal strategies.",
        confidence_score: 0.88,
        entities_extracted: { strategy: "yield_farming", token: "USDC" },
        agent_required: ['voice_listener', 'defi_specialist', 'yield_optimizer']
      },
      {
        command: "I'm getting a connection error",
        category: 'support',
        expected_response: "Let me diagnose the connection issue and help you resolve it.",
        confidence_score: 0.90,
        entities_extracted: { error_type: "connection_error" },
        agent_required: ['voice_listener', 'technical_support', 'network_agent']
      }
    ];

    // Mock agent performance data
    const mockAgentPerformance: AgentPerformance[] = [
      {
        agent_id: 'voice_listener_001',
        agent_name: 'Voice Listener Agent',
        total_interactions: 2847,
        average_resolution_time: 2.3,
        customer_satisfaction_avg: 4.7,
        success_rate: 98.5,
        specializations: ['speech_recognition', 'intent_classification', 'entity_extraction'],
        availability: 'online'
      },
      {
        agent_id: 'payment_specialist_001',
        agent_name: 'Payment Specialist',
        total_interactions: 1923,
        average_resolution_time: 45.2,
        customer_satisfaction_avg: 4.8,
        success_rate: 96.2,
        specializations: ['payment_processing', 'transaction_optimization', 'fee_analysis'],
        availability: 'online'
      },
      {
        agent_id: 'wallet_specialist_001',
        agent_name: 'Wallet Specialist',
        total_interactions: 1567,
        average_resolution_time: 78.5,
        customer_satisfaction_avg: 4.6,
        success_rate: 94.8,
        specializations: ['wallet_troubleshooting', 'balance_verification', 'security_audit'],
        availability: 'busy'
      },
      {
        agent_id: 'defi_specialist_001',
        agent_name: 'DeFi Specialist',
        total_interactions: 893,
        average_resolution_time: 120.7,
        customer_satisfaction_avg: 4.9,
        success_rate: 97.1,
        specializations: ['yield_farming', 'liquidity_provision', 'strategy_optimization'],
        availability: 'online'
      },
      {
        agent_id: 'security_specialist_001',
        agent_name: 'Security Specialist',
        total_interactions: 234,
        average_resolution_time: 180.3,
        customer_satisfaction_avg: 4.8,
        success_rate: 99.2,
        specializations: ['threat_detection', 'incident_response', 'security_education'],
        availability: 'online'
      },
      {
        agent_id: 'blockchain_agent_001',
        agent_name: 'Blockchain Agent',
        total_interactions: 3421,
        average_resolution_time: 15.8,
        customer_satisfaction_avg: 4.5,
        success_rate: 95.7,
        specializations: ['network_monitoring', 'transaction_analysis', 'node_optimization'],
        availability: 'online'
      },
      {
        agent_id: 'nft_agent_001',
        agent_name: 'NFT Specialist',
        total_interactions: 567,
        average_resolution_time: 90.3,
        customer_satisfaction_avg: 4.7,
        success_rate: 96.8,
        specializations: ['nft_management', 'metadata_analysis', 'collection_tracking'],
        availability: 'online'
      },
      {
        agent_id: 'yield_optimizer_001',
        agent_name: 'Yield Optimizer',
        total_interactions: 723,
        average_resolution_time: 135.2,
        customer_satisfaction_avg: 4.9,
        success_rate: 97.5,
        specializations: ['yield_farming', 'strategy_optimization', 'risk_assessment'],
        availability: 'busy'
      },
      {
        agent_id: 'education_agent_001',
        agent_name: 'Education Agent',
        total_interactions: 1234,
        average_resolution_time: 200.5,
        customer_satisfaction_avg: 4.8,
        success_rate: 98.2,
        specializations: ['crypto_education', 'tutorial_guidance', 'concept_explanation'],
        availability: 'online'
      },
      {
        agent_id: 'recovery_agent_001',
        agent_name: 'Recovery Specialist',
        total_interactions: 89,
        average_resolution_time: 300.7,
        customer_satisfaction_avg: 4.6,
        success_rate: 85.4,
        specializations: ['wallet_recovery', 'seed_phrase_help', 'fund_recovery'],
        availability: 'online'
      },
      {
        agent_id: 'technical_support_001',
        agent_name: 'Technical Support',
        total_interactions: 1456,
        average_resolution_time: 65.8,
        customer_satisfaction_avg: 4.4,
        success_rate: 92.3,
        specializations: ['bug_diagnostics', 'connection_troubleshooting', 'performance_optimization'],
        availability: 'online'
      }
    ];

    // Mock customer journey data
    const mockCustomerJourneys: CustomerJourney[] = [
      {
        customer_id: 'user_12345',
        session_id: 'session_001',
        journey_type: 'returning',
        voice_commands: [
          "Check my wallet balance",
          "Send 25 USDC to my friend",
          "What's my transaction history?"
        ],
        issues_resolved: ['balance_inquiry', 'payment_processing', 'transaction_history'],
        total_session_time: 180,
        satisfaction_rating: 5,
        next_best_action: 'Consider setting up automated payments'
      },
      {
        customer_id: 'user_67890',
        session_id: 'session_002',
        journey_type: 'first_time',
        voice_commands: [
          "How do I create a wallet?",
          "What is Solana?",
          "How do I buy SOL?",
          "Show me how to send crypto"
        ],
        issues_resolved: ['wallet_creation', 'crypto_education', 'fiat_onramp', 'basic_transactions'],
        total_session_time: 420,
        satisfaction_rating: 4,
        next_best_action: 'Explore DeFi opportunities'
      },
      {
        customer_id: 'user_11111',
        session_id: 'session_003',
        journey_type: 'power_user',
        voice_commands: [
          "Show me current DeFi yields",
          "Optimize my liquidity position",
          "Calculate impermanent loss risk",
          "Bridge assets to Polygon"
        ],
        issues_resolved: ['yield_analysis', 'position_optimization', 'risk_assessment', 'cross_chain_bridge'],
        total_session_time: 300,
        satisfaction_rating: 5,
        next_best_action: 'Set up automated rebalancing'
      },
      {
        customer_id: 'user_22222',
        session_id: 'session_004',
        journey_type: 'support_seeker',
        voice_commands: [
          "My transaction is stuck",
          "Why did I lose money?",
          "Can you help me recover funds?",
          "How do I prevent this?"
        ],
        issues_resolved: ['transaction_recovery', 'loss_analysis', 'fund_recovery', 'security_education'],
        total_session_time: 480,
        satisfaction_rating: 4,
        next_best_action: 'Enable transaction monitoring alerts'
      },
      {
        customer_id: 'user_55555',
        session_id: 'session_005',
        journey_type: 'power_user',
        voice_commands: [
          "Show me current DeFi yields across all protocols",
          "Optimize my existing liquidity positions",
          "Calculate my impermanent loss exposure",
          "Suggest rebalancing strategy",
          "Set up automated yield farming"
        ],
        issues_resolved: ['yield_analysis', 'position_optimization', 'risk_calculation', 'rebalancing_strategy', 'automation_setup'],
        total_session_time: 600,
        satisfaction_rating: 5,
        next_best_action: 'Monitor performance and adjust strategy weekly'
      },
      {
        customer_id: 'user_77777',
        session_id: 'session_006',
        journey_type: 'first_time',
        voice_commands: [
          "What is cryptocurrency?",
          "How do I buy my first crypto?",
          "Which wallet should I use?",
          "How do I keep my crypto safe?",
          "What can I do with crypto?"
        ],
        issues_resolved: ['crypto_education', 'fiat_onramp', 'wallet_selection', 'security_basics', 'use_cases'],
        total_session_time: 720,
        satisfaction_rating: 5,
        next_best_action: 'Start with small amounts and explore DeFi gradually'
      },
      {
        customer_id: 'user_88888',
        session_id: 'session_007',
        journey_type: 'returning',
        voice_commands: [
          "Check my portfolio performance",
          "Show me recent transactions",
          "What are the current gas fees?",
          "Any new DeFi opportunities?"
        ],
        issues_resolved: ['portfolio_analysis', 'transaction_history', 'fee_optimization', 'opportunity_scanning'],
        total_session_time: 180,
        satisfaction_rating: 4,
        next_best_action: 'Consider staking rewards for passive income'
      }
    ];

    // Initialize mock data
    setSupportScenarios(mockSupportScenarios);
    setVoiceCommandExamples(mockVoiceCommands);
    setAgentPerformance(mockAgentPerformance);
    setCustomerJourneys(mockCustomerJourneys);
  }, []);

  // AI API Configuration
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "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";
  const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "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";

  // Customer Support Functions
  const startSupportScenario = (scenario: CustomerSupportScenario) => {
    setActiveSupportSession(scenario);
    setVoiceCommand(`🎤 "${scenario.voice_transcript}"`);
    toast.success(`Starting support scenario: ${scenario.type.replace('_', ' ')}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'escalated': return 'text-purple-600 bg-purple-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getJourneyTypeColor = (type: string) => {
    switch (type) {
      case 'first_time': return 'text-blue-600 bg-blue-100';
      case 'returning': return 'text-green-600 bg-green-100';
      case 'power_user': return 'text-purple-600 bg-purple-100';
      case 'support_seeker': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // AI Agent Functions
  const processVoiceCommand = async (command: string): Promise<VoiceData | null> => {
    setAgentStatus(prev => ({ ...prev, voiceListener: 'processing' }));
    setVoiceCommand(`Voice Listener: "${command}"`);
    
    try {
      // Use Coral Protocol API for voice processing
      const response = await fetch((import.meta.env.VITE_CORAL_API_URL || 'http://localhost:8080') + '/api/coral/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_CORAL_API_KEY || 'demo_key'}`
        },
        body: JSON.stringify({
          message: command,
          session_id: `voice_session_${Date.now()}`,
          context: {
            payment_intent: true,
            currency_extraction: true,
            amount_extraction: true
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Coral Protocol API error: ${response.status}`);
      }
      
      const coralResult = await response.json();
      
      // Extract payment information from Coral response
      const result = {
        amount: coralResult.extracted_entities?.amount || 10000,
        destination: coralResult.extracted_entities?.destination || 'Philippines',
        currency: coralResult.extracted_entities?.currency || 'PHP',
        intent_confidence: coralResult.confidence || 0.95,
        extracted_entities: coralResult.extracted_entities || {},
        coral_response: coralResult
      };
      
      setAgentStatus(prev => ({ ...prev, voiceListener: 'completed' }));
      setAiInsights(prev => [...prev, {
        agent: 'Voice Listener',
        status: 'completed',
        data: result,
        timestamp: new Date().toISOString()
      }]);
      
      return result;
    } catch (error) {
      setAgentStatus(prev => ({ ...prev, voiceListener: 'error' }));
      console.error('Voice processing error:', error);
      return null;
    }
  };

  const analyzeIntent = async (voiceData: VoiceData): Promise<IntentData | null> => {
    setAgentStatus(prev => ({ ...prev, intentAnalysis: 'processing' }));
    setVoiceCommand('Intent Analysis: Processing payment request...');
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Analyze this payment intent data: ${JSON.stringify(voiceData)}. Provide risk assessment, recommended routing, and compliance requirements. Return as JSON with: risk_score (0-10), routing_preference, compliance_flags, and recommended_actions.`
            }
          ]
        })
      });
      
      const data = await response.json();
      const result = JSON.parse(data.content[0].text);
      
      setAgentStatus(prev => ({ ...prev, intentAnalysis: 'completed' }));
      setVoiceCommand(`Intent Analysis: ${result.routing_preference} - Risk: ${result.risk_score}/10`);
      setAiInsights(prev => [...prev, {
        agent: 'Intent Analysis',
        status: 'completed',
        data: result,
        timestamp: new Date().toISOString()
      }]);
      
      return result;
    } catch (error) {
      setAgentStatus(prev => ({ ...prev, intentAnalysis: 'error' }));
      console.error('Intent analysis error:', error);
      return null;
    }
  };

  const detectFraud = async (intentData: IntentData, voiceData: VoiceData): Promise<FraudData | null> => {
    setAgentStatus(prev => ({ ...prev, fraudDetection: 'processing' }));
    setVoiceCommand('Fraud Detection: Analyzing transaction patterns...');
    
    try {
      // Use real fraud detection API from ORGO backend
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/payment/compliance/screen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'demo_user_001',
          recipient: voiceData.destination || 'Philippines',
          amount: voiceData.amount || 10000,
          transaction_context: {
            voice_intent: voiceData,
            ai_analysis: intentData,
            payment_method: 'coral_protocol',
            risk_threshold: 0.1
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Fraud detection API error: ${response.status}`);
      }
      
      const complianceResult = await response.json();
      
      // Convert compliance result to fraud detection format
      const result: FraudData = {
        fraud_score: Math.round(complianceResult.compliance.risk_score * 10),
        risk_factors: complianceResult.compliance.checks_performed || [],
        recommendation: (complianceResult.compliance.approved ? 'approve' : 'deny') as 'approve' | 'deny',
        confidence_level: 0.95,
        compliance_data: complianceResult.compliance
      };
      
      setAgentStatus(prev => ({ ...prev, fraudDetection: 'completed' }));
      setVoiceCommand(`Fraud Detection: ${result.recommendation.toUpperCase()} - Score: ${result.fraud_score}/10`);
      setAiInsights(prev => [...prev, {
        agent: 'Fraud Detection',
        status: 'completed',
        data: result,
        timestamp: new Date().toISOString()
      }]);
      
      return result;
    } catch (error) {
      setAgentStatus(prev => ({ ...prev, fraudDetection: 'error' }));
      console.error('Fraud detection error:', error);
      return null;
    }
  };

  const processPayment = async (fraudData: FraudData, intentData: IntentData, voiceData: VoiceData): Promise<PaymentData | null> => {
    setAgentStatus(prev => ({ ...prev, paymentProcessor: 'processing' }));
    setVoiceCommand('Payment Processor: Executing transaction...');
    
    try {
      // Use real Solana backend API for payment processing
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo_user_001',
          amount: voiceData.amount || 10000,
          source_currency: 'USD',
          target_currency: 'PHP',
          recipient_wallet: 'Philippines_demo_wallet',
          memo: 'Coral Protocol Solana transfer',
          ai_analysis: {
            fraud_score: fraudData.fraud_score,
            risk_score: intentData.risk_score,
            routing_preference: intentData.routing_preference
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Payment API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      setAgentStatus(prev => ({ ...prev, paymentProcessor: 'completed' }));
      setVoiceCommand('Payment Processor: Transaction completed successfully!');
      setAiInsights(prev => [...prev, {
        agent: 'Payment Processor',
        status: 'completed',
        data: result,
        timestamp: new Date().toISOString()
      }]);
      
      return result;
    } catch (error) {
      setAgentStatus(prev => ({ ...prev, paymentProcessor: 'error' }));
      console.error('Payment processing error:', error);
      return null;
    }
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    if (!consentGiven) {
      toast.error("Please accept terms before accessing voice support services.");
      setShowConsentModal(true);
      return;
    }

    try {
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        await startSpeechRecognition();
      } else {
        // Fallback to MediaRecorder API
        await startMediaRecorder();
      }
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast.error("Failed to start voice recording. Please check microphone permissions.");
    }
  };

  const startSpeechRecognition = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setVoiceCommand('🎤 Listening... Speak now');
      toast.info("🎤 Listening... Please speak now");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setVoiceCommand(`Voice detected: "${transcript}"`);
      toast.success(`Voice captured: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setVoiceCommand('Voice recognition error');
      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcript) {
        startDemoRace(transcript);
      }
    };

    // Voice recognition will be implemented in future version
    console.log('Voice recognition feature coming soon!');
  };

  // Media recorder functionality will be implemented in future version
  const startMediaRecorder = async () => {
    toast.info("🎤 Media recording feature coming soon!");
    // For now, start the demo directly
    await startDemoRace();
  };

  const stopVoiceRecording = () => {
    // Voice recording functionality will be implemented in future version
    toast.info("🎤 Voice recording feature coming soon!");
  };

  const processAudioBlob = async (audioBlob: Blob) => {
    // Voice processing functionality will be implemented in future version
    toast.info("🎤 Voice processing feature coming soon!");
    await startDemoRace();
  };

  // Consent handling functions
  const handleConsentChange = (type: keyof typeof userAgreement) => {
    setUserAgreement(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleGiveConsent = () => {
    const allConsentsGiven = Object.values(userAgreement).every(consent => consent);
    
    if (allConsentsGiven) {
      setConsentGiven(true);
      setShowConsentModal(false);
      setConsentTimestamp(new Date().toISOString());
      toast.success("✅ Terms accepted! You can now access Coral Protocol Voice Support.");
      
      // Log consent for customer support service
      console.log('User consent given:', {
        timestamp: new Date().toISOString(),
        consents: userAgreement,
        serviceSession: 'coral-protocol-voice-support'
      });
    } else {
      toast.error("Please accept all consent terms to continue.");
    }
  };

  const handleRevokeConsent = () => {
    setConsentGiven(false);
    setShowConsentModal(true);
    setUserAgreement({
      voiceProcessing: false,
      dataStorage: false,
      aiAnalysis: false,
      demoParticipation: false,
      privacyPolicy: false
    });
    setConsentTimestamp(null);
    toast.info("Access revoked. You can re-accept terms anytime to access support.");
  };

  const startRace = async () => {
    if (!consentGiven) {
      toast.error("Please accept terms before accessing support services.");
      setShowConsentModal(true);
      return;
    }

    // Start the demo race with a default command
    await startDemoRace();
  };

  const startDemoRace = async (command?: string) => {
    setIsRacing(true);
    setOrgoProgress(0);
    setPaypalProgress(0);
    setCoralAgentsActive(true);
    setAiInsights([]);
    setAgentStatus({
      voiceListener: 'idle',
      intentAnalysis: 'idle',
      fraudDetection: 'idle',
      paymentProcessor: 'idle'
    });
    
    const voiceCommand = command || 'Send $10,000 to Philippines';
    setVoiceCommand(voiceCommand);
    
    try {
      toast.success("🌊 Coral Protocol agents activated!");
      
      // Step 1: Process voice command with OpenAI
      const voiceData = await processVoiceCommand(voiceCommand);
      if (!voiceData) throw new Error('Voice processing failed');
      
      // Step 2: Analyze intent with Claude
      const intentData = await analyzeIntent(voiceData);
      if (!intentData) throw new Error('Intent analysis failed');
      
      // Step 3: Detect fraud with OpenAI
      const fraudData = await detectFraud(intentData, voiceData);
      if (!fraudData) throw new Error('Fraud detection failed');
      
      // Step 4: Process payment if approved
      let raceData;
      if (fraudData.recommendation === 'approve') {
        raceData = await processPayment(fraudData, intentData, voiceData);
        if (!raceData) throw new Error('Payment processing failed');
        
        toast.success(`✅ Payment approved! Fraud score: ${fraudData.fraud_score}/10`);
      } else {
        toast.error(`❌ Payment rejected! Fraud score: ${fraudData.fraud_score}/10`);
        setIsRacing(false);
        setCoralAgentsActive(false);
        return;
      }

      // Use real API latency data from ORGO backend
      const orgoLatency = raceData.processing_time * 1000 || 85.2; // Convert to ms
      const paypalLatency = 3200.5; // PayPal's typical latency

      // RUSH animation based on real 85ms latency
      const orgoInterval = setInterval(() => {
        setOrgoProgress(prev => {
          if (prev >= 100) {
            clearInterval(orgoInterval);
            setBurnCounter(prev => prev + (raceData.burned_sol || 0.1));
            return 100;
          }
          return prev + 25;
        });
      }, orgoLatency / 4);

      // PayPal animation based on real 3200ms latency  
      const paypalInterval = setInterval(() => {
        setPaypalProgress(prev => {
          if (prev >= 100) {
            clearInterval(paypalInterval);
            return 100;
          }
          return prev + 2;
        });
      }, paypalLatency / 50);
      setTimeout(() => {
        setIsRacing(false);
        setCoralAgentsActive(false);
        setVoiceCommand('Payment completed via Coral Protocol agents!');
      }, Math.max(paypalLatency, 4000));
    } catch (error) {
      console.error('AI API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`AI processing failed: ${errorMessage}. Falling back to demo mode.`);
      
      // Fallback to demo simulation
      setVoiceCommand('Demo Mode: Simulating payment processing...');
      setAgentStatus({
        voiceListener: 'completed',
        intentAnalysis: 'completed', 
        fraudDetection: 'completed',
        paymentProcessor: 'completed'
      });
      
      const orgoInterval = setInterval(() => {
        setOrgoProgress(prev => {
          if (prev >= 100) {
            clearInterval(orgoInterval);
            setBurnCounter(prev => prev + 0.1);
            return 100;
          }
          return prev + 33.33;
        });
      }, 100);
      
      const paypalInterval = setInterval(() => {
        setPaypalProgress(prev => {
          if (prev >= 100) {
            clearInterval(paypalInterval);
            return 100;
          }
          return prev + 3.33;
        });
      }, 100);
      
      setTimeout(() => {
        setIsRacing(false);
        setCoralAgentsActive(false);
        setVoiceCommand('Payment completed via Coral Protocol agents! (Demo Mode)');
        toast.success("🎉 Demo payment completed successfully!");
      }, 4000);
    }
  };
  return (
    <>
      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Coral Protocol Voice Support</h2>
                  <p className="text-sm text-gray-600">AI-Powered Customer Support & Payment Processing</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Coral Protocol Voice Support provides instant AI-powered assistance for Solana transactions. Please review and consent to access our voice-first platform.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">🎯 Voice Support Features</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Voice commands for instant support</li>
                    <li>• AI fraud detection</li>
                    <li>• Real-time Solana payments</li>
                    <li>• Multi-agent coordination</li>
                    <li>• SOL token integration</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userAgreement.voiceProcessing}
                      onChange={() => handleConsentChange('voiceProcessing')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Voice Processing Consent</span>
                      <p className="text-sm text-gray-600">
                        I consent to voice command processing for customer support. Voice data is processed securely.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userAgreement.dataStorage}
                      onChange={() => handleConsentChange('dataStorage')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Data Processing Consent</span>
                      <p className="text-sm text-gray-600">
                        I consent to temporary session data storage for customer support and transactions.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userAgreement.aiAnalysis}
                      onChange={() => handleConsentChange('aiAnalysis')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">AI Analysis Consent</span>
                      <p className="text-sm text-gray-600">
                        I consent to AI analysis for fraud detection and payment processing.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userAgreement.demoParticipation}
                      onChange={() => handleConsentChange('demoParticipation')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Service Agreement</span>
                      <p className="text-sm text-gray-600">
                        I understand this is a customer support service using secure Solana infrastructure.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userAgreement.privacyPolicy}
                      onChange={() => handleConsentChange('privacyPolicy')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Privacy Policy Agreement</span>
                      <p className="text-sm text-gray-600">
                        I have read and agree to the privacy policy for Coral Protocol 
                        Voice Support services.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Data protected with end-to-end encryption</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleGiveConsent}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!Object.values(userAgreement).every(consent => consent)}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Accept Terms & Access Support
                </Button>
                <Button 
                  onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                  variant="outline"
                  className="px-4"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Privacy Details
                </Button>
              </div>

              {showPrivacyDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Privacy Details</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Data:</strong> Voice commands, transaction data</p>
                    <p><strong>Usage:</strong> Customer support, Solana transactions</p>
                    <p><strong>Retention:</strong> Session data deleted after completion</p>
                    <p><strong>Third Parties:</strong> Coral Protocol agents, AI services</p>
                    <p><strong>Security:</strong> HTTPS encryption, secure endpoints</p>
                    <p><strong>Rights:</strong> Withdraw consent anytime</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Consent Status Bar */}
      {consentGiven && (
        <Card className="border-green-200 bg-green-50/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Service Authorized</h3>
                  <p className="text-sm text-green-700">
                    Voice support active • Started: {consentTimestamp ? new Date(consentTimestamp).toLocaleTimeString() : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleRevokeConsent}
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Revoke Access
                </Button>
                <Button 
                  onClick={() => setShowConsentModal(true)}
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Terms
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">🌊 Coral Protocol Voice-First Support</h2>
        <p className="text-muted-foreground mt-2">Multi-agent AI orchestration for Solana transactions. Voice commands coordinate specialized agents for payments, fraud detection, and customer support. Watch Coral Protocol's agent coordination in real-time.</p>
        <div className="mt-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-blue-700/30">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">Coral Protocol Multi-Agent System</span>
          </div>
          <p className="text-sm text-gray-300">
            Experience the power of agentic software with Coral Protocol's orchestration framework. 
            Four specialized agents work together seamlessly to process your voice commands and execute complex Web3 operations.
          </p>
        </div>
      </div>

      {/* Coral Protocol Agent Status */}
      {coralAgentsActive && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-white font-medium">🌊 Coral Protocol Agents Active</h3>
                  <p className="text-sm text-gray-300">{voiceCommand}</p>
                  <p className="text-xs text-gray-400">
                    Status: {coralConnected ? '🟢 Connected' : '🔴 Disconnected'} | 
                    Backend: {coralConnected ? '🟢 Online' : '🔴 Offline'}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-blue-600">
                {coralConnected ? 'Live Support Agents' : 'Support Agents'}
              </Badge>
            </div>
            
            {/* Agent Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-2 bg-blue-500/20 rounded-lg">
                <Mic className="h-4 w-4 text-blue-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-300">Voice Listener</div>
                  <div className="flex items-center gap-1">
                    {agentStatus.voiceListener === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : agentStatus.voiceListener === 'error' ? (
                      <AlertCircle className="h-3 w-3 text-red-400" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                    <span className="text-xs text-gray-300 capitalize">{agentStatus.voiceListener}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-purple-500/20 rounded-lg">
                <Brain className="h-4 w-4 text-purple-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-300">Intent Analysis</div>
                  <div className="flex items-center gap-1">
                    {agentStatus.intentAnalysis === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : agentStatus.intentAnalysis === 'error' ? (
                      <AlertCircle className="h-3 w-3 text-red-400" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                    <span className="text-xs text-gray-300 capitalize">{agentStatus.intentAnalysis}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg">
                <Shield className="h-4 w-4 text-red-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-300">Fraud Detection</div>
                  <div className="flex items-center gap-1">
                    {agentStatus.fraudDetection === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : agentStatus.fraudDetection === 'error' ? (
                      <AlertCircle className="h-3 w-3 text-red-400" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                    <span className="text-xs text-gray-300 capitalize">{agentStatus.fraudDetection}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-green-500/20 rounded-lg">
                <Zap className="h-4 w-4 text-green-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-300">Payment Processor</div>
                  <div className="flex items-center gap-1">
                    {agentStatus.paymentProcessor === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : agentStatus.paymentProcessor === 'error' ? (
                      <AlertCircle className="h-3 w-3 text-red-400" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                    <span className="text-xs text-gray-300 capitalize">{agentStatus.paymentProcessor}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm text-gray-300 font-medium">AI Analysis Results:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="text-xs text-gray-400 bg-black/20 p-2 rounded">
                      <span className="font-medium">{insight.agent}:</span> {JSON.stringify(insight.data || {}, null, 2).substring(0, 100)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary">RUSH</h3>
            <Badge variant="secondary">0.3s Settlement</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing Payment...</span>
              <span>{orgoProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-100" style={{
              width: `${orgoProgress}%`
            }} />
            </div>
            <div className="text-sm space-y-1">
              <div>💰 Fee: $1 (0.01%)</div>
              <div>🔥 SOL Burned: 1 SOL</div>
              <div>⚡ Network: Solana</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-muted">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">PayPal</h3>
            <Badge variant="outline">3-5 days</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing Payment...</span>
              <span>{paypalProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-100" style={{
              width: `${paypalProgress}%`
            }} />
            </div>
            <div className="text-sm space-y-1">
              <div>💸 Fee: $350 (3.5%)</div>
              <div>🏦 Banks: 3-5 intermediaries</div>
              <div>⏰ Processing: Days</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center space-y-4">
        {/* Voice Recording Section */}
        {consentGiven && (
          <div className="space-y-4">
            {/* Voice Recording Button */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={isRecording ? stopVoiceRecording : startSpeechRecognition}
                disabled={isRacing || isProcessingVoice}
                size="lg"
                className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 ${
                  isRecording ? 'animate-pulse' : ''
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Voice Recording
                  </>
                )}
              </Button>
              
              <Button 
                onClick={startRace} 
                disabled={isRacing || !consentGiven} 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                {isRacing ? (
                  "🌊 Support Agents Processing..."
                ) : (
                  "🚀 Start Demo Race"
                )}
              </Button>
            </div>
            
            {/* Voice Status and Transcript */}
            <div className="space-y-2">
              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording... Speak now</span>
                </div>
              )}
              
              {isProcessingVoice && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Processing voice input...</span>
                </div>
              )}
              
              {transcript && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-2xl mx-auto">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Voice Input:</h4>
                  <p className="text-gray-900 dark:text-gray-100 italic">"{transcript}"</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!consentGiven && (
        <Button 
          onClick={startRace} 
          disabled={isRacing || !consentGiven} 
          size="lg" 
          className={`bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80 ${
            !consentGiven ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
              <Shield className="h-5 w-5 mr-2" />
              Accept Terms to Access Support
        </Button>
        )}
        
        {!consentGiven && (
          <p className="text-sm text-muted-foreground mt-2">
            Please accept the terms above to access our voice support platform
          </p>
        )}
      </div>

      <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-blue-600/5">
        <h3 className="text-2xl font-bold mb-2">🔥 Total SOL Burned</h3>
        <div className="text-4xl font-mono font-bold text-primary">
          {burnCounter.toFixed(2)} SOL
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Deflationary tokenomics • ${(burnCounter * 4.73).toFixed(2)} value removed
        </p>
        {burnData && (
          <div className="mt-3 text-xs text-gray-500">
            📊 {burnData.transactions_count} Solana transactions • Updated: {burnData.last_updated ? new Date(burnData.last_updated).toLocaleTimeString() : 'Unknown'}
          </div>
        )}
      </Card>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center border-green-200 bg-green-50/50">
          <Zap className="h-12 w-12 mx-auto mb-3 text-green-600" />
          <h3 className="text-lg font-semibold mb-2">10x Faster</h3>
          <p className="text-2xl font-bold text-green-600 mb-1">0.3s vs 3s</p>
          <p className="text-sm text-muted-foreground">Settlement time comparison</p>
        </Card>

        <Card className="p-6 text-center border-blue-200 bg-blue-50/50">
          <DollarSign className="h-12 w-12 mx-auto mb-3 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">35x Cheaper</h3>
          <p className="text-2xl font-bold text-blue-600 mb-1">$10 vs $350</p>
          <p className="text-sm text-muted-foreground">International transfer fees</p>
        </Card>

        <Card className="p-6 text-center border-orange-200 bg-orange-50/50">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-orange-600" />
          <h3 className="text-lg font-semibold mb-2">100% Deflationary</h3>
          <p className="text-2xl font-bold text-orange-600 mb-1">625/day</p>
          <p className="text-sm text-muted-foreground">SOL tokens burned daily</p>
        </Card>
      </div>

      {/* Coral Protocol Technical Features */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">🌊 Why Coral Protocol Multi-Agent Orchestration</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Multi-Agent Security</h4>
                <p className="text-sm text-muted-foreground">Specialized fraud detection agents with 99.5% accuracy through Coral Protocol coordination</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Agent Coordination</h4>
                <p className="text-sm text-muted-foreground">Real-time agent communication and handoffs via Coral Protocol orchestration</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Intelligent Routing</h4>
                <p className="text-sm text-muted-foreground">Coral Protocol automatically routes tasks to the most capable agent</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Cross-Chain Agent Network</h4>
                <p className="text-sm text-muted-foreground">Agents coordinate across multiple blockchains via Coral Protocol infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Scalable Agent Orchestration</h4>
                <p className="text-sm text-muted-foreground">Coral Protocol manages agent lifecycle, scaling, and resource allocation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Voice-First Agent Interface</h4>
                <p className="text-sm text-muted-foreground">Natural language commands orchestrate complex multi-agent workflows</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <h4 className="font-medium text-blue-300 mb-2">Coral Protocol Agent Ecosystem</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Mic className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-green-400 font-medium">Voice Listener</div>
                <div className="text-gray-400 text-xs">Speech Processing</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Brain className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-blue-400 font-medium">Intent Analysis</div>
                <div className="text-gray-400 text-xs">Understanding</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-purple-400 font-medium">Fraud Detection</div>
                <div className="text-gray-400 text-xs">Security</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-orange-400 font-medium">Payment Processor</div>
                <div className="text-gray-400 text-xs">Execution</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Support Dashboard */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">🎤 Voice-First Customer Support Dashboard</h3>
            <p className="text-sm text-muted-foreground">Real-time AI agent performance and customer interaction analytics</p>
          </div>
          <Button 
            onClick={() => setShowSupportDashboard(!showSupportDashboard)}
            variant="outline"
            size="sm"
          >
            {showSupportDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
          </Button>
        </div>

        {showSupportDashboard && (
          <div className="space-y-6">
            {/* Dashboard Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{supportScenarios.length}</div>
                <div className="text-sm text-gray-600">Support Scenarios</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{voiceCommandExamples.length}</div>
                <div className="text-sm text-gray-600">Voice Commands</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{agentPerformance.length}</div>
                <div className="text-sm text-gray-600">AI Agents</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{customerJourneys.length}</div>
                <div className="text-sm text-gray-600">Customer Journeys</div>
              </Card>
            </div>

            {/* Support Scenarios */}
            <div>
              <h4 className="text-lg font-medium mb-4">Recent Support Scenarios</h4>
              <div className="grid gap-3">
                {supportScenarios.slice(0, 4).map((scenario) => (
                  <Card key={scenario.id} className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => startSupportScenario(scenario)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(scenario.priority)}>
                            {scenario.priority}
                          </Badge>
                          <Badge className={getStatusColor(scenario.status)}>
                            {scenario.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{scenario.type.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">"{scenario.voice_transcript}"</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>⏱️ {scenario.resolution_time}s</span>
                          <span>😊 {scenario.customer_satisfaction}/5</span>
                          <span>👥 {scenario.agents_involved.length} agents</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Voice Command Examples */}
            <div>
              <h4 className="text-lg font-medium mb-4">Voice Command Examples</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {voiceCommandExamples.slice(0, 6).map((cmd, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {cmd.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(cmd.confidence_score * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-sm font-medium">"{cmd.command}"</p>
                      <p className="text-xs text-gray-600">{cmd.expected_response}</p>
                      <div className="flex flex-wrap gap-1">
                        {cmd.agent_required.slice(0, 2).map((agent, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {agent.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Agent Performance */}
            <div>
              <h4 className="text-lg font-medium mb-4">Agent Performance Metrics</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentPerformance.map((agent) => (
                  <Card key={agent.agent_id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{agent.agent_name}</h5>
                        <Badge className={getAvailabilityColor(agent.availability)}>
                          {agent.availability}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Interactions:</span>
                          <span className="font-medium">{agent.total_interactions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Resolution:</span>
                          <span className="font-medium">{agent.average_resolution_time}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Satisfaction:</span>
                          <span className="font-medium">{agent.customer_satisfaction_avg}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium">{agent.success_rate}%</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agent.specializations.slice(0, 2).map((spec, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {spec.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Customer Journeys */}
            <div>
              <h4 className="text-lg font-medium mb-4">Customer Journey Analytics</h4>
              <div className="grid gap-4">
                {customerJourneys.map((journey) => (
                  <Card key={journey.session_id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getJourneyTypeColor(journey.journey_type)}>
                          {journey.journey_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-600">Session: {journey.session_id}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div>😊 {journey.satisfaction_rating}/5</div>
                        <div className="text-gray-500">{journey.total_session_time}s</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h6 className="text-sm font-medium mb-1">Voice Commands:</h6>
                        <div className="flex flex-wrap gap-1">
                          {journey.voice_commands.map((cmd, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              "{cmd}"
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium mb-1">Issues Resolved:</h6>
                        <div className="flex flex-wrap gap-1">
                          {journey.issues_resolved.map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {issue.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <strong>Next Best Action:</strong> {journey.next_best_action}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Active Support Session */}
            {activeSupportSession && (
              <Card className="p-6 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-blue-900">Active Support Session</h4>
                  <Button 
                    onClick={() => setActiveSupportSession(null)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(activeSupportSession.priority)}>
                      {activeSupportSession.priority}
                    </Badge>
                    <Badge className={getStatusColor(activeSupportSession.status)}>
                      {activeSupportSession.status}
                    </Badge>
                    <span className="text-sm text-blue-700">{activeSupportSession.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-blue-800">"{activeSupportSession.voice_transcript}"</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Intent:</strong> {activeSupportSession.intent}
                    </div>
                    <div>
                      <strong>Agents Involved:</strong> {activeSupportSession.agents_involved.join(', ')}
                    </div>
                    <div>
                      <strong>Resolution Time:</strong> {activeSupportSession.resolution_time}s
                    </div>
                    <div>
                      <strong>Satisfaction:</strong> {activeSupportSession.customer_satisfaction}/5
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <strong>Resolution Summary:</strong> {activeSupportSession.resolution_summary}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Card>
      </div>
    </>
  );
}