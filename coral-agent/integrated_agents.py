#!/usr/bin/env python3
"""
Integrated Agents - Complete ORGO Rush + Coral Protocol Integration
This module integrates all existing agents into a unified system
"""

import asyncio
import os
import sys
import logging
import json
import time
import numpy as np
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import aiohttp

# Add ORGO Rush backend to path
sys.path.append('../orgorush-hackathon/backend/orgo-payment-backend/src')

# Import existing ORGO Rush agents
try:
    from fraud_detector import FraudDetector
    from lstm_predictor import TransactionPredictor
    from payment_agent import PaymentAgent
    from orgo_agent_orchestrator import AdvancedOrgoOrchestrator
except ImportError as e:
    logging.warning(f"Could not import ORGO Rush agents: {e}")
    # Create mock implementations
    class FraudDetector:
        def __init__(self):
            self.model = None
            self.scaler = None
            self.is_trained = False
        
        def extract_features(self, tx_data, user_history=None):
            return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
        
        def detect_fraud(self, tx_data, user_history=None):
            return {
                "fraud_probability": np.random.uniform(0, 1),
                "risk_score": np.random.uniform(1, 10),
                "safe_to_proceed": True
            }
    
    class TransactionPredictor:
        def __init__(self):
            self.model = None
            self.sequence_length = 10
        
        def predict_next_transactions(self, recent_transactions, num_predictions=3):
            return [
                {"amount": 100, "recipient": "predicted_1", "token": "USDC", "confidence": 0.8},
                {"amount": 50, "recipient": "predicted_2", "token": "USDT", "confidence": 0.7},
                {"amount": 25, "recipient": "predicted_3", "token": "SOL", "confidence": 0.6}
            ]
    
    class PaymentAgent:
        def __init__(self):
            self.agent_id = "orgo_payment_agent"
        
        async def process_payment(self, request):
            return {
                "transaction_id": f"orgo_tx_{int(time.time())}",
                "status": "success",
                "amount": request.get("amount", 0),
                "processing_time_ms": 250
            }
    
    class AdvancedOrgoOrchestrator:
        def __init__(self):
            self.agents = {}
            self.conversations = {}
        
        async def create_specialized_agent(self, agent_type, user_id):
            return {"agent_id": f"{agent_type}_{user_id}", "status": "created"}

# Import Coral Protocol agents
try:
    from main import CoralVoiceAgent
    from payment_agent import CoralPaymentAgent
except ImportError as e:
    logging.warning(f"Could not import Coral Protocol agents: {e}")
    # Create mock implementations
    class CoralVoiceAgent:
        def __init__(self):
            self.capabilities = AgentCapabilities()
        
        async def initialize_coral_connection(self):
            pass
        
        async def process_voice_input(self, audio_data):
            return {
                "transcript": "Send $1000 to Philippines",
                "confidence": 0.95,
                "intent": "payment"
            }
    
    class CoralPaymentAgent:
        def __init__(self):
            self.agent_id = "coral-payment-agent-v1"
        
        async def initialize(self):
            pass
        
        async def process_payment(self, request):
            return {
                "transaction_id": f"coral_tx_{int(time.time())}",
                "status": "success",
                "amount": request.amount,
                "processing_time_ms": 300
            }

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AgentCapabilities:
    """Unified agent capabilities"""
    speech_to_text: bool = True
    text_to_speech: bool = True
    intent_analysis: bool = True
    blockchain_operations: bool = True
    payment_processing: bool = True
    fraud_detection: bool = True
    lstm_prediction: bool = True
    transaction_optimization: bool = True
    real_time_monitoring: bool = True
    sub_second_settlement: bool = True

@dataclass
class IntegratedPaymentRequest:
    """Integrated payment request structure"""
    session_id: str
    user_id: str
    amount: float
    currency_from: str
    currency_to: str
    recipient: str
    memo: Optional[str] = None
    voice_input: Optional[str] = None
    timestamp: Optional[str] = None
    user_history: Optional[List[Dict]] = None

@dataclass
class IntegratedAgentResult:
    """Integrated agent result structure"""
    agent_id: str
    agent_name: str
    agent_type: str  # 'coral' or 'orgo'
    status: str
    result: Dict[str, Any]
    processing_time_ms: int
    confidence_score: float
    error_message: Optional[str] = None

class IntegratedAgentSystem:
    """
    Complete integration of ORGO Rush and Coral Protocol agents
    """
    
    def __init__(self):
        self.capabilities = AgentCapabilities()
        self.active_sessions: Dict[str, Dict] = {}
        self.coral_server_url: Optional[str] = None
        
        # ORGO Rush Agents
        self.orgo_fraud_detector = FraudDetector()
        self.orgo_lstm_predictor = TransactionPredictor()
        self.orgo_payment_agent = PaymentAgent()
        self.orgo_orchestrator = AdvancedOrgoOrchestrator()
        
        # Coral Protocol Agents
        self.coral_voice_agent = CoralVoiceAgent()
        self.coral_payment_agent = CoralPaymentAgent()
        
        # Agent registry
        self.agent_registry: Dict[str, Dict] = {}
        self.performance_metrics: Dict[str, Dict] = {}
        
        # Workflow coordination
        self.workflow_coordinator = WorkflowCoordinator()
        
    async def initialize(self):
        """Initialize all integrated agents"""
        try:
            logger.info("🚀 Initializing Integrated Agent System...")
            
            # Initialize Coral Protocol
            await self._initialize_coral_protocol()
            
            # Initialize ORGO Rush agents
            await self._initialize_orgo_rush()
            
            # Register all agents
            await self._register_all_agents()
            
            # Initialize workflow coordinator
            await self.workflow_coordinator.initialize()
            
            logger.info("✅ Integrated Agent System initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize integrated system: {e}")
            raise
    
    async def _initialize_coral_protocol(self):
        """Initialize Coral Protocol agents"""
        try:
            self.coral_server_url = os.getenv("CORAL_SERVER_URL", "http://localhost:8080")
            
            # Initialize Coral agents
            await self.coral_voice_agent.initialize_coral_connection()
            await self.coral_payment_agent.initialize()
            
            logger.info("✅ Coral Protocol agents initialized")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Coral Protocol: {e}")
    
    async def _initialize_orgo_rush(self):
        """Initialize ORGO Rush agents"""
        try:
            # Initialize ORGO agents
            # Note: These would normally load models, connect to databases, etc.
            logger.info("✅ ORGO Rush agents initialized")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize ORGO Rush: {e}")
    
    async def _register_all_agents(self):
        """Register all agents in the unified registry"""
        agents = [
            # Coral Protocol Agents
            {
                "agent_id": "coral-voice-listener",
                "name": "Coral Voice Listener",
                "type": "coral",
                "capabilities": ["speech-to-text", "text-to-speech", "voice-processing"],
                "instance": self.coral_voice_agent
            },
            {
                "agent_id": "coral-payment-processor",
                "name": "Coral Payment Processor",
                "type": "coral",
                "capabilities": ["payment-processing", "blockchain-operations", "settlement"],
                "instance": self.coral_payment_agent
            },
            # ORGO Rush Agents
            {
                "agent_id": "orgo-fraud-detector",
                "name": "ORGO Fraud Detector",
                "type": "orgo",
                "capabilities": ["fraud-detection", "anomaly-detection", "risk-assessment"],
                "instance": self.orgo_fraud_detector
            },
            {
                "agent_id": "orgo-lstm-predictor",
                "name": "ORGO LSTM Predictor",
                "type": "orgo",
                "capabilities": ["transaction-prediction", "pattern-recognition", "optimization"],
                "instance": self.orgo_lstm_predictor
            },
            {
                "agent_id": "orgo-payment-agent",
                "name": "ORGO Payment Agent",
                "type": "orgo",
                "capabilities": ["payment-processing", "token-burning", "cross-border-settlement"],
                "instance": self.orgo_payment_agent
            },
            {
                "agent_id": "orgo-orchestrator",
                "name": "ORGO Agent Orchestrator",
                "type": "orgo",
                "capabilities": ["agent-coordination", "workflow-management", "performance-optimization"],
                "instance": self.orgo_orchestrator
            }
        ]
        
        for agent in agents:
            self.agent_registry[agent["agent_id"]] = agent
            logger.info(f"✅ Registered {agent['name']} ({agent['type']})")
    
    async def process_integrated_payment(self, request: IntegratedPaymentRequest) -> Dict[str, Any]:
        """
        Process payment using integrated agent system
        Combines Coral Protocol voice processing with ORGO Rush optimization
        """
        session_id = request.session_id
        start_time = time.time()
        
        try:
            logger.info(f"🎯 Processing integrated payment: {request.amount} {request.currency_from} -> {request.currency_to}")
            
            # Store session
            self.active_sessions[session_id] = {
                "request": asdict(request),
                "start_time": start_time,
                "status": "processing",
                "results": {}
            }
            
            # Execute integrated workflow
            workflow_result = await self._execute_integrated_workflow(request)
            
            # Process and combine results
            final_result = await self._combine_agent_results(workflow_result, request)
            
            # Update session
            self.active_sessions[session_id]["status"] = "completed"
            self.active_sessions[session_id]["results"] = final_result
            
            processing_time = (time.time() - start_time) * 1000
            logger.info(f"✅ Integrated payment completed in {processing_time:.2f}ms")
            
            return final_result
            
        except Exception as e:
            logger.error(f"❌ Integrated payment failed: {e}")
            self.active_sessions[session_id]["status"] = "failed"
            self.active_sessions[session_id]["error"] = str(e)
            raise
    
    async def _execute_integrated_workflow(self, request: IntegratedPaymentRequest) -> Dict[str, Any]:
        """Execute integrated workflow combining both agent systems"""
        
        workflow_steps = [
            {
                "step_id": "voice_processing",
                "agent_id": "coral-voice-listener",
                "action": "process_voice_input",
                "parallel": False
            },
            {
                "step_id": "fraud_detection",
                "agent_id": "orgo-fraud-detector",
                "action": "detect_fraud",
                "parallel": False
            },
            {
                "step_id": "transaction_prediction",
                "agent_id": "orgo-lstm-predictor",
                "action": "predict_transactions",
                "parallel": True
            },
            {
                "step_id": "payment_processing_orgo",
                "agent_id": "orgo-payment-agent",
                "action": "process_payment",
                "parallel": False
            },
            {
                "step_id": "payment_processing_coral",
                "agent_id": "coral-payment-processor",
                "action": "process_payment",
                "parallel": False
            },
            {
                "step_id": "orchestration",
                "agent_id": "orgo-orchestrator",
                "action": "optimize_workflow",
                "parallel": False
            }
        ]
        
        step_results = []
        total_start_time = time.time()
        
        for step in workflow_steps:
            step_start_time = time.time()
            
            try:
                # Execute step
                step_result = await self._execute_workflow_step(step, request)
                step_results.append(step_result)
                
                step_time = (time.time() - step_start_time) * 1000
                logger.info(f"✅ {step['agent_id']} completed in {step_time:.2f}ms")
                
            except Exception as e:
                logger.error(f"❌ {step['agent_id']} failed: {e}")
                step_results.append({
                    "step_id": step["step_id"],
                    "agent_id": step["agent_id"],
                    "status": "error",
                    "error": str(e),
                    "processing_time_ms": (time.time() - step_start_time) * 1000
                })
        
        total_time = (time.time() - total_start_time) * 1000
        
        return {
            "workflow_id": "integrated_payment_workflow",
            "status": "completed",
            "step_results": step_results,
            "total_time_ms": total_time
        }
    
    async def _execute_workflow_step(self, step: Dict, request: IntegratedPaymentRequest) -> Dict[str, Any]:
        """Execute a single workflow step"""
        agent_id = step["agent_id"]
        action = step["action"]
        
        agent_info = self.agent_registry.get(agent_id)
        if not agent_info:
            raise ValueError(f"Agent {agent_id} not found")
        
        agent_instance = agent_info["instance"]
        step_start_time = time.time()
        
        try:
            # Execute agent action
            if agent_id == "coral-voice-listener":
                result = await agent_instance.process_voice_input(b"mock_audio_data")
            elif agent_id == "coral-payment-processor":
                result = await agent_instance.process_payment(request)
            elif agent_id == "orgo-fraud-detector":
                result = agent_instance.detect_fraud(asdict(request), request.user_history)
            elif agent_id == "orgo-lstm-predictor":
                result = agent_instance.predict_next_transactions(request.user_history or [])
            elif agent_id == "orgo-payment-agent":
                result = await agent_instance.process_payment(asdict(request))
            elif agent_id == "orgo-orchestrator":
                result = await agent_instance.create_specialized_agent("payment_processor", request.user_id)
            else:
                result = {"status": "not_implemented"}
            
            processing_time = (time.time() - step_start_time) * 1000
            
            return {
                "step_id": step["step_id"],
                "agent_id": agent_id,
                "agent_name": agent_info["name"],
                "agent_type": agent_info["type"],
                "action": action,
                "status": "success",
                "result": result,
                "processing_time_ms": processing_time
            }
            
        except Exception as e:
            processing_time = (time.time() - step_start_time) * 1000
            return {
                "step_id": step["step_id"],
                "agent_id": agent_id,
                "agent_name": agent_info["name"],
                "agent_type": agent_info["type"],
                "action": action,
                "status": "error",
                "error": str(e),
                "processing_time_ms": processing_time
            }
    
    async def _combine_agent_results(self, workflow_result: Dict, request: IntegratedPaymentRequest) -> Dict[str, Any]:
        """Combine results from all agents into unified response"""
        
        combined_result = {
            "session_id": request.session_id,
            "status": "success",
            "processing_time_ms": workflow_result["total_time_ms"],
            "agent_results": {},
            "voice_analysis": {},
            "fraud_analysis": {},
            "prediction_analysis": {},
            "payment_results": {},
            "orchestration_results": {},
            "overall_metrics": {}
        }
        
        # Process step results
        for step_result in workflow_result["step_results"]:
            agent_id = step_result["agent_id"]
            result_data = step_result.get("result", {})
            
            # Store agent-specific results
            combined_result["agent_results"][agent_id] = {
                "name": step_result["agent_name"],
                "type": step_result["agent_type"],
                "status": step_result["status"],
                "result": result_data,
                "processing_time_ms": step_result["processing_time_ms"]
            }
            
            # Categorize results by type
            if agent_id == "coral-voice-listener":
                combined_result["voice_analysis"] = result_data
            elif agent_id == "orgo-fraud-detector":
                combined_result["fraud_analysis"] = result_data
            elif agent_id == "orgo-lstm-predictor":
                combined_result["prediction_analysis"] = result_data
            elif agent_id in ["orgo-payment-agent", "coral-payment-processor"]:
                combined_result["payment_results"][agent_id] = result_data
            elif agent_id == "orgo-orchestrator":
                combined_result["orchestration_results"] = result_data
        
        # Calculate overall metrics
        combined_result["overall_metrics"] = self._calculate_overall_metrics(combined_result)
        
        return combined_result
    
    def _calculate_overall_metrics(self, results: Dict) -> Dict[str, Any]:
        """Calculate overall system metrics"""
        metrics = {
            "total_agents_used": len(results["agent_results"]),
            "coral_agents": 0,
            "orgo_agents": 0,
            "success_rate": 0,
            "average_confidence": 0,
            "total_processing_time_ms": results["processing_time_ms"]
        }
        
        confidences = []
        successful_agents = 0
        
        for agent_id, agent_result in results["agent_results"].items():
            if agent_result["type"] == "coral":
                metrics["coral_agents"] += 1
            elif agent_result["type"] == "orgo":
                metrics["orgo_agents"] += 1
            
            if agent_result["status"] == "success":
                successful_agents += 1
            
            # Extract confidence if available
            result_data = agent_result.get("result", {})
            if "confidence" in result_data:
                confidences.append(result_data["confidence"])
        
        metrics["success_rate"] = successful_agents / len(results["agent_results"]) if results["agent_results"] else 0
        metrics["average_confidence"] = np.mean(confidences) if confidences else 0
        
        return metrics
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        return {
            "system_status": "active",
            "active_sessions": len(self.active_sessions),
            "registered_agents": len(self.agent_registry),
            "agent_registry": {
                agent_id: {
                    "name": agent_info["name"],
                    "type": agent_info["type"],
                    "capabilities": agent_info["capabilities"]
                }
                for agent_id, agent_info in self.agent_registry.items()
            },
            "performance_metrics": self.performance_metrics,
            "capabilities": asdict(self.capabilities)
        }
    
    async def shutdown(self):
        """Gracefully shutdown all agents"""
        logger.info("🔄 Shutting down Integrated Agent System...")
        
        # Clear active sessions
        self.active_sessions.clear()
        
        # Clear registry
        self.agent_registry.clear()
        
        logger.info("✅ Integrated Agent System shutdown complete")

class WorkflowCoordinator:
    """Workflow coordination between agent systems"""
    
    def __init__(self):
        self.active_workflows = {}
        self.workflow_templates = {}
    
    async def initialize(self):
        """Initialize workflow coordinator"""
        # Define workflow templates
        self.workflow_templates = {
            "voice_payment": {
                "name": "Voice Payment Workflow",
                "steps": [
                    "voice_processing",
                    "fraud_detection",
                    "transaction_prediction",
                    "payment_processing",
                    "settlement"
                ]
            },
            "optimized_payment": {
                "name": "Optimized Payment Workflow",
                "steps": [
                    "fraud_detection",
                    "transaction_prediction",
                    "payment_optimization",
                    "settlement"
                ]
            }
        }
    
    async def execute_workflow(self, workflow_id: str, data: Dict) -> Dict[str, Any]:
        """Execute a workflow"""
        template = self.workflow_templates.get(workflow_id)
        if not template:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        execution_id = f"workflow_{int(time.time())}"
        self.active_workflows[execution_id] = {
            "workflow_id": workflow_id,
            "status": "running",
            "start_time": time.time()
        }
        
        # Simulate workflow execution
        await asyncio.sleep(0.1)
        
        self.active_workflows[execution_id]["status"] = "completed"
        
        return {
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "status": "completed",
            "steps_completed": len(template["steps"])
        }

# Main execution
async def main():
    """Main execution function"""
    integrated_system = IntegratedAgentSystem()
    
    try:
        await integrated_system.initialize()
        
        # Example usage
        request = IntegratedPaymentRequest(
            session_id="integrated_test_001",
            user_id="user_456",
            amount=1000,
            currency_from="USD",
            currency_to="PHP",
            recipient="Philippines",
            voice_input="Send $1000 to Philippines",
            user_history=[
                {"amount": 500, "recipient": "Philippines", "timestamp": time.time() - 3600},
                {"amount": 200, "recipient": "Mexico", "timestamp": time.time() - 7200}
            ]
        )
        
        result = await integrated_system.process_integrated_payment(request)
        print(f"Integrated payment result: {json.dumps(result, indent=2)}")
        
        # Get system status
        status = await integrated_system.get_system_status()
        print(f"System status: {json.dumps(status, indent=2)}")
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
    finally:
        await integrated_system.shutdown()

if __name__ == "__main__":
    asyncio.run(main())
