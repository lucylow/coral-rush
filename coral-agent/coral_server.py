#!/usr/bin/env python3
"""
Coral Protocol Server
A comprehensive server that orchestrates multiple agents for the hackathon demo.
This server handles agent registration, discovery, and coordination.
"""

import asyncio
import json
import logging
import os
import uuid
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiohttp
import websockets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AgentInfo:
    """Agent information structure"""
    agent_id: str
    name: str
    version: str
    capabilities: List[str]
    description: str
    endpoint: str
    status: str = "active"
    last_heartbeat: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None

@dataclass
class WorkflowStep:
    """Workflow step definition"""
    step_id: str
    agent_id: str
    tool_name: str
    parameters: Dict[str, Any]
    depends_on: List[str] = None

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

class CoralProtocolServer:
    """Main Coral Protocol Server"""
    
    def __init__(self):
        self.app = FastAPI(title="Coral Protocol Server", version="1.0.0")
        self.registered_agents: Dict[str, AgentInfo] = {}
        self.active_workflows: Dict[str, WorkflowExecution] = {}
        self.websocket_connections: List[WebSocket] = []
        
        # Define available workflows
        self.workflows = {
            "voice_payment_workflow": {
                "description": "Complete voice-to-payment workflow",
                "steps": [
                    {
                        "step_id": "voice_processing",
                        "agent_id": "voice-listener-agent",
                        "tool_name": "transcribe_speech",
                        "parameters": {}
                    },
                    {
                        "step_id": "intent_analysis",
                        "agent_id": "brain-agent",
                        "tool_name": "analyze_support_query",
                        "parameters": {},
                        "depends_on": ["voice_processing"]
                    },
                    {
                        "step_id": "fraud_detection",
                        "agent_id": "fraud-detection-agent",
                        "tool_name": "detect_fraud",
                        "parameters": {},
                        "depends_on": ["intent_analysis"]
                    },
                    {
                        "step_id": "payment_processing",
                        "agent_id": "payment-agent",
                        "tool_name": "process_payment",
                        "parameters": {},
                        "depends_on": ["fraud_detection"]
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
                        "parameters": {}
                    },
                    {
                        "step_id": "transaction_check",
                        "agent_id": "executor-agent",
                        "tool_name": "check_transaction_status",
                        "parameters": {},
                        "depends_on": ["query_analysis"]
                    },
                    {
                        "step_id": "nft_compensation",
                        "agent_id": "executor-agent",
                        "tool_name": "mint_compensation_nft",
                        "parameters": {},
                        "depends_on": ["transaction_check"]
                    }
                ]
            }
        }
        
        self.setup_routes()
        self.setup_middleware()
    
    def setup_middleware(self):
        """Setup CORS and other middleware"""
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    def setup_routes(self):
        """Setup API routes"""
        
        @self.app.get("/")
        async def root():
            return {
                "message": "Coral Protocol Server",
                "version": "1.0.0",
                "status": "running",
                "registered_agents": len(self.registered_agents),
                "active_workflows": len(self.active_workflows)
            }
        
        @self.app.get("/health")
        async def health_check():
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "agents": len(self.registered_agents),
                "workflows": len(self.active_workflows)
            }
        
        @self.app.post("/api/agents/register")
        async def register_agent(agent_data: dict):
            """Register a new agent"""
            try:
                agent_info = AgentInfo(
                    agent_id=agent_data.get("agent_id", str(uuid.uuid4())),
                    name=agent_data.get("name", "Unknown Agent"),
                    version=agent_data.get("version", "1.0.0"),
                    capabilities=agent_data.get("capabilities", []),
                    description=agent_data.get("description", ""),
                    endpoint=agent_data.get("endpoint", ""),
                    status="active",
                    last_heartbeat=datetime.now().isoformat()
                )
                
                self.registered_agents[agent_info.agent_id] = agent_info
                
                # Broadcast agent registration
                await self.broadcast_agent_update(agent_info)
                
                logger.info(f"Agent registered: {agent_info.name} ({agent_info.agent_id})")
                
                return {
                    "success": True,
                    "agent_id": agent_info.agent_id,
                    "message": f"Agent {agent_info.name} registered successfully"
                }
                
            except Exception as e:
                logger.error(f"Failed to register agent: {e}")
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.get("/api/agents")
        async def list_agents():
            """List all registered agents"""
            return {
                "agents": [asdict(agent) for agent in self.registered_agents.values()],
                "total": len(self.registered_agents)
            }
        
        @self.app.get("/api/agents/{agent_id}")
        async def get_agent(agent_id: str):
            """Get specific agent information"""
            if agent_id not in self.registered_agents:
                raise HTTPException(status_code=404, detail="Agent not found")
            
            return asdict(self.registered_agents[agent_id])
        
        @self.app.post("/api/agents/{agent_id}/heartbeat")
        async def agent_heartbeat(agent_id: str):
            """Update agent heartbeat"""
            if agent_id not in self.registered_agents:
                raise HTTPException(status_code=404, detail="Agent not found")
            
            self.registered_agents[agent_id].last_heartbeat = datetime.now().isoformat()
            return {"success": True, "timestamp": self.registered_agents[agent_id].last_heartbeat}
        
        @self.app.get("/api/workflows")
        async def list_workflows():
            """List available workflows"""
            return {
                "workflows": self.workflows,
                "total": len(self.workflows)
            }
        
        @self.app.post("/api/workflows/{workflow_name}/execute")
        async def execute_workflow(workflow_name: str, execution_data: dict):
            """Execute a workflow"""
            if workflow_name not in self.workflows:
                raise HTTPException(status_code=404, detail="Workflow not found")
            
            try:
                execution_id = str(uuid.uuid4())
                workflow_config = self.workflows[workflow_name]
                
                # Create workflow steps
                steps = []
                for step_config in workflow_config["steps"]:
                    step = WorkflowStep(
                        step_id=step_config["step_id"],
                        agent_id=step_config["agent_id"],
                        tool_name=step_config["tool_name"],
                        parameters=step_config.get("parameters", {}),
                        depends_on=step_config.get("depends_on", [])
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
                asyncio.create_task(self.execute_workflow_steps(execution))
                
                return {
                    "success": True,
                    "execution_id": execution_id,
                    "workflow_name": workflow_name,
                    "status": "started"
                }
                
            except Exception as e:
                logger.error(f"Failed to execute workflow: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/workflows/executions/{execution_id}")
        async def get_workflow_execution(execution_id: str):
            """Get workflow execution status"""
            if execution_id not in self.active_workflows:
                raise HTTPException(status_code=404, detail="Execution not found")
            
            execution = self.active_workflows[execution_id]
            return asdict(execution)
        
        @self.app.post("/api/agents/{agent_id}/call")
        async def call_agent_tool(agent_id: str, call_data: dict):
            """Call a tool on a specific agent"""
            if agent_id not in self.registered_agents:
                raise HTTPException(status_code=404, detail="Agent not found")
            
            try:
                agent = self.registered_agents[agent_id]
                tool_name = call_data.get("tool_name")
                parameters = call_data.get("parameters", {})
                
                # Simulate agent tool call
                result = await self.simulate_agent_call(agent, tool_name, parameters)
                
                return {
                    "success": True,
                    "agent_id": agent_id,
                    "tool_name": tool_name,
                    "result": result
                }
                
            except Exception as e:
                logger.error(f"Failed to call agent tool: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            """WebSocket endpoint for real-time updates"""
            await websocket.accept()
            self.websocket_connections.append(websocket)
            
            try:
                while True:
                    # Keep connection alive
                    await websocket.receive_text()
            except WebSocketDisconnect:
                self.websocket_connections.remove(websocket)
    
    async def execute_workflow_steps(self, execution: WorkflowExecution):
        """Execute workflow steps in sequence"""
        try:
            logger.info(f"Starting workflow execution: {execution.execution_id}")
            
            for i, step in enumerate(execution.steps):
                execution.current_step = i
                
                # Check if agent is available
                if step.agent_id not in self.registered_agents:
                    logger.error(f"Agent {step.agent_id} not found for step {step.step_id}")
                    execution.status = "failed"
                    execution.end_time = datetime.now().isoformat()
                    return
                
                # Execute step
                logger.info(f"Executing step {step.step_id} with agent {step.agent_id}")
                
                result = await self.simulate_agent_call(
                    self.registered_agents[step.agent_id],
                    step.tool_name,
                    step.parameters
                )
                
                execution.results[step.step_id] = result
                
                # Broadcast step completion
                await self.broadcast_workflow_update(execution)
                
                # Small delay between steps
                await asyncio.sleep(0.5)
            
            execution.status = "completed"
            execution.end_time = datetime.now().isoformat()
            
            logger.info(f"Workflow execution completed: {execution.execution_id}")
            
            # Broadcast completion
            await self.broadcast_workflow_update(execution)
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            execution.status = "failed"
            execution.end_time = datetime.now().isoformat()
            await self.broadcast_workflow_update(execution)
    
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
                "text_length": parameters.get("text", "").length,
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
    
    async def broadcast_agent_update(self, agent: AgentInfo):
        """Broadcast agent updates to WebSocket clients"""
        message = {
            "type": "agent_update",
            "data": asdict(agent),
            "timestamp": datetime.now().isoformat()
        }
        
        for websocket in self.websocket_connections.copy():
            try:
                await websocket.send_text(json.dumps(message))
            except:
                self.websocket_connections.remove(websocket)
    
    async def broadcast_workflow_update(self, execution: WorkflowExecution):
        """Broadcast workflow updates to WebSocket clients"""
        message = {
            "type": "workflow_update",
            "data": asdict(execution),
            "timestamp": datetime.now().isoformat()
        }
        
        for websocket in self.websocket_connections.copy():
            try:
                await websocket.send_text(json.dumps(message))
            except:
                self.websocket_connections.remove(websocket)
    
    async def auto_register_demo_agents(self):
        """Auto-register demo agents for hackathon"""
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
            agent_info = AgentInfo(
                agent_id=agent_data["agent_id"],
                name=agent_data["name"],
                version=agent_data["version"],
                capabilities=agent_data["capabilities"],
                description=agent_data["description"],
                endpoint=agent_data["endpoint"],
                status="active",
                last_heartbeat=datetime.now().isoformat()
            )
            
            self.registered_agents[agent_info.agent_id] = agent_info
            logger.info(f"Auto-registered demo agent: {agent_info.name}")

def main():
    """Main entry point"""
    server = CoralProtocolServer()
    
    # Auto-register demo agents
    asyncio.create_task(server.auto_register_demo_agents())
    
    # Start the server
    uvicorn.run(
        server.app,
        host="0.0.0.0",
        port=8080,
        log_level="info"
    )

if __name__ == "__main__":
    main()
