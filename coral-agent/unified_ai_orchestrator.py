#!/usr/bin/env python3
"""
Unified AI Orchestrator
Manages and coordinates all AI frameworks integrated into the Coral Protocol system:
- Solana Agent Kit
- Código AI  
- Noah AI
- Rig Framework
- ZerePy
- Eliza Framework
"""

import asyncio
import json
import logging
import os
from typing import Dict, Any, Optional, List, Union
from dataclasses import dataclass, field
from datetime import datetime
import aiohttp
from enum import Enum

# Import all integrated frameworks
from solana_agent_kit_integration import SolanaAgentKit, SolanaCoralAgent, create_solana_agent
from codigo_ai_integration import CodigoAIAgent, CodigoCoralAgent, create_codigo_agent
from noah_ai_integration import NoahAIAgent, NoahCoralAgent, create_noah_agent
from rig_framework_integration import RigFrameworkAgent, RigCoralAgent, create_rig_agent
from zerepy_integration import ZerePyAgent, ZerePyCoralAgent, create_zerepy_agent
from eliza_framework_integration import ElizaFrameworkAgent, ElizaCoralAgent, create_eliza_agent

logger = logging.getLogger(__name__)

class AIFramework(Enum):
    """Available AI frameworks"""
    SOLANA_AGENT_KIT = "solana_agent_kit"
    CODIGO_AI = "codigo_ai"
    NOAH_AI = "noah_ai"
    RIG_FRAMEWORK = "rig_framework"
    ZEREPY = "zerepy"
    ELIZA_FRAMEWORK = "eliza_framework"

@dataclass
class OrchestratorConfig:
    """Configuration for the Unified AI Orchestrator"""
    # Framework configurations
    solana_agent_config: Dict[str, Any] = field(default_factory=dict)
    codigo_ai_config: Dict[str, Any] = field(default_factory=dict)
    noah_ai_config: Dict[str, Any] = field(default_factory=dict)
    rig_framework_config: Dict[str, Any] = field(default_factory=dict)
    zerepy_config: Dict[str, Any] = field(default_factory=dict)
    eliza_framework_config: Dict[str, Any] = field(default_factory=dict)
    
    # Orchestration settings
    max_concurrent_operations: int = 20
    operation_timeout: int = 300
    enable_cross_framework_coordination: bool = True
    enable_performance_monitoring: bool = True
    enable_auto_scaling: bool = False

@dataclass
class AIOperation:
    """Represents an AI operation request"""
    operation_id: str
    framework: AIFramework
    operation_type: str
    parameters: Dict[str, Any]
    priority: int = 5  # 1-10, 10 being highest
    created_at: datetime = field(default_factory=datetime.now)
    timeout: Optional[int] = None
    dependencies: List[str] = field(default_factory=list)
    callback_url: Optional[str] = None

@dataclass
class AIOperationResult:
    """Result of an AI operation"""
    operation_id: str
    framework: AIFramework
    success: bool
    result: Optional[Any] = None
    error_message: Optional[str] = None
    execution_time: float = 0.0
    completed_at: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

class UnifiedAIOrchestrator:
    """Unified orchestrator for all AI frameworks"""
    
    def __init__(self, config: OrchestratorConfig):
        self.config = config
        self.frameworks: Dict[AIFramework, Any] = {}
        self.coral_agents: Dict[AIFramework, Any] = {}
        self.operation_queue: List[AIOperation] = []
        self.active_operations: Dict[str, AIOperation] = {}
        self.operation_results: Dict[str, AIOperationResult] = {}
        self.performance_metrics: Dict[str, Any] = {}
        self.session = None
        
        # Framework capabilities mapping
        self.framework_capabilities = {
            AIFramework.SOLANA_AGENT_KIT: [
                "blockchain_operations",
                "token_transfers", 
                "nft_minting",
                "defi_interactions",
                "wallet_management"
            ],
            AIFramework.CODIGO_AI: [
                "smart_contract_generation",
                "contract_optimization",
                "contract_auditing",
                "anchor_program_development",
                "solana_program_deployment"
            ],
            AIFramework.NOAH_AI: [
                "no_code_app_development",
                "dapp_generation",
                "ui_creation",
                "rapid_prototyping",
                "web3_app_deployment"
            ],
            AIFramework.RIG_FRAMEWORK: [
                "modular_agent_building",
                "agent_pipeline_creation",
                "rust_agent_development",
                "multi_model_coordination",
                "agent_workflow_management"
            ],
            AIFramework.ZEREPY: [
                "autonomous_agent_deployment",
                "multi_platform_coordination",
                "social_media_automation",
                "cross_platform_operations",
                "autonomous_task_execution"
            ],
            AIFramework.ELIZA_FRAMEWORK: [
                "conversational_ai",
                "web3_conversation",
                "natural_language_processing",
                "voice_interaction",
                "contextual_assistance"
            ]
        }
        
        # Cross-framework workflows
        self.workflows = {
            "complete_dapp_development": {
                "description": "End-to-end DApp development from conversation to deployment",
                "frameworks": [
                    AIFramework.ELIZA_FRAMEWORK,  # Gather requirements
                    AIFramework.CODIGO_AI,        # Generate smart contracts
                    AIFramework.NOAH_AI,          # Create frontend
                    AIFramework.SOLANA_AGENT_KIT, # Deploy and test
                    AIFramework.ZEREPY           # Set up automation
                ],
                "coordination_type": "sequential"
            },
            "voice_to_payment_with_verification": {
                "description": "Voice-activated payment with AI verification and deployment",
                "frameworks": [
                    AIFramework.ELIZA_FRAMEWORK,    # Process voice input
                    AIFramework.SOLANA_AGENT_KIT,   # Execute payment
                    AIFramework.CODIGO_AI,          # Generate verification contract
                    AIFramework.RIG_FRAMEWORK       # Create monitoring agent
                ],
                "coordination_type": "parallel_then_sequential"
            },
            "autonomous_trading_setup": {
                "description": "Set up autonomous trading system with monitoring",
                "frameworks": [
                    AIFramework.RIG_FRAMEWORK,       # Create trading agent
                    AIFramework.CODIGO_AI,           # Generate trading contracts
                    AIFramework.ZEREPY,              # Deploy autonomous execution
                    AIFramework.ELIZA_FRAMEWORK      # Create user interface
                ],
                "coordination_type": "parallel"
            },
            "nft_marketplace_creation": {
                "description": "Complete NFT marketplace with AI curation",
                "frameworks": [
                    AIFramework.NOAH_AI,             # Generate marketplace UI
                    AIFramework.CODIGO_AI,           # Create NFT contracts
                    AIFramework.SOLANA_AGENT_KIT,    # Handle minting/trading
                    AIFramework.RIG_FRAMEWORK,       # Create curation agents
                    AIFramework.ELIZA_FRAMEWORK      # User support interface
                ],
                "coordination_type": "mixed"
            }
        }
    
    async def initialize(self):
        """Initialize all AI frameworks"""
        try:
            self.session = aiohttp.ClientSession()
            
            logger.info("🚀 Initializing Unified AI Orchestrator...")
            
            # Initialize each framework
            await self._initialize_solana_agent_kit()
            await self._initialize_codigo_ai()
            await self._initialize_noah_ai()
            await self._initialize_rig_framework()
            await self._initialize_zerepy()
            await self._initialize_eliza_framework()
            
            # Start background tasks
            asyncio.create_task(self._operation_processor())
            asyncio.create_task(self._performance_monitor())
            
            logger.info("✅ Unified AI Orchestrator initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Unified AI Orchestrator: {e}")
            return False
    
    async def _initialize_solana_agent_kit(self):
        """Initialize Solana Agent Kit"""
        try:
            config = self.config.solana_agent_config
            agent = await create_solana_agent(
                rpc_url=config.get("rpc_url", "https://api.devnet.solana.com"),
                private_key=config.get("private_key"),
                network=config.get("network", "devnet")
            )
            
            self.frameworks[AIFramework.SOLANA_AGENT_KIT] = agent
            self.coral_agents[AIFramework.SOLANA_AGENT_KIT] = SolanaCoralAgent(agent)
            
            logger.info("✅ Solana Agent Kit initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize Solana Agent Kit: {e}")
    
    async def _initialize_codigo_ai(self):
        """Initialize Código AI"""
        try:
            config = self.config.codigo_ai_config
            agent = await create_codigo_agent(
                api_key=config.get("api_key"),
                workspace_id=config.get("workspace_id")
            )
            
            self.frameworks[AIFramework.CODIGO_AI] = agent
            self.coral_agents[AIFramework.CODIGO_AI] = CodigoCoralAgent(agent)
            
            logger.info("✅ Código AI initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize Código AI: {e}")
    
    async def _initialize_noah_ai(self):
        """Initialize Noah AI"""
        try:
            config = self.config.noah_ai_config
            agent = await create_noah_agent(
                api_key=config.get("api_key"),
                workspace_id=config.get("workspace_id")
            )
            
            self.frameworks[AIFramework.NOAH_AI] = agent
            self.coral_agents[AIFramework.NOAH_AI] = NoahCoralAgent(agent)
            
            logger.info("✅ Noah AI initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize Noah AI: {e}")
    
    async def _initialize_rig_framework(self):
        """Initialize Rig Framework"""
        try:
            config = self.config.rig_framework_config
            agent = await create_rig_agent(
                workspace_path=config.get("workspace_path", "./rig_workspace"),
                rig_binary_path=config.get("rig_binary_path", "rig")
            )
            
            self.frameworks[AIFramework.RIG_FRAMEWORK] = agent
            self.coral_agents[AIFramework.RIG_FRAMEWORK] = RigCoralAgent(agent)
            
            logger.info("✅ Rig Framework initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize Rig Framework: {e}")
    
    async def _initialize_zerepy(self):
        """Initialize ZerePy"""
        try:
            config = self.config.zerepy_config
            agent = await create_zerepy_agent(
                workspace_path=config.get("workspace_path", "./zerepy_workspace")
            )
            
            self.frameworks[AIFramework.ZEREPY] = agent
            self.coral_agents[AIFramework.ZEREPY] = ZerePyCoralAgent(agent)
            
            logger.info("✅ ZerePy initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize ZerePy: {e}")
    
    async def _initialize_eliza_framework(self):
        """Initialize Eliza Framework"""
        try:
            config = self.config.eliza_framework_config
            agent = await create_eliza_agent(
                personality_name=config.get("personality_name", "Web3 Assistant"),
                openai_api_key=config.get("openai_api_key"),
                anthropic_api_key=config.get("anthropic_api_key")
            )
            
            self.frameworks[AIFramework.ELIZA_FRAMEWORK] = agent
            self.coral_agents[AIFramework.ELIZA_FRAMEWORK] = ElizaCoralAgent(agent)
            
            logger.info("✅ Eliza Framework initialized")
            
        except Exception as e:
            logger.warning(f"Failed to initialize Eliza Framework: {e}")
    
    async def execute_operation(self, operation: AIOperation) -> AIOperationResult:
        """Execute a single AI operation"""
        start_time = datetime.now()
        
        try:
            # Check if framework is available
            if operation.framework not in self.coral_agents:
                return AIOperationResult(
                    operation_id=operation.operation_id,
                    framework=operation.framework,
                    success=False,
                    error_message=f"Framework {operation.framework.value} not available",
                    execution_time=0.0
                )
            
            # Get the appropriate coral agent
            coral_agent = self.coral_agents[operation.framework]
            
            # Execute the operation
            result = await coral_agent.handle_tool_call(
                operation.operation_type,
                operation.parameters
            )
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Create result
            operation_result = AIOperationResult(
                operation_id=operation.operation_id,
                framework=operation.framework,
                success=result.get("success", False),
                result=result,
                error_message=result.get("error"),
                execution_time=execution_time,
                metadata={
                    "priority": operation.priority,
                    "parameters": operation.parameters
                }
            )
            
            # Store result
            self.operation_results[operation.operation_id] = operation_result
            
            # Update performance metrics
            await self._update_performance_metrics(operation.framework, execution_time, result.get("success", False))
            
            logger.info(f"✅ Operation {operation.operation_id} completed successfully")
            
            return operation_result
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"❌ Operation {operation.operation_id} failed: {e}")
            
            return AIOperationResult(
                operation_id=operation.operation_id,
                framework=operation.framework,
                success=False,
                error_message=str(e),
                execution_time=execution_time
            )
    
    async def execute_workflow(self, workflow_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a cross-framework workflow"""
        start_time = datetime.now()
        
        try:
            if workflow_name not in self.workflows:
                return {
                    "success": False,
                    "error": f"Unknown workflow: {workflow_name}"
                }
            
            workflow = self.workflows[workflow_name]
            frameworks = workflow["frameworks"]
            coordination_type = workflow["coordination_type"]
            
            logger.info(f"🔄 Starting workflow: {workflow_name}")
            
            workflow_id = f"workflow_{int(datetime.now().timestamp())}"
            results = {}
            
            if coordination_type == "sequential":
                # Execute frameworks in sequence
                for i, framework in enumerate(frameworks):
                    operation_id = f"{workflow_id}_step_{i}"
                    
                    # Determine operation type based on framework and step
                    operation_type, step_parameters = self._determine_workflow_step(
                        framework, i, parameters, results
                    )
                    
                    operation = AIOperation(
                        operation_id=operation_id,
                        framework=framework,
                        operation_type=operation_type,
                        parameters=step_parameters,
                        priority=10  # High priority for workflow operations
                    )
                    
                    result = await self.execute_operation(operation)
                    results[framework.value] = result
                    
                    if not result.success:
                        return {
                            "success": False,
                            "workflow_id": workflow_id,
                            "failed_at_step": i,
                            "failed_framework": framework.value,
                            "error": result.error_message,
                            "partial_results": results
                        }
            
            elif coordination_type == "parallel":
                # Execute all frameworks in parallel
                tasks = []
                for i, framework in enumerate(frameworks):
                    operation_id = f"{workflow_id}_parallel_{i}"
                    
                    operation_type, step_parameters = self._determine_workflow_step(
                        framework, i, parameters, {}
                    )
                    
                    operation = AIOperation(
                        operation_id=operation_id,
                        framework=framework,
                        operation_type=operation_type,
                        parameters=step_parameters,
                        priority=10
                    )
                    
                    task = asyncio.create_task(self.execute_operation(operation))
                    tasks.append((framework, task))
                
                # Wait for all tasks to complete
                for framework, task in tasks:
                    result = await task
                    results[framework.value] = result
            
            elif coordination_type == "mixed":
                # Custom coordination logic for complex workflows
                results = await self._execute_mixed_workflow(workflow_id, frameworks, parameters)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Check overall success
            overall_success = all(result.success for result in results.values() if hasattr(result, 'success'))
            
            return {
                "success": overall_success,
                "workflow_id": workflow_id,
                "workflow_name": workflow_name,
                "execution_time": execution_time,
                "results": {k: v.result if hasattr(v, 'result') else v for k, v in results.items()},
                "framework_results": results
            }
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"❌ Workflow {workflow_name} failed: {e}")
            
            return {
                "success": False,
                "workflow_name": workflow_name,
                "error": str(e),
                "execution_time": execution_time
            }
    
    def _determine_workflow_step(self, framework: AIFramework, step_index: int, 
                                parameters: Dict[str, Any], previous_results: Dict[str, Any]) -> tuple:
        """Determine operation type and parameters for a workflow step"""
        
        if framework == AIFramework.ELIZA_FRAMEWORK:
            if "user_message" in parameters:
                return "process_message", {
                    "session_id": parameters.get("session_id", "workflow_session"),
                    "message": parameters["user_message"]
                }
            else:
                return "start_conversation", {
                    "session_id": parameters.get("session_id", "workflow_session")
                }
        
        elif framework == AIFramework.SOLANA_AGENT_KIT:
            if "payment_amount" in parameters:
                return "transfer_sol", {
                    "to_address": parameters["recipient_address"],
                    "amount": parameters["payment_amount"]
                }
            else:
                return "get_balance", {}
        
        elif framework == AIFramework.CODIGO_AI:
            return "generate_from_template", {
                "template_name": parameters.get("contract_template", "payment_processor"),
                "parameters": {
                    "name": parameters.get("contract_name", "Generated Contract")
                }
            }
        
        elif framework == AIFramework.NOAH_AI:
            return "generate_from_template", {
                "template_name": parameters.get("app_template", "payment_app"),
                "parameters": {
                    "name": parameters.get("app_name", "Generated DApp")
                }
            }
        
        elif framework == AIFramework.RIG_FRAMEWORK:
            return "create_from_template", {
                "template_name": parameters.get("agent_template", "payment_processor"),
                "parameters": {
                    "name": parameters.get("agent_name", "Generated Agent")
                }
            }
        
        elif framework == AIFramework.ZEREPY:
            return "create_from_template", {
                "template_name": parameters.get("autonomous_template", "trading_bot"),
                "parameters": {
                    "name": parameters.get("bot_name", "Generated Bot")
                }
            }
        
        else:
            return "unknown_operation", parameters
    
    async def _execute_mixed_workflow(self, workflow_id: str, frameworks: List[AIFramework], 
                                    parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute mixed coordination workflow with custom logic"""
        
        results = {}
        
        # Example: NFT marketplace creation workflow
        # Phase 1: UI Generation (Noah AI) and Contract Generation (Código AI) in parallel
        phase1_tasks = []
        
        if AIFramework.NOAH_AI in frameworks:
            operation = AIOperation(
                operation_id=f"{workflow_id}_noah_ui",
                framework=AIFramework.NOAH_AI,
                operation_type="generate_from_template",
                parameters={
                    "template_name": "nft_marketplace",
                    "parameters": {"name": "AI Generated NFT Marketplace"}
                },
                priority=10
            )
            phase1_tasks.append(("noah_ai", self.execute_operation(operation)))
        
        if AIFramework.CODIGO_AI in frameworks:
            operation = AIOperation(
                operation_id=f"{workflow_id}_codigo_contracts",
                framework=AIFramework.CODIGO_AI,
                operation_type="generate_from_template",
                parameters={
                    "template_name": "nft_collection",
                    "parameters": {"name": "AI Generated NFT Collection"}
                },
                priority=10
            )
            phase1_tasks.append(("codigo_ai", self.execute_operation(operation)))
        
        # Execute Phase 1 in parallel
        for name, task in phase1_tasks:
            results[name] = await task
        
        # Phase 2: Deploy contracts and set up blockchain operations
        if AIFramework.SOLANA_AGENT_KIT in frameworks and results.get("codigo_ai", {}).success:
            operation = AIOperation(
                operation_id=f"{workflow_id}_solana_deploy",
                framework=AIFramework.SOLANA_AGENT_KIT,
                operation_type="create_token",
                parameters={
                    "name": "Marketplace Token",
                    "symbol": "MKT",
                    "supply": 1000000
                },
                priority=10
            )
            results["solana_agent_kit"] = await self.execute_operation(operation)
        
        # Phase 3: Set up automation and user interface
        phase3_tasks = []
        
        if AIFramework.RIG_FRAMEWORK in frameworks:
            operation = AIOperation(
                operation_id=f"{workflow_id}_rig_curation",
                framework=AIFramework.RIG_FRAMEWORK,
                operation_type="create_from_template",
                parameters={
                    "template_name": "nft_curator",
                    "parameters": {"name": "AI NFT Curator"}
                },
                priority=10
            )
            phase3_tasks.append(("rig_framework", self.execute_operation(operation)))
        
        if AIFramework.ELIZA_FRAMEWORK in frameworks:
            operation = AIOperation(
                operation_id=f"{workflow_id}_eliza_support",
                framework=AIFramework.ELIZA_FRAMEWORK,
                operation_type="start_conversation",
                parameters={"session_id": f"{workflow_id}_support"}
                ,
                priority=10
            )
            phase3_tasks.append(("eliza_framework", self.execute_operation(operation)))
        
        # Execute Phase 3 in parallel
        for name, task in phase3_tasks:
            results[name] = await task
        
        return results
    
    async def _operation_processor(self):
        """Background task to process queued operations"""
        while True:
            try:
                if self.operation_queue and len(self.active_operations) < self.config.max_concurrent_operations:
                    # Sort operations by priority
                    self.operation_queue.sort(key=lambda op: op.priority, reverse=True)
                    
                    # Get highest priority operation
                    operation = self.operation_queue.pop(0)
                    
                    # Add to active operations
                    self.active_operations[operation.operation_id] = operation
                    
                    # Execute operation asynchronously
                    asyncio.create_task(self._execute_and_cleanup(operation))
                
                await asyncio.sleep(0.1)  # Small delay to prevent busy waiting
                
            except Exception as e:
                logger.error(f"Error in operation processor: {e}")
                await asyncio.sleep(1)
    
    async def _execute_and_cleanup(self, operation: AIOperation):
        """Execute operation and clean up"""
        try:
            result = await self.execute_operation(operation)
            
            # Remove from active operations
            if operation.operation_id in self.active_operations:
                del self.active_operations[operation.operation_id]
            
            # Call callback if provided
            if operation.callback_url and result.success:
                await self._call_callback(operation.callback_url, result)
                
        except Exception as e:
            logger.error(f"Error executing operation {operation.operation_id}: {e}")
            
            # Clean up even on error
            if operation.operation_id in self.active_operations:
                del self.active_operations[operation.operation_id]
    
    async def _call_callback(self, callback_url: str, result: AIOperationResult):
        """Call callback URL with operation result"""
        try:
            async with self.session.post(
                callback_url,
                json={
                    "operation_id": result.operation_id,
                    "success": result.success,
                    "result": result.result,
                    "execution_time": result.execution_time
                }
            ) as response:
                if response.status == 200:
                    logger.info(f"✅ Callback successful for operation {result.operation_id}")
                else:
                    logger.warning(f"⚠️ Callback failed for operation {result.operation_id}: {response.status}")
                    
        except Exception as e:
            logger.error(f"❌ Callback error for operation {result.operation_id}: {e}")
    
    async def _update_performance_metrics(self, framework: AIFramework, execution_time: float, success: bool):
        """Update performance metrics for a framework"""
        
        if framework.value not in self.performance_metrics:
            self.performance_metrics[framework.value] = {
                "total_operations": 0,
                "successful_operations": 0,
                "failed_operations": 0,
                "total_execution_time": 0.0,
                "average_execution_time": 0.0,
                "last_operation_time": None
            }
        
        metrics = self.performance_metrics[framework.value]
        metrics["total_operations"] += 1
        metrics["total_execution_time"] += execution_time
        metrics["average_execution_time"] = metrics["total_execution_time"] / metrics["total_operations"]
        metrics["last_operation_time"] = datetime.now().isoformat()
        
        if success:
            metrics["successful_operations"] += 1
        else:
            metrics["failed_operations"] += 1
    
    async def _performance_monitor(self):
        """Background task to monitor performance"""
        while True:
            try:
                if self.config.enable_performance_monitoring:
                    # Log performance summary every 5 minutes
                    logger.info("📊 Performance Summary:")
                    for framework, metrics in self.performance_metrics.items():
                        success_rate = (metrics["successful_operations"] / metrics["total_operations"] * 100) if metrics["total_operations"] > 0 else 0
                        logger.info(f"  {framework}: {metrics['total_operations']} ops, {success_rate:.1f}% success, {metrics['average_execution_time']:.2f}s avg")
                
                await asyncio.sleep(300)  # 5 minutes
                
            except Exception as e:
                logger.error(f"Error in performance monitor: {e}")
                await asyncio.sleep(60)
    
    async def queue_operation(self, operation: AIOperation):
        """Queue an operation for execution"""
        self.operation_queue.append(operation)
        logger.info(f"📥 Operation {operation.operation_id} queued for {operation.framework.value}")
    
    async def get_operation_result(self, operation_id: str) -> Optional[AIOperationResult]:
        """Get the result of a completed operation"""
        return self.operation_results.get(operation_id)
    
    async def get_framework_status(self) -> Dict[str, Any]:
        """Get status of all frameworks"""
        status = {}
        
        for framework in AIFramework:
            is_available = framework in self.coral_agents
            capabilities = self.framework_capabilities.get(framework, [])
            metrics = self.performance_metrics.get(framework.value, {})
            
            status[framework.value] = {
                "available": is_available,
                "capabilities": capabilities,
                "performance_metrics": metrics
            }
        
        return {
            "frameworks": status,
            "active_operations": len(self.active_operations),
            "queued_operations": len(self.operation_queue),
            "total_results": len(self.operation_results)
        }
    
    async def get_available_workflows(self) -> Dict[str, Any]:
        """Get available cross-framework workflows"""
        return {
            "workflows": {
                name: {
                    "description": workflow["description"],
                    "frameworks": [f.value for f in workflow["frameworks"]],
                    "coordination_type": workflow["coordination_type"]
                }
                for name, workflow in self.workflows.items()
            }
        }
    
    async def close(self):
        """Clean up resources"""
        if self.session:
            await self.session.close()
        
        # Close all framework agents
        for framework, agent in self.frameworks.items():
            if hasattr(agent, 'close'):
                try:
                    await agent.close()
                except:
                    pass

# Factory function
async def create_unified_orchestrator(
    config: Optional[OrchestratorConfig] = None
) -> UnifiedAIOrchestrator:
    """Create and initialize the Unified AI Orchestrator"""
    
    if config is None:
        config = OrchestratorConfig()
    
    orchestrator = UnifiedAIOrchestrator(config)
    
    if await orchestrator.initialize():
        logger.info("✅ Unified AI Orchestrator created successfully")
        return orchestrator
    else:
        logger.error("❌ Failed to create Unified AI Orchestrator")
        raise RuntimeError("Failed to create Unified AI Orchestrator")

# Example usage and testing
async def test_unified_orchestrator():
    """Test the Unified AI Orchestrator"""
    try:
        # Create orchestrator
        config = OrchestratorConfig()
        orchestrator = await create_unified_orchestrator(config)
        
        # Test framework status
        status = await orchestrator.get_framework_status()
        print(f"Framework Status: {json.dumps(status, indent=2)}")
        
        # Test available workflows
        workflows = await orchestrator.get_available_workflows()
        print(f"Available Workflows: {json.dumps(workflows, indent=2)}")
        
        # Test simple operation
        operation = AIOperation(
            operation_id="test_op_001",
            framework=AIFramework.ELIZA_FRAMEWORK,
            operation_type="start_conversation",
            parameters={"session_id": "test_session"}
        )
        
        result = await orchestrator.execute_operation(operation)
        print(f"Operation Result: Success={result.success}, Time={result.execution_time:.2f}s")
        
        # Test workflow execution
        workflow_result = await orchestrator.execute_workflow(
            "voice_to_payment_with_verification",
            {
                "user_message": "Send $100 to Philippines",
                "session_id": "workflow_test",
                "recipient_address": "test_address_123",
                "payment_amount": 100
            }
        )
        
        print(f"Workflow Result: {json.dumps(workflow_result, indent=2, default=str)}")
        
        await orchestrator.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Run test
    asyncio.run(test_unified_orchestrator())
