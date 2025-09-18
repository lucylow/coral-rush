#!/usr/bin/env python3
"""
OrgoRush Backend API Server
Integrates MCP tools with AI agents and workflow system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import json
import time
import logging
from typing import Dict, List, Optional
from dataclasses import asdict
import threading
from concurrent.futures import ThreadPoolExecutor
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.mcp_tools_manager import MCPToolsManager
from agents.enhanced_payment_agent import EnhancedOrgoPaymentAgent
from workflow.payment_workflow import PaymentWorkflowOrchestrator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global instances
mcp_manager = MCPToolsManager()
payment_agent = None
workflow_orchestrator = None
executor = ThreadPoolExecutor(max_workers=20)

def run_async(coro):
    """Helper to run async functions in Flask routes"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "services": {
            "mcp_tools": "active",
            "ai_agents": "active",
            "workflow": "active"
        }
    })

@app.route('/api/v1/payment/process', methods=['POST'])
def process_payment():
    """Process payment through MCP tools and AI agents"""
    try:
        payment_data = request.get_json()
        
        if not payment_data:
            return jsonify({"error": "No payment data provided"}), 400
        
        # Validate required fields
        required_fields = ['sender', 'receiver', 'amount']
        for field in required_fields:
            if field not in payment_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Process through MCP tools
        result = run_async(mcp_manager.process_payment_request(payment_data))
        
        # If successful, also process through AI agent
        if result.get('success'):
            try:
                # Enhanced AI agent processing
                agent_result = run_async(process_with_ai_agent(payment_data))
                result['ai_agent_result'] = agent_result
            except Exception as e:
                logger.warning(f"AI agent processing failed: {e}")
                result['ai_agent_error'] = str(e)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Payment processing error: {e}")
        return jsonify({
            "error": "Payment processing failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/compliance/validate', methods=['POST'])
def validate_compliance():
    """Validate transaction compliance"""
    try:
        data = request.get_json()
        
        sender = data.get('sender', {})
        receiver = data.get('receiver', {})
        amount = data.get('amount', 0)
        
        result = run_async(
            mcp_manager.compliance_validator.validate_transaction(sender, receiver, amount)
        )
        
        return jsonify({
            "success": True,
            "compliance_result": asdict(result)
        })
        
    except Exception as e:
        logger.error(f"Compliance validation error: {e}")
        return jsonify({
            "error": "Compliance validation failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/fraud/analyze', methods=['POST'])
def analyze_fraud():
    """Analyze transaction for fraud"""
    try:
        transaction_data = request.get_json()
        
        result = run_async(
            mcp_manager.anomaly_detector.analyze_transaction(transaction_data)
        )
        
        return jsonify({
            "success": True,
            "fraud_analysis": asdict(result)
        })
        
    except Exception as e:
        logger.error(f"Fraud analysis error: {e}")
        return jsonify({
            "error": "Fraud analysis failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/liquidity/optimize', methods=['POST'])
def optimize_liquidity():
    """Trigger liquidity optimization"""
    try:
        result = run_async(mcp_manager.liquidity_optimizer.execute_rebalancing())
        
        return jsonify({
            "success": True,
            "rebalancing_actions": [asdict(action) for action in result]
        })
        
    except Exception as e:
        logger.error(f"Liquidity optimization error: {e}")
        return jsonify({
            "error": "Liquidity optimization failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/contract/audit', methods=['POST'])
def audit_contract():
    """Audit smart contract"""
    try:
        data = request.get_json()
        contract_code = data.get('contract_code', '')
        contract_address = data.get('contract_address')
        
        if not contract_code:
            return jsonify({"error": "No contract code provided"}), 400
        
        result = run_async(
            mcp_manager.audit_smart_contract(contract_code, contract_address)
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Contract audit error: {e}")
        return jsonify({
            "error": "Contract audit failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/dispute/resolve', methods=['POST'])
def resolve_dispute():
    """Resolve payment dispute"""
    try:
        data = request.get_json()
        dispute_id = data.get('dispute_id')
        dispute_data = data.get('dispute_data', {})
        
        if not dispute_id:
            return jsonify({"error": "No dispute ID provided"}), 400
        
        result = run_async(
            mcp_manager.resolve_payment_dispute(dispute_id, dispute_data)
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Dispute resolution error: {e}")
        return jsonify({
            "error": "Dispute resolution failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/workflow/execute', methods=['POST'])
def execute_workflow():
    """Execute complete payment workflow"""
    try:
        workflow_data = request.get_json()
        
        # Initialize workflow orchestrator if needed
        global workflow_orchestrator
        if not workflow_orchestrator:
            workflow_orchestrator = PaymentWorkflowOrchestrator()
        
        result = run_async(
            workflow_orchestrator.execute_complete_workflow(workflow_data)
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Workflow execution error: {e}")
        return jsonify({
            "error": "Workflow execution failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/agent/chat', methods=['POST'])
def chat_with_agent():
    """Chat with AI payment agent"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        user_id = data.get('user_id', 'anonymous')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Initialize payment agent if needed
        global payment_agent
        if not payment_agent:
            payment_agent = EnhancedOrgoPaymentAgent()
        
        result = run_async(
            payment_agent.process_user_message(user_id, message)
        )
        
        return jsonify({
            "success": True,
            "response": result
        })
        
    except Exception as e:
        logger.error(f"Agent chat error: {e}")
        return jsonify({
            "error": "Agent chat failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/system/status', methods=['GET'])
def system_status():
    """Get comprehensive system status"""
    try:
        mcp_status = mcp_manager.get_system_status()
        
        # Get additional system metrics
        system_metrics = {
            "uptime": time.time() - app.start_time,
            "memory_usage": get_memory_usage(),
            "active_connections": get_active_connections(),
            "request_count": get_request_count()
        }
        
        return jsonify({
            "success": True,
            "mcp_tools": mcp_status,
            "system_metrics": system_metrics,
            "timestamp": time.time()
        })
        
    except Exception as e:
        logger.error(f"System status error: {e}")
        return jsonify({
            "error": "System status retrieval failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/monitoring/start', methods=['POST'])
def start_monitoring():
    """Start continuous monitoring"""
    try:
        run_async(mcp_manager.start_continuous_monitoring())
        
        return jsonify({
            "success": True,
            "message": "Continuous monitoring started"
        })
        
    except Exception as e:
        logger.error(f"Monitoring start error: {e}")
        return jsonify({
            "error": "Failed to start monitoring",
            "details": str(e)
        }), 500

@app.route('/api/v1/monitoring/stop', methods=['POST'])
def stop_monitoring():
    """Stop continuous monitoring"""
    try:
        run_async(mcp_manager.stop_continuous_monitoring())
        
        return jsonify({
            "success": True,
            "message": "Continuous monitoring stopped"
        })
        
    except Exception as e:
        logger.error(f"Monitoring stop error: {e}")
        return jsonify({
            "error": "Failed to stop monitoring",
            "details": str(e)
        }), 500

@app.route('/api/v1/analytics/dashboard', methods=['GET'])
def analytics_dashboard():
    """Get analytics dashboard data"""
    try:
        # Get analytics from various sources
        dashboard_data = {
            "payment_metrics": get_payment_metrics(),
            "compliance_metrics": get_compliance_metrics(),
            "fraud_metrics": get_fraud_metrics(),
            "liquidity_metrics": get_liquidity_metrics(),
            "performance_metrics": get_performance_metrics()
        }
        
        return jsonify({
            "success": True,
            "dashboard_data": dashboard_data,
            "last_updated": time.time()
        })
        
    except Exception as e:
        logger.error(f"Analytics dashboard error: {e}")
        return jsonify({
            "error": "Analytics dashboard failed",
            "details": str(e)
        }), 500

@app.route('/api/v1/orgo/burn', methods=['POST'])
def execute_orgo_burn():
    """Execute ORGO token burn"""
    try:
        data = request.get_json()
        amount = data.get('amount', 0)
        transaction_id = data.get('transaction_id', '')
        
        if amount <= 0:
            return jsonify({"error": "Invalid burn amount"}), 400
        
        # Execute ORGO burn
        burn_result = run_async(execute_token_burn(amount, transaction_id))
        
        return jsonify({
            "success": True,
            "burn_result": burn_result
        })
        
    except Exception as e:
        logger.error(f"ORGO burn error: {e}")
        return jsonify({
            "error": "ORGO burn failed",
            "details": str(e)
        }), 500

# Helper functions
async def process_with_ai_agent(payment_data: Dict) -> Dict:
    """Process payment with AI agent"""
    global payment_agent
    if not payment_agent:
        payment_agent = EnhancedOrgoPaymentAgent()
    
    # Convert payment data to agent format
    agent_request = {
        "type": "payment_processing",
        "data": payment_data,
        "timestamp": time.time()
    }
    
    result = await payment_agent.process_payment_request(agent_request)
    return result

async def execute_token_burn(amount: float, transaction_id: str) -> Dict:
    """Execute ORGO token burn"""
    # Mock ORGO burn execution
    burn_tx = f"burn_{int(time.time() * 1000)}_{hash(transaction_id) % 10000:04d}"
    
    return {
        "burn_amount": amount,
        "burn_tx_hash": burn_tx,
        "burn_timestamp": time.time(),
        "total_burned": amount,  # In production, track cumulative burns
        "burn_rate": 0.001  # 0.1% burn rate
    }

def get_memory_usage() -> Dict:
    """Get memory usage statistics"""
    import psutil
    process = psutil.Process()
    memory_info = process.memory_info()
    
    return {
        "rss": memory_info.rss,
        "vms": memory_info.vms,
        "percent": process.memory_percent()
    }

def get_active_connections() -> int:
    """Get number of active connections"""
    # Mock active connections count
    return 42

def get_request_count() -> int:
    """Get total request count"""
    # Mock request count
    return getattr(app, 'request_count', 0)

def get_payment_metrics() -> Dict:
    """Get payment processing metrics"""
    return {
        "total_payments": 1247,
        "successful_payments": 1235,
        "failed_payments": 12,
        "success_rate": 99.04,
        "average_processing_time": 245,
        "total_volume": 2847392.50,
        "orgo_burned": 2847.39
    }

def get_compliance_metrics() -> Dict:
    """Get compliance metrics"""
    return {
        "total_checks": 1247,
        "passed_checks": 1175,
        "failed_checks": 72,
        "pass_rate": 94.23,
        "high_risk_transactions": 15,
        "sanctions_matches": 3,
        "kyc_verification_rate": 96.8
    }

def get_fraud_metrics() -> Dict:
    """Get fraud detection metrics"""
    return {
        "total_analyzed": 1247,
        "flagged_transactions": 18,
        "blocked_transactions": 8,
        "false_positives": 2,
        "accuracy": 99.5,
        "average_risk_score": 0.23
    }

def get_liquidity_metrics() -> Dict:
    """Get liquidity optimization metrics"""
    return {
        "total_pools": 5,
        "rebalancing_actions": 23,
        "yield_improvement": 15.7,
        "gas_optimization": 12.3,
        "total_liquidity": 5847392.75
    }

def get_performance_metrics() -> Dict:
    """Get system performance metrics"""
    return {
        "uptime": 99.97,
        "average_response_time": 245,
        "requests_per_second": 127,
        "error_rate": 0.03,
        "cpu_usage": 23.5,
        "memory_usage": 67.2
    }

class PaymentWorkflowOrchestrator:
    """Orchestrates complete payment workflows"""
    
    def __init__(self):
        self.mcp_manager = mcp_manager
        
    async def execute_complete_workflow(self, workflow_data: Dict) -> Dict:
        """Execute complete payment workflow with all MCP tools"""
        try:
            start_time = time.time()
            workflow_steps = []
            
            # Step 1: Compliance validation
            compliance_result = await self.mcp_manager.compliance_validator.validate_transaction(
                workflow_data.get("sender", {}),
                workflow_data.get("receiver", {}),
                workflow_data.get("amount", 0)
            )
            
            workflow_steps.append({
                "step": "compliance_validation",
                "result": asdict(compliance_result),
                "success": compliance_result.approved
            })
            
            if not compliance_result.approved:
                return {
                    "success": False,
                    "reason": "Compliance validation failed",
                    "workflow_steps": workflow_steps,
                    "total_time": (time.time() - start_time) * 1000
                }
            
            # Step 2: Fraud detection
            fraud_result = await self.mcp_manager.anomaly_detector.analyze_transaction(workflow_data)
            
            workflow_steps.append({
                "step": "fraud_detection",
                "result": asdict(fraud_result),
                "success": fraud_result.action != "block"
            })
            
            if fraud_result.action == "block":
                return {
                    "success": False,
                    "reason": "Transaction blocked by fraud detection",
                    "workflow_steps": workflow_steps,
                    "total_time": (time.time() - start_time) * 1000
                }
            
            # Step 3: Execute payment
            payment_result = await self._execute_payment(workflow_data)
            
            workflow_steps.append({
                "step": "payment_execution",
                "result": payment_result,
                "success": payment_result.get("success", False)
            })
            
            # Step 4: ORGO burn
            if payment_result.get("success"):
                burn_amount = workflow_data.get("amount", 0) * 0.001  # 0.1% burn
                burn_result = await execute_token_burn(burn_amount, payment_result.get("tx_hash", ""))
                
                workflow_steps.append({
                    "step": "orgo_burn",
                    "result": burn_result,
                    "success": True
                })
            
            # Step 5: Liquidity optimization (if large transaction)
            if workflow_data.get("amount", 0) > 10000:
                liquidity_result = await self.mcp_manager.liquidity_optimizer.execute_rebalancing()
                
                workflow_steps.append({
                    "step": "liquidity_optimization",
                    "result": [asdict(action) for action in liquidity_result],
                    "success": len(liquidity_result) > 0
                })
            
            total_time = (time.time() - start_time) * 1000
            
            return {
                "success": True,
                "workflow_steps": workflow_steps,
                "total_time": total_time,
                "summary": {
                    "steps_completed": len(workflow_steps),
                    "compliance_passed": compliance_result.approved,
                    "fraud_risk": fraud_result.risk_score,
                    "payment_confirmed": payment_result.get("success", False),
                    "orgo_burned": burn_amount if payment_result.get("success") else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "workflow_steps": workflow_steps,
                "total_time": (time.time() - start_time) * 1000
            }
    
    async def _execute_payment(self, payment_data: Dict) -> Dict:
        """Execute the actual payment"""
        # Mock payment execution
        await asyncio.sleep(0.1)  # Simulate processing time
        
        return {
            "success": True,
            "tx_hash": f"0x{hash(str(payment_data)) % (16**64):064x}",
            "status": "confirmed",
            "gas_used": 75000,
            "fee": payment_data.get("amount", 0) * 0.001,
            "execution_time": 150
        }

# Request counter middleware
@app.before_request
def before_request():
    if not hasattr(app, 'request_count'):
        app.request_count = 0
    app.request_count += 1

# Initialize app start time
app.start_time = time.time()

if __name__ == '__main__':
    # Start continuous monitoring
    def start_background_monitoring():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(mcp_manager.start_continuous_monitoring())
    
    # Start monitoring in background thread
    monitoring_thread = threading.Thread(target=start_background_monitoring, daemon=True)
    monitoring_thread.start()
    
    logger.info("Starting OrgoRush Backend API Server")
    logger.info("MCP Tools: Compliance, Liquidity, Fraud Detection, Contract Audit, Dispute Resolution")
    logger.info("AI Agents: Enhanced Payment Agent with OpenAI integration")
    logger.info("Workflow: Complete payment orchestration")
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        threaded=True
    )

