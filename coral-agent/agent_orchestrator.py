#!/usr/bin/env python3
"""
Coral Protocol Agent Orchestrator
Manages and coordinates multiple agents for complex workflows.
Built for the Coral Protocol Agent Registry.
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import uuid
import aiohttp
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentStatus(Enum):
    IDLE = "idle"
    PROCESSING = "processing"
    SUCCESS = "success"
    ERROR = "error"
    OFFLINE = "offline"

@dataclass
class AgentInfo:
    """Agent information structure"""
    agent_id: str
    name: str
    version: str
    capabilities: List[str]
    description: str
    endpoint: str
    status: AgentStatus = AgentStatus.IDLE
    last_heartbeat: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    current_task: Optional[str] = None

@dataclass
class WorkflowStep:
    """Workflow step definition"""
    step_id: str
    agent_id: str
    tool_name: str
    parameters: Dict[str, Any]
    depends_on: List[str] = None
    timeout: int = 30
    retry_count: int = 0
    max_retries: int = 3

@dataclass
class WorkflowExecution:
    """Workflow execution tracking"""
    execution_id: str
    workflow_name: str
    steps: List[WorkflowStep]
    status: str = "running"
    current_step: int = 0
    results: Dict[str, Any] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    error_message: Optional[str] = None

class CoralAgentOrchestrator:
    """
    Coral Protocol Agent Orchestrator
    
    Manages multiple agents and coordinates complex workflows
    with real-time monitoring and error handling.
    """
    
    def __init__(self):
        self.registered_agents: Dict[str, AgentInfo] = {}
        self.active_workflows: Dict[str, WorkflowExecution] = {}
        self.workflow_definitions: Dict[str, Dict] = {}
        
        # Initialize workflow definitions
        self.initialize_workflows()
        
        # Start background tasks
        asyncio.create_task(self.agent_health_monitor())
        asyncio.create_task(self.workflow_monitor())
    
    def initialize_workflows(self):
        """Initialize predefined workflows"""
        self.workflow_definitions = {
            "voice_payment_workflow": {
                "description": "Complete voice-to-payment workflow",
                "steps": [
                    {
                        "step_id": "voice_processing",
                        "agent_id": "voice-listener-agent",
                        "tool_name": "transcribe_speech",
                        "parameters": {},
                        "timeout": 10
                    },
                    {
                        "step_id": "intent_analysis",
                        "agent_id": "brain-agent",
                        "tool_name": "analyze_support_query",
                        "parameters": {},
                        "depends_on": ["voice_processing"],
                        "timeout": 15
                    },
                    {
                        "step_id": "fraud_detection",
                        "agent_id": "fraud-detection-agent",
                        "tool_name": "detect_fraud",
                        "parameters": {},
                        "depends_on": ["intent_analysis"],
                        "timeout": 5
                    },
                    {
                        "step_id": "payment_processing",
                        "agent_id": "payment-agent",
                        "tool_name": "process_payment",
                        "parameters": {},
                        "depends_on": ["fraud_detection"],
                        "timeout": 30
                    }
                ]
            },
            "support_workflow": {
                "description": "Web3 support workflow",
                "steps": [
                    {
                        "step_id": "query_analysis",
                        "agent_id": "brain-agent",
                        "tool_name": "analyze_support_query",
                        "parameters": {},
                        "timeout": 15
                    },
                    {
                        "step_id": "transaction_check",
                        "agent_id": "executor-agent",
                        "tool_name": "check_transaction_status",
                        "parameters": {},
                        "depends_on": ["query_analysis"],
                        "timeout": 10
                    },
                    {
                        "step_id": "nft_compensation",
                        "agent_id": "executor-agent",
                        "tool_name": "mint_compensation_nft",
                        "parameters": {},
                        "depends_on": ["transaction_check"],
                        "timeout": 20
                    }
                ]
            },
            "fraud_investigation_workflow": {
                "description": "Comprehensive fraud investigation",
                "steps": [
                    {
                        "step_id": "initial_analysis",
                        "agent_id": "fraud-detection-agent",
                        "tool_name": "detect_fraud",
                        "parameters": {},
                        "timeout": 5
                    },
                    {
                        "step_id": "deep_analysis",
                        "agent_id": "fraud-detection-agent",
                        "tool_name": "deep_fraud_analysis",
                        "parameters": {},
                        "depends_on": ["initial_analysis"],
                        "timeout": 10
                    },
                    {
                        "step_id": "risk_assessment",
                        "agent_id": "fraud-detection-agent",
                        "tool_name": "assess_risk",
                        "parameters": {},
                        "depends_on": ["deep_analysis"],
                        "timeout": 5
                    }
                ]
            }
        }
    
    async def register_agent(self, agent_data: Dict[str, Any]) -> bool:
        """Register a new agent"""
        try:
            agent_info = AgentInfo(
                agent_id=agent_data.get("agent_id", str(uuid.uuid4())),
                name=agent_data.get("name", "Unknown Agent"),
                version=agent_data.get("version", "1.0.0"),
                capabilities=agent_data.get("capabilities", []),
                description=agent_data.get("description", ""),
                endpoint=agent_data.get("endpoint", ""),
                status=AgentStatus.IDLE,
                last_heartbeat=datetime.now().isoformat()
            )
            
            self.registered_agents[agent_info.agent_id] = agent_info
            logger.info(f"Agent registered: {agent_info.name} ({agent_info.agent_id})")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to register agent: {e}")
            return False
    
    async def unregister_agent(self, agent_id: str) -> bool:
        """Unregister an agent"""
        if agent_id in self.registered_agents:
            agent_name = self.registered_agents[agent_id].name
            del self.registered_agents[agent_id]
            logger.info(f"Agent unregistered: {agent_name} ({agent_id})")
            return True
        return False
    
    async def update_agent_heartbeat(self, agent_id: str) -> bool:
        """Update agent heartbeat"""
        if agent_id in self.registered_agents:
            self.registered_agents[agent_id].last_heartbeat = datetime.now().isoformat()
            return True
        return False
    
    async def get_agent_status(self, agent_id: str) -> Optional[AgentInfo]:
        """Get agent status"""
        return self.registered_agents.get(agent_id)
    
    async def list_agents(self) -> List[AgentInfo]:
        """List all registered agents"""
        return list(self.registered_agents.values())
    
    async def discover_agents_by_capability(self, capability: str) -> List[AgentInfo]:
        """Discover agents by capability"""
        matching_agents = []
        for agent in self.registered_agents.values():
            if capability in agent.capabilities:
                matching_agents.append(agent)
        return matching_agents
    
    async def execute_workflow(self, workflow_name: str, parameters: Dict[str, Any]) -> str:
        """Execute a workflow"""
        if workflow_name not in self.workflow_definitions:
            raise ValueError(f"Workflow {workflow_name} not found")
        
        try:
            execution_id = str(uuid.uuid4())
            workflow_config = self.workflow_definitions[workflow_name]
            
            # Create workflow steps
            steps = []
            for step_config in workflow_config["steps"]:
                step = WorkflowStep(
                    step_id=step_config["step_id"],
                    agent_id=step_config["agent_id"],
                    tool_name=step_config["tool_name"],
                    parameters=step_config.get("parameters", {}),
                    depends_on=step_config.get("depends_on", []),
                    timeout=step_config.get("timeout", 30),
                    max_retries=step_config.get("max_retries", 3)
                )
                steps.append(step)
            
            # Create execution
            execution = WorkflowExecution(
                execution_id=execution_id,
                workflow_name=workflow_name,
                steps=steps,
                status="running",
                start_time=datetime.now().isoformat(),
                results={}
            )
            
            self.active_workflows[execution_id] = execution
            
            # Start workflow execution
            asyncio.create_task(self.execute_workflow_steps(execution, parameters))
            
            logger.info(f"Workflow execution started: {workflow_name} ({execution_id})")
            
            return execution_id
            
        except Exception as e:
            logger.error(f"Failed to execute workflow: {e}")
            raise
    
    async def execute_workflow_steps(self, execution: WorkflowExecution, parameters: Dict[str, Any]):
        """Execute workflow steps in sequence"""
        try:
            logger.info(f"Starting workflow execution: {execution.execution_id}")
            
            # Execute steps in dependency order
            completed_steps = set()
            
            while len(completed_steps) < len(execution.steps):
                # Find next executable steps
                executable_steps = []
                for i, step in enumerate(execution.steps):
                    if step.step_id in completed_steps:
                        continue
                    
                    # Check if dependencies are met
                    if not step.depends_on or all(dep in completed_steps for dep in step.depends_on):
                        executable_steps.append((i, step))
                
                if not executable_steps:
                    # No executable steps found - check for circular dependencies
                    execution.status = "failed"
                    execution.error_message = "Circular dependency detected in workflow"
                    execution.end_time = datetime.now().isoformat()
                    return
                
                # Execute all executable steps in parallel
                tasks = []
                for step_index, step in executable_steps:
                    task = asyncio.create_task(
                        self.execute_workflow_step(execution, step_index, parameters)
                    )
                    tasks.append((step_index, task))
                
                # Wait for all tasks to complete
                for step_index, task in tasks:
                    try:
                        result = await task
                        if result["success"]:
                            completed_steps.add(execution.steps[step_index].step_id)
                            execution.results[execution.steps[step_index].step_id] = result["result"]
                        else:
                            # Handle step failure
                            step = execution.steps[step_index]
                            if step.retry_count < step.max_retries:
                                step.retry_count += 1
                                logger.warning(f"Step {step.step_id} failed, retrying ({step.retry_count}/{step.max_retries})")
                                # Remove from completed steps to retry
                                if step.step_id in completed_steps:
                                    completed_steps.remove(step.step_id)
                            else:
                                execution.status = "failed"
                                execution.error_message = f"Step {step.step_id} failed after {step.max_retries} retries"
                                execution.end_time = datetime.now().isoformat()
                                return
                    except Exception as e:
                        logger.error(f"Step execution failed: {e}")
                        execution.status = "failed"
                        execution.error_message = str(e)
                        execution.end_time = datetime.now().isoformat()
                        return
            
            execution.status = "completed"
            execution.end_time = datetime.now().isoformat()
            
            logger.info(f"Workflow execution completed: {execution.execution_id}")
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            execution.status = "failed"
            execution.error_message = str(e)
            execution.end_time = datetime.now().isoformat()
    
    async def execute_workflow_step(self, execution: WorkflowExecution, step_index: int, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single workflow step"""
        step = execution.steps[step_index]
        
        try:
            # Check if agent is available
            if step.agent_id not in self.registered_agents:
                return {
                    "success": False,
                    "error": f"Agent {step.agent_id} not found"
                }
            
            agent = self.registered_agents[step.agent_id]
            
            # Update agent status
            agent.status = AgentStatus.PROCESSING
            agent.current_task = execution.execution_id
            
            logger.info(f"Executing step {step.step_id} with agent {agent.name}")
            
            # Execute step with timeout
            result = await asyncio.wait_for(
                self.call_agent_tool(agent, step.tool_name, step.parameters, parameters),
                timeout=step.timeout
            )
            
            # Update agent status
            agent.status = AgentStatus.SUCCESS
            agent.current_task = None
            
            return {
                "success": True,
                "result": result,
                "step_id": step.step_id,
                "agent_id": step.agent_id
            }
            
        except asyncio.TimeoutError:
            logger.error(f"Step {step.step_id} timed out after {step.timeout} seconds")
            agent.status = AgentStatus.ERROR
            agent.current_task = None
            return {
                "success": False,
                "error": f"Step timed out after {step.timeout} seconds"
            }
        except Exception as e:
            logger.error(f"Step {step.step_id} failed: {e}")
            agent.status = AgentStatus.ERROR
            agent.current_task = None
            return {
                "success": False,
                "error": str(e)
            }
    
    async def call_agent_tool(self, agent: AgentInfo, tool_name: str, step_parameters: Dict[str, Any], workflow_parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool on a specific agent"""
        try:
            # Merge parameters
            parameters = {**step_parameters, **workflow_parameters}
            
            # Simulate agent tool call (in production, this would make actual HTTP calls)
            result = await self.simulate_agent_call(agent, tool_name, parameters)
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to call agent tool: {e}")
            raise
    
    async def simulate_agent_call(self, agent: AgentInfo, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate agent tool call with realistic responses"""
        
        # Simulate processing time
        await asyncio.sleep(0.2)
        
        if agent.name == "Voice Listener Agent":
            return await self.simulate_voice_listener(tool_name, parameters)
        elif agent.name == "Brain Agent":
            return await self.simulate_brain_agent(tool_name, parameters)
        elif agent.name == "Fraud Detection Agent":
            return await self.simulate_fraud_detection(tool_name, parameters)
        elif agent.name == "Payment Agent":
            return await self.simulate_payment_agent(tool_name, parameters)
        elif agent.name == "Executor Agent":
            return await self.simulate_executor_agent(tool_name, parameters)
        else:
            return {
                "success": True,
                "message": f"Tool {tool_name} executed by {agent.name}",
                "timestamp": datetime.now().isoformat()
            }
    
    async def simulate_voice_listener(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate voice listener agent responses"""
        if tool_name == "transcribe_speech":
            return {
                "success": True,
                "transcript": "Send $10,000 to Philippines for family support",
                "confidence": 0.95,
                "language": "en",
                "processing_time": 1.2,
                "timestamp": datetime.now().isoformat()
            }
        elif tool_name == "generate_speech":
            return {
                "success": True,
                "audio_data": "mock_audio_base64_data",
                "text_length": len(parameters.get("text", "")),
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
    
    async def simulate_brain_agent(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate brain agent responses"""
        if tool_name == "analyze_support_query":
            return {
                "success": True,
                "analysis": {
                    "intent": "cross_border_payment",
                    "confidence": 0.95,
                    "entities": {
                        "amount": 10000,
                        "currency": "USD",
                        "destination": "Philippines",
                        "purpose": "family_support"
                    },
                    "action": {
                        "type": "process_payment",
                        "priority": 1,
                        "estimated_duration": "30 seconds"
                    },
                    "response_text": "I understand you want to send $10,000 to the Philippines for family support. Let me process this payment for you.",
                    "urgency_level": "medium"
                },
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
    
    async def simulate_fraud_detection(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate fraud detection agent responses"""
        if tool_name == "detect_fraud":
            return {
                "success": True,
                "fraud_analysis": {
                    "fraud_score": 2.1,
                    "risk_factors": ["high_amount", "cross_border"],
                    "recommendation": "approve",
                    "confidence": 0.99,
                    "processing_time": 0.3
                },
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
    
    async def simulate_payment_agent(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate payment agent responses"""
        if tool_name == "process_payment":
            return {
                "success": True,
                "payment_result": {
                    "transaction_id": f"TXN_{uuid.uuid4().hex[:8].upper()}",
                    "status": "completed",
                    "amount_sent": 10000,
                    "amount_received": 565000,  # PHP conversion
                    "fee": 10,
                    "processing_time_ms": 300,
                    "orgo_burned": 10,
                    "blockchain_tx_hash": f"0x{uuid.uuid4().hex}",
                    "settlement_time": 0.3
                },
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
    
    async def simulate_executor_agent(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate executor agent responses"""
        if tool_name == "check_transaction_status":
            return {
                "success": True,
                "transaction_result": {
                    "transaction_hash": parameters.get("transaction_hash", "unknown"),
                    "status": "success",
                    "block_number": 12345678,
                    "error_message": None
                },
                "timestamp": datetime.now().isoformat()
            }
        elif tool_name == "mint_compensation_nft":
            return {
                "success": True,
                "nft_result": {
                    "nft_id": f"nft_{uuid.uuid4().hex[:8]}",
                    "transaction_hash": f"tx_{uuid.uuid4().hex[:8]}",
                    "status": "completed",
                    "metadata": {
                        "name": "RUSH Support Resolution NFT",
                        "description": "Thank you for your patience while we resolved your Web3 support issue."
                    }
                },
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
    
    async def get_workflow_execution(self, execution_id: str) -> Optional[WorkflowExecution]:
        """Get workflow execution status"""
        return self.active_workflows.get(execution_id)
    
    async def list_workflow_executions(self) -> List[WorkflowExecution]:
        """List all workflow executions"""
        return list(self.active_workflows.values())
    
    async def get_workflow_definitions(self) -> Dict[str, Dict]:
        """Get all workflow definitions"""
        return self.workflow_definitions
    
    async def agent_health_monitor(self):
        """Monitor agent health and update status"""
        while True:
            try:
                current_time = datetime.now()
                
                for agent_id, agent in self.registered_agents.items():
                    if agent.last_heartbeat:
                        last_heartbeat = datetime.fromisoformat(agent.last_heartbeat)
                        time_diff = (current_time - last_heartbeat).total_seconds()
                        
                        # Mark agent as offline if no heartbeat for 60 seconds
                        if time_diff > 60 and agent.status != AgentStatus.OFFLINE:
                            agent.status = AgentStatus.OFFLINE
                            logger.warning(f"Agent {agent.name} marked as offline")
                
                await asyncio.sleep(10)  # Check every 10 seconds
                
            except Exception as e:
                logger.error(f"Health monitor error: {e}")
                await asyncio.sleep(10)
    
    async def workflow_monitor(self):
        """Monitor workflow executions"""
        while True:
            try:
                # Clean up completed workflows older than 1 hour
                current_time = datetime.now()
                workflows_to_remove = []
                
                for execution_id, execution in self.active_workflows.items():
                    if execution.end_time:
                        end_time = datetime.fromisoformat(execution.end_time)
                        if (current_time - end_time).total_seconds() > 3600:  # 1 hour
                            workflows_to_remove.append(execution_id)
                
                for execution_id in workflows_to_remove:
                    del self.active_workflows[execution_id]
                    logger.info(f"Cleaned up completed workflow: {execution_id}")
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"Workflow monitor error: {e}")
                await asyncio.sleep(60)
    
    async def get_orchestrator_metrics(self) -> Dict[str, Any]:
        """Get orchestrator metrics"""
        return {
            "total_agents": len(self.registered_agents),
            "active_agents": len([a for a in self.registered_agents.values() if a.status == AgentStatus.IDLE]),
            "processing_agents": len([a for a in self.registered_agents.values() if a.status == AgentStatus.PROCESSING]),
            "offline_agents": len([a for a in self.registered_agents.values() if a.status == AgentStatus.OFFLINE]),
            "active_workflows": len(self.active_workflows),
            "completed_workflows": len([w for w in self.active_workflows.values() if w.status == "completed"]),
            "failed_workflows": len([w for w in self.active_workflows.values() if w.status == "failed"]),
            "available_workflows": len(self.workflow_definitions),
            "last_updated": datetime.now().isoformat()
        }

# Global orchestrator instance
orchestrator = CoralAgentOrchestrator()

async def main():
    """Main entry point for testing"""
    logger.info("Coral Protocol Agent Orchestrator started")
    
    # Register demo agents
    demo_agents = [
        {
            "agent_id": "voice-listener-agent",
            "name": "Voice Listener Agent",
            "version": "1.0.0",
            "capabilities": ["speech-to-text", "text-to-speech", "voice-processing"],
            "description": "Handles voice input/output using ElevenLabs API",
            "endpoint": "/api/agents/voice-listener"
        },
        {
            "agent_id": "brain-agent",
            "name": "Brain Agent",
            "version": "1.0.0",
            "capabilities": ["natural-language-understanding", "intent-analysis", "response-generation"],
            "description": "Analyzes queries and formulates responses using Mistral AI",
            "endpoint": "/api/agents/brain"
        },
        {
            "agent_id": "fraud-detection-agent",
            "name": "Fraud Detection Agent",
            "version": "1.0.0",
            "capabilities": ["fraud-detection", "risk-assessment", "pattern-analysis"],
            "description": "AI-powered fraud detection with real-time risk assessment",
            "endpoint": "/api/agents/fraud-detection"
        },
        {
            "agent_id": "payment-agent",
            "name": "Payment Agent",
            "version": "1.0.0",
            "capabilities": ["cross-border-payments", "sub-second-settlement", "multi-currency-support"],
            "description": "Cross-border payment processing with ORGO token burning",
            "endpoint": "/api/agents/payment"
        },
        {
            "agent_id": "executor-agent",
            "name": "Executor Agent",
            "version": "1.0.0",
            "capabilities": ["blockchain-interaction", "nft-minting", "transaction-verification"],
            "description": "Executes blockchain operations using Crossmint and Solana",
            "endpoint": "/api/agents/executor"
        }
    ]
    
    for agent_data in demo_agents:
        await orchestrator.register_agent(agent_data)
    
    # Example workflow execution
    execution_id = await orchestrator.execute_workflow("voice_payment_workflow", {
        "voice_input": "Send $10,000 to Philippines for family support",
        "user_id": "demo_user_123"
    })
    
    logger.info(f"Workflow execution started: {execution_id}")
    
    # Keep running
    while True:
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
