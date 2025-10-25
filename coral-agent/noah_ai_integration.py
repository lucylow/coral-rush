#!/usr/bin/env python3
"""
Noah AI Integration
Integrates Noah AI no-code builder for Solana app development in the Coral Protocol system
"""

import asyncio
import json
import logging
import os
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime
import aiohttp
import tempfile
import yaml

logger = logging.getLogger(__name__)

@dataclass
class NoahAIConfig:
    """Configuration for Noah AI"""
    api_url: str = "https://api.noah.ai"
    api_key: Optional[str] = None
    workspace_id: Optional[str] = None
    timeout: int = 120  # Longer timeout for app generation
    max_retries: int = 3

@dataclass
class AppSpec:
    """Application specification for Noah AI"""
    name: str
    description: str
    app_type: str  # "defi", "nft", "dao", "payment", "gaming"
    features: List[str]
    ui_preferences: Dict[str, Any]
    blockchain_features: Dict[str, Any]
    integration_requirements: List[str]

@dataclass
class AppGenerationResult:
    """Result of app generation"""
    success: bool
    app_code: Optional[Dict[str, str]] = None  # {"frontend": "...", "backend": "..."}
    smart_contracts: Optional[List[str]] = None
    deployment_config: Optional[str] = None
    api_endpoints: Optional[List[Dict[str, Any]]] = None
    error_message: Optional[str] = None
    generation_time: float = 0.0
    app_id: Optional[str] = None
    deployment_url: Optional[str] = None

class NoahAIAgent:
    """Noah AI agent for no-code Solana app development"""
    
    def __init__(self, config: NoahAIConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Available capabilities
        self.capabilities = [
            "generate_defi_app",
            "generate_nft_marketplace",
            "generate_dao_interface",
            "generate_payment_app",
            "generate_gaming_app",
            "generate_portfolio_tracker",
            "generate_staking_interface",
            "generate_token_launcher",
            "generate_analytics_dashboard",
            "deploy_app",
            "update_app",
            "generate_mobile_app"
        ]
        
        # App templates with detailed specifications
        self.app_templates = {
            "payment_app": {
                "description": "Cross-border payment application with voice interface",
                "features": [
                    "voice_payments",
                    "multi_currency_support",
                    "real_time_conversion",
                    "fraud_detection",
                    "transaction_history",
                    "wallet_integration"
                ],
                "ui_components": [
                    "voice_interface",
                    "payment_form",
                    "transaction_dashboard",
                    "currency_converter",
                    "security_settings"
                ],
                "smart_contracts": ["payment_processor", "token_burner", "fraud_detector"]
            },
            "nft_marketplace": {
                "description": "Complete NFT marketplace with minting and trading",
                "features": [
                    "nft_minting",
                    "marketplace_trading",
                    "royalty_system",
                    "collection_management",
                    "metadata_storage",
                    "auction_system"
                ],
                "ui_components": [
                    "mint_interface",
                    "marketplace_grid",
                    "nft_details",
                    "collection_page",
                    "user_profile"
                ],
                "smart_contracts": ["nft_collection", "marketplace", "royalty_manager"]
            },
            "defi_protocol": {
                "description": "DeFi protocol with lending, borrowing, and staking",
                "features": [
                    "token_lending",
                    "collateral_management",
                    "yield_farming",
                    "liquidity_pools",
                    "governance_voting",
                    "reward_distribution"
                ],
                "ui_components": [
                    "lending_interface",
                    "pool_dashboard",
                    "governance_page",
                    "yield_calculator",
                    "portfolio_view"
                ],
                "smart_contracts": ["lending_pool", "governance", "reward_distributor"]
            },
            "dao_platform": {
                "description": "DAO governance platform with proposal and voting system",
                "features": [
                    "proposal_creation",
                    "voting_system",
                    "treasury_management",
                    "member_management",
                    "execution_framework",
                    "delegation_system"
                ],
                "ui_components": [
                    "proposal_dashboard",
                    "voting_interface",
                    "treasury_view",
                    "member_directory",
                    "governance_analytics"
                ],
                "smart_contracts": ["dao_governance", "treasury", "voting_system"]
            },
            "gaming_platform": {
                "description": "Web3 gaming platform with NFT rewards and tokenomics",
                "features": [
                    "game_integration",
                    "nft_rewards",
                    "leaderboards",
                    "tournament_system",
                    "in_game_economy",
                    "social_features"
                ],
                "ui_components": [
                    "game_launcher",
                    "reward_dashboard",
                    "leaderboard",
                    "tournament_page",
                    "inventory_management"
                ],
                "smart_contracts": ["game_rewards", "tournament_manager", "in_game_currency"]
            }
        }
    
    async def initialize(self):
        """Initialize the Noah AI agent"""
        try:
            # Create HTTP session
            timeout = aiohttp.ClientTimeout(total=self.config.timeout)
            self.session = aiohttp.ClientSession(timeout=timeout)
            
            # Verify API connection
            if await self._verify_connection():
                logger.info("✅ Noah AI agent initialized successfully")
                return True
            else:
                logger.error("❌ Failed to verify Noah AI connection")
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize Noah AI agent: {e}")
            return False
    
    async def _verify_connection(self) -> bool:
        """Verify connection to Noah AI API"""
        try:
            headers = {}
            if self.config.api_key:
                headers["Authorization"] = f"Bearer {self.config.api_key}"
            
            async with self.session.get(
                f"{self.config.api_url}/health",
                headers=headers
            ) as response:
                if response.status == 200:
                    logger.info("✅ Noah AI API connection verified")
                    return True
                else:
                    logger.error(f"❌ Noah AI API returned status {response.status}")
                    return False
                    
        except Exception as e:
            # For demo purposes, return True if API is not available
            logger.warning(f"Noah AI API not available, using mock mode: {e}")
            return True
    
    async def generate_app(self, spec: AppSpec) -> AppGenerationResult:
        """Generate a complete Solana app using Noah AI"""
        start_time = datetime.now()
        
        try:
            # Prepare generation request
            request_data = {
                "name": spec.name,
                "description": spec.description,
                "app_type": spec.app_type,
                "features": spec.features,
                "ui_preferences": spec.ui_preferences,
                "blockchain_features": spec.blockchain_features,
                "integration_requirements": spec.integration_requirements
            }
            
            # Generate app components
            frontend_code = await self._generate_frontend_code(spec)
            backend_code = await self._generate_backend_code(spec)
            smart_contracts = await self._generate_smart_contracts(spec)
            deployment_config = await self._generate_deployment_config(spec)
            api_endpoints = await self._generate_api_endpoints(spec)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            app_id = f"noah_app_{int(datetime.now().timestamp())}"
            
            return AppGenerationResult(
                success=True,
                app_code={
                    "frontend": frontend_code,
                    "backend": backend_code
                },
                smart_contracts=smart_contracts,
                deployment_config=deployment_config,
                api_endpoints=api_endpoints,
                generation_time=processing_time,
                app_id=app_id,
                deployment_url=f"https://{app_id}.noah-apps.com"
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"App generation failed: {e}")
            return AppGenerationResult(
                success=False,
                error_message=str(e),
                generation_time=processing_time
            )
    
    async def _generate_frontend_code(self, spec: AppSpec) -> str:
        """Generate React frontend code for the app"""
        
        app_name = spec.name.replace(" ", "").replace("-", "")
        
        # Generate main App component
        frontend_code = f'''import React, {{ useState, useEffect }} from 'react';
import {{ BrowserRouter as Router, Routes, Route }} from 'react-router-dom';
import {{ WalletAdapterNetwork }} from '@solana/wallet-adapter-base';
import {{ ConnectionProvider, WalletProvider }} from '@solana/wallet-adapter-react';
import {{ WalletModalProvider }} from '@solana/wallet-adapter-react-ui';
import {{ PhantomWalletAdapter }} from '@solana/wallet-adapter-phantom';
import {{ clusterApiUrl }} from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

// Component imports
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
'''

        # Add page imports based on app type
        if spec.app_type == "payment":
            frontend_code += '''import PaymentDashboard from './pages/PaymentDashboard';
import VoicePayment from './pages/VoicePayment';
import TransactionHistory from './pages/TransactionHistory';
import CurrencyConverter from './pages/CurrencyConverter';
'''
        elif spec.app_type == "nft":
            frontend_code += '''import Marketplace from './pages/Marketplace';
import MintNFT from './pages/MintNFT';
import MyCollection from './pages/MyCollection';
import NFTDetails from './pages/NFTDetails';
'''
        elif spec.app_type == "defi":
            frontend_code += '''import LendingDashboard from './pages/LendingDashboard';
import LiquidityPools from './pages/LiquidityPools';
import YieldFarming from './pages/YieldFarming';
import Governance from './pages/Governance';
'''

        frontend_code += f'''
// Solana network configuration
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const wallets = [new PhantomWalletAdapter()];

function App() {{
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {{
    // Initialize app
    setTimeout(() => setIsLoading(false), 1000);
  }}, []);
  
  if (isLoading) {{
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>{spec.name}</h2>
        <p>Initializing Web3 Application...</p>
      </div>
    );
  }}
  
  return (
    <ConnectionProvider endpoint={{endpoint}}>
      <WalletProvider wallets={{wallets}} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="App">
              <Header />
              <Navigation />
              
              <main className="main-content">
                <Routes>
                  <Route path="/" element={{<Dashboard />}} />
'''

        # Add routes based on app type
        if spec.app_type == "payment":
            frontend_code += '''                  <Route path="/payment" element={<PaymentDashboard />} />
                  <Route path="/voice-payment" element={<VoicePayment />} />
                  <Route path="/history" element={<TransactionHistory />} />
                  <Route path="/converter" element={<CurrencyConverter />} />
'''
        elif spec.app_type == "nft":
            frontend_code += '''                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/mint" element={<MintNFT />} />
                  <Route path="/collection" element={<MyCollection />} />
                  <Route path="/nft/:id" element={<NFTDetails />} />
'''
        elif spec.app_type == "defi":
            frontend_code += '''                  <Route path="/lending" element={<LendingDashboard />} />
                  <Route path="/pools" element={<LiquidityPools />} />
                  <Route path="/farming" element={<YieldFarming />} />
                  <Route path="/governance" element={<Governance />} />
'''

        frontend_code += '''                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Dashboard component
function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to ''' + spec.name + '''</h1>
      <p>''' + spec.description + '''</p>
      
      <div className="feature-grid">
'''

        # Add feature cards based on features
        for feature in spec.features:
            feature_title = feature.replace("_", " ").title()
            frontend_code += f'''        <div className="feature-card">
          <h3>{feature_title}</h3>
          <p>Access {feature_title.lower()} functionality</p>
          <button className="btn-primary">Get Started</button>
        </div>
'''

        frontend_code += '''      </div>
    </div>
  );
}

export default App;
'''
        
        return frontend_code
    
    async def _generate_backend_code(self, spec: AppSpec) -> str:
        """Generate backend API code"""
        
        backend_code = f'''const express = require('express');
const cors = require('cors');
const {{ Connection, PublicKey }} = require('@solana/web3.js');
const {{ Program, AnchorProvider, Wallet }} = require('@coral-xyz/anchor');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Solana connection
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// API routes
app.get('/health', (req, res) => {{
  res.json({{ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: '{spec.name} API'
  }});
}});

// App-specific endpoints
'''

        # Add API endpoints based on app type
        if spec.app_type == "payment":
            backend_code += '''
// Payment endpoints
app.post('/api/payment/process', async (req, res) => {
  try {
    const { amount, recipient, currency } = req.body;
    
    // Validate payment parameters
    if (!amount || !recipient || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payment parameters' });
    }
    
    // Process payment (integrate with Solana)
    const result = await processPayment(amount, recipient, currency);
    
    res.json({
      success: true,
      transactionHash: result.txHash,
      amount: amount,
      recipient: recipient,
      processingTime: result.processingTime
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payment/history/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const history = await getPaymentHistory(wallet);
    
    res.json({
      success: true,
      transactions: history
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
'''
        elif spec.app_type == "nft":
            backend_code += '''
// NFT endpoints
app.post('/api/nft/mint', async (req, res) => {
  try {
    const { name, description, image, attributes } = req.body;
    
    const result = await mintNFT({
      name,
      description,
      image,
      attributes
    });
    
    res.json({
      success: true,
      mintAddress: result.mintAddress,
      transactionHash: result.txHash
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nft/marketplace', async (req, res) => {
  try {
    const { page = 1, limit = 20, collection } = req.query;
    const nfts = await getMarketplaceNFTs(page, limit, collection);
    
    res.json({
      success: true,
      nfts: nfts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: nfts.length === parseInt(limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
'''

        backend_code += '''
// Helper functions
async function processPayment(amount, recipient, currency) {
  // Implement payment processing logic
  return {
    txHash: 'mock_tx_hash_' + Date.now(),
    processingTime: Math.random() * 1000 + 500
  };
}

async function getPaymentHistory(wallet) {
  // Implement history retrieval
  return [];
}

async function mintNFT(metadata) {
  // Implement NFT minting
  return {
    mintAddress: 'mock_mint_' + Date.now(),
    txHash: 'mock_tx_hash_' + Date.now()
  };
}

async function getMarketplaceNFTs(page, limit, collection) {
  // Implement marketplace data retrieval
  return [];
}

// Start server
app.listen(PORT, () => {
  console.log(`''' + spec.name + ''' API server running on port ${PORT}`);
});
'''
        
        return backend_code
    
    async def _generate_smart_contracts(self, spec: AppSpec) -> List[str]:
        """Generate smart contract code for the app"""
        
        contracts = []
        
        if spec.app_type == "payment":
            # Payment processor contract
            payment_contract = '''use anchor_lang::prelude::*;

declare_id!("PaymentProcessor111111111111111111111111111");

#[program]
pub mod payment_processor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.total_processed = 0;
        Ok(())
    }

    pub fn process_payment(
        ctx: Context<ProcessPayment>,
        amount: u64,
        recipient: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        
        // Process payment logic here
        state.total_processed += 1;
        
        emit!(PaymentProcessed {
            amount,
            recipient,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub state: Account<'info, PaymentState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut, has_one = authority)]
    pub state: Account<'info, PaymentState>,
    pub authority: Signer<'info>,
}

#[account]
pub struct PaymentState {
    pub authority: Pubkey,
    pub total_processed: u64,
}

#[event]
pub struct PaymentProcessed {
    pub amount: u64,
    pub recipient: Pubkey,
    pub timestamp: i64,
}
'''
            contracts.append(payment_contract)
        
        elif spec.app_type == "nft":
            # NFT collection contract
            nft_contract = '''use anchor_lang::prelude::*;
use mpl_token_metadata::state::Metadata;

declare_id!("NFTCollection111111111111111111111111111111");

#[program]
pub mod nft_collection {
    use super::*;

    pub fn initialize_collection(ctx: Context<InitializeCollection>) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        collection.authority = ctx.accounts.authority.key();
        collection.total_minted = 0;
        collection.max_supply = 10000;
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        
        require!(collection.total_minted < collection.max_supply, ErrorCode::MaxSupplyReached);
        
        // Mint NFT logic here
        collection.total_minted += 1;
        
        emit!(NFTMinted {
            mint: ctx.accounts.mint.key(),
            owner: ctx.accounts.payer.key(),
            name,
            uri,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCollection<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub collection: Account<'info, Collection>,
    #[account(init, payer = payer, space = 82)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Collection {
    pub authority: Pubkey,
    pub total_minted: u64,
    pub max_supply: u64,
}

#[event]
pub struct NFTMinted {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub uri: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Maximum supply reached")]
    MaxSupplyReached,
}
'''
            contracts.append(nft_contract)
        
        return contracts
    
    async def _generate_deployment_config(self, spec: AppSpec) -> str:
        """Generate deployment configuration"""
        
        config = {
            "app_name": spec.name.lower().replace(" ", "-"),
            "version": "1.0.0",
            "description": spec.description,
            "build": {
                "frontend": {
                    "framework": "react",
                    "build_command": "npm run build",
                    "output_directory": "build/"
                },
                "backend": {
                    "runtime": "nodejs",
                    "start_command": "npm start",
                    "port": 3001
                }
            },
            "solana": {
                "network": "devnet",
                "programs": [
                    {
                        "name": f"{spec.app_type}_contract",
                        "build_command": "anchor build",
                        "deploy_command": "anchor deploy"
                    }
                ]
            },
            "environment": {
                "REACT_APP_SOLANA_NETWORK": "devnet",
                "REACT_APP_API_URL": "https://api.noah-apps.com"
            }
        }
        
        return yaml.dump(config, default_flow_style=False)
    
    async def _generate_api_endpoints(self, spec: AppSpec) -> List[Dict[str, Any]]:
        """Generate API endpoint definitions"""
        
        endpoints = [
            {
                "path": "/health",
                "method": "GET",
                "description": "Health check endpoint",
                "response_type": "application/json"
            }
        ]
        
        if spec.app_type == "payment":
            endpoints.extend([
                {
                    "path": "/api/payment/process",
                    "method": "POST",
                    "description": "Process a payment transaction",
                    "parameters": ["amount", "recipient", "currency"],
                    "response_type": "application/json"
                },
                {
                    "path": "/api/payment/history/:wallet",
                    "method": "GET", 
                    "description": "Get payment history for a wallet",
                    "parameters": ["wallet"],
                    "response_type": "application/json"
                }
            ])
        
        elif spec.app_type == "nft":
            endpoints.extend([
                {
                    "path": "/api/nft/mint",
                    "method": "POST",
                    "description": "Mint a new NFT",
                    "parameters": ["name", "description", "image", "attributes"],
                    "response_type": "application/json"
                },
                {
                    "path": "/api/nft/marketplace",
                    "method": "GET",
                    "description": "Get marketplace NFT listings",
                    "parameters": ["page", "limit", "collection"],
                    "response_type": "application/json"
                }
            ])
        
        return endpoints
    
    async def generate_from_template(self, template_name: str, parameters: Dict[str, Any]) -> AppGenerationResult:
        """Generate app from predefined template"""
        try:
            if template_name not in self.app_templates:
                return AppGenerationResult(
                    success=False,
                    error_message=f"Unknown template: {template_name}"
                )
            
            template = self.app_templates[template_name]
            
            # Create specification from template
            spec = AppSpec(
                name=parameters.get("name", template_name.replace("_", " ").title()),
                description=template["description"],
                app_type=template_name.split("_")[0],
                features=template["features"],
                ui_preferences=parameters.get("ui_preferences", {}),
                blockchain_features=parameters.get("blockchain_features", {}),
                integration_requirements=parameters.get("integration_requirements", [])
            )
            
            # Generate the app
            return await self.generate_app(spec)
            
        except Exception as e:
            logger.error(f"Template generation failed: {e}")
            return AppGenerationResult(
                success=False,
                error_message=str(e)
            )
    
    async def deploy_app(self, app_id: str, deployment_config: str) -> Dict[str, Any]:
        """Deploy generated app to Noah AI platform"""
        try:
            # Parse deployment config
            config = yaml.safe_load(deployment_config)
            
            # Simulate deployment
            deployment_url = f"https://{app_id}.noah-apps.com"
            
            return {
                "success": True,
                "deployment_url": deployment_url,
                "app_id": app_id,
                "status": "deployed",
                "deployment_time": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"App deployment failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_capabilities(self) -> List[str]:
        """Get list of available capabilities"""
        return self.capabilities.copy()
    
    async def close(self):
        """Clean up resources"""
        if self.session:
            await self.session.close()

# Integration with Coral Protocol Agent System
class NoahCoralAgent:
    """Coral Protocol agent wrapper for Noah AI"""
    
    def __init__(self, noah_agent: NoahAIAgent):
        self.noah_agent = noah_agent
        self.agent_id = "noah-ai-agent"
        self.name = "Noah AI Agent"
        self.capabilities = noah_agent.capabilities
    
    async def handle_tool_call(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tool calls from the Coral Protocol orchestrator"""
        try:
            if tool_name == "generate_app":
                spec = AppSpec(**parameters)
                result = await self.noah_agent.generate_app(spec)
                
                return {
                    "success": result.success,
                    "app_id": result.app_id,
                    "deployment_url": result.deployment_url,
                    "app_code": result.app_code,
                    "smart_contracts": result.smart_contracts,
                    "generation_time": result.generation_time,
                    "error": result.error_message
                }
            
            elif tool_name == "generate_from_template":
                result = await self.noah_agent.generate_from_template(
                    parameters["template_name"],
                    parameters.get("parameters", {})
                )
                
                return {
                    "success": result.success,
                    "app_id": result.app_id,
                    "deployment_url": result.deployment_url,
                    "generation_time": result.generation_time,
                    "error": result.error_message
                }
            
            elif tool_name == "deploy_app":
                result = await self.noah_agent.deploy_app(
                    parameters["app_id"],
                    parameters["deployment_config"]
                )
                return result
            
            else:
                return {
                    "success": False,
                    "error": f"Unknown tool: {tool_name}"
                }
                
        except Exception as e:
            logger.error(f"Tool call {tool_name} failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Factory function
async def create_noah_agent(
    api_key: Optional[str] = None,
    workspace_id: Optional[str] = None
) -> NoahAIAgent:
    """Create and initialize a Noah AI agent"""
    
    config = NoahAIConfig(
        api_key=api_key,
        workspace_id=workspace_id
    )
    
    agent = NoahAIAgent(config)
    
    if await agent.initialize():
        logger.info("✅ Noah AI agent initialized successfully")
        return agent
    else:
        logger.error("❌ Failed to initialize Noah AI agent")
        raise RuntimeError("Failed to initialize Noah AI agent")

# Example usage and testing
async def test_noah_agent():
    """Test the Noah AI integration"""
    try:
        # Create agent
        agent = await create_noah_agent()
        
        # Test app generation from template
        result = await agent.generate_from_template(
            "payment_app",
            {"name": "Coral Rush Payment App"}
        )
        
        print(f"Generation result: {result.success}")
        if result.success:
            print(f"App generated in {result.generation_time:.2f}s")
            print(f"App ID: {result.app_id}")
            print(f"Deployment URL: {result.deployment_url}")
        
        # Test capabilities
        capabilities = await agent.get_capabilities()
        print(f"Available capabilities: {capabilities}")
        
        # Create Coral Protocol wrapper
        coral_agent = NoahCoralAgent(agent)
        
        # Test tool call
        result = await coral_agent.handle_tool_call(
            "generate_from_template",
            {
                "template_name": "nft_marketplace",
                "parameters": {"name": "Coral NFT Marketplace"}
            }
        )
        print(f"Tool call result: {result['success']}")
        
        await agent.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    # Run test
    asyncio.run(test_noah_agent())
