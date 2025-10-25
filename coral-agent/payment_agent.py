#!/usr/bin/env python3
"""
Coral Protocol Payment Agent
A reusable agent for cross-border payments that can be discovered and used by other systems.
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

# Coral Protocol imports
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource

# Import Aethir GPU integration
from aethir_integration import aethir_service, aethir_detect_fraud, aethir_predict_transactions

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PaymentRequest:
    """Payment request structure"""
    amount: float
    currency_from: str
    currency_to: str
    recipient: str
    purpose: str
    session_id: str
    user_id: Optional[str] = None

@dataclass
class PaymentResult:
    """Payment result structure"""
    transaction_id: str
    status: str
    amount_sent: float
    amount_received: float
    fee: float
    processing_time_ms: int
    orgo_burned: float
    fraud_score: float
    timestamp: str
    blockchain_tx_hash: Optional[str] = None

class CoralPaymentAgent:
    """
    Reusable Coral Protocol Payment Agent
    
    This agent can be discovered and used by other systems via the Coral Registry.
    It handles cross-border payments with AI-powered fraud detection and sub-second settlement.
    """
    
    def __init__(self):
        self.agent_id = "coral-payment-agent-v1"
        self.agent_name = "Cross-Border Payment Agent"
        self.version = "1.0.0"
        self.capabilities = [
            "cross-border-payments",
            "fraud-detection", 
            "sub-second-settlement",
            "multi-currency-support",
            "orgo-token-burning",
            "real-time-risk-assessment"
        ]
        self.active_sessions: Dict[str, Dict] = {}
        self.mcp_clients: Dict[str, ClientSession] = {}
        
    async def initialize(self):
        """Initialize the agent and register with Coral Protocol"""
        try:
            # Connect to Coral Protocol server
            await self._connect_to_coral()
            
            # Register agent capabilities
            await self._register_agent()
            
            logger.info(f"Payment Agent {self.agent_id} initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize payment agent: {e}")
            raise
    
    async def _connect_to_coral(self):
        """Connect to Coral Protocol server"""
        try:
            coral_server_params = StdioServerParameters(
                command="coral-server",
                args=["--port", "8080", "--agent-registry"]
            )
            
            async with stdio_client(coral_server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    self.mcp_clients["coral"] = session
                    logger.info("Connected to Coral Protocol server")
                    
        except Exception as e:
            logger.error(f"Failed to connect to Coral Protocol: {e}")
            # For development, continue without connection
            logger.info("Running in development mode - Coral Protocol not available")
    
    async def _register_agent(self):
        """Register this agent with Coral Protocol registry"""
        if not self.mcp_clients.get("coral"):
            logger.info("Skipping agent registration - Coral Protocol not connected")
            return
            
        try:
            agent_info = {
                "agent_id": self.agent_id,
                "name": self.agent_name,
                "version": self.version,
                "capabilities": self.capabilities,
                "description": "AI-powered cross-border payment agent with fraud detection and sub-second settlement",
                "endpoints": {
                    "process_payment": "/api/payment/process",
                    "check_status": "/api/payment/status",
                    "get_metrics": "/api/payment/metrics"
                },
                "supported_currencies": ["USD", "EUR", "PHP", "INR", "BRL", "MXN"],
                "max_amount": 100000,
                "min_amount": 1,
                "fee_structure": "0.01% + ORGO burn",
                "settlement_time": "< 1 second"
            }
            
            # Register with Coral Registry
            await self.mcp_clients["coral"].call_tool(
                "register_agent",
                agent_info
            )
            
            logger.info(f"Agent {self.agent_id} registered with Coral Registry")
            
        except Exception as e:
            logger.error(f"Failed to register agent: {e}")
    
    async def process_payment(self, request: PaymentRequest) -> PaymentResult:
        """
        Process a cross-border payment request
        
        This is the main function that other systems can call via Coral Protocol
        """
        session_id = request.session_id
        start_time = datetime.now()
        
        try:
            # Store session
            self.active_sessions[session_id] = {
                "request": asdict(request),
                "start_time": start_time,
                "status": "processing"
            }
            
            logger.info(f"Processing payment request: {request.amount} {request.currency_from} -> {request.currency_to}")
            
            # Step 1: Enhanced Fraud Detection with Aethir GPU
            fraud_score, fraud_details = await self._detect_fraud_enhanced(request)
            if fraud_score > 7.0:
                raise Exception(f"Transaction rejected - High fraud risk: {fraud_score}/10 (Aethir GPU Analysis)")
            
            # Step 2: Currency Conversion
            conversion_rate = await self._get_conversion_rate(request.currency_from, request.currency_to)
            amount_received = request.amount * conversion_rate
            
            # Step 3: Calculate Fees
            fee = await self._calculate_fee(request.amount)
            
            # Step 4: Execute Payment
            transaction_id = await self._execute_payment(request, amount_received, fee)
            
            # Step 5: Burn ORGO Tokens
            orgo_burned = await self._burn_orgo_tokens(request.amount)
            
            # Step 6: Generate Blockchain Transaction
            blockchain_tx_hash = await self._create_blockchain_transaction(transaction_id)
            
            end_time = datetime.now()
            processing_time = int((end_time - start_time).total_seconds() * 1000)
            
            result = PaymentResult(
                transaction_id=transaction_id,
                status="completed",
                amount_sent=request.amount,
                amount_received=amount_received,
                fee=fee,
                processing_time_ms=processing_time,
                orgo_burned=orgo_burned,
                fraud_score=fraud_score,
                timestamp=end_time.isoformat(),
                blockchain_tx_hash=blockchain_tx_hash
            )
            
            # Add Aethir processing details to result
            if fraud_details:
                result.aethir_details = fraud_details
            
            # Update session
            self.active_sessions[session_id]["result"] = asdict(result)
            self.active_sessions[session_id]["status"] = "completed"
            
            logger.info(f"Payment completed successfully: {transaction_id}")
            return result
            
        except Exception as e:
            logger.error(f"Payment processing failed: {e}")
            
            end_time = datetime.now()
            processing_time = int((end_time - start_time).total_seconds() * 1000)
            
            result = PaymentResult(
                transaction_id=str(uuid.uuid4()),
                status="failed",
                amount_sent=request.amount,
                amount_received=0,
                fee=0,
                processing_time_ms=processing_time,
                orgo_burned=0,
                fraud_score=10.0,
                timestamp=end_time.isoformat()
            )
            
            self.active_sessions[session_id]["result"] = asdict(result)
            self.active_sessions[session_id]["status"] = "failed"
            
            return result
    
    async def _detect_fraud_enhanced(self, request: PaymentRequest) -> tuple[float, Dict[str, Any]]:
        """AI-powered fraud detection enhanced with Aethir GPU compute"""
        # Try Aethir GPU-accelerated fraud detection first
        try:
            logger.info("🚀 Using Aethir GPU for payment fraud detection...")
            transaction_data = {
                "amount": request.amount,
                "currency_from": request.currency_from,
                "currency_to": request.currency_to,
                "recipient": request.recipient,
                "purpose": request.purpose,
                "user_id": request.user_id,
                "session_id": request.session_id
            }
            
            aethir_result = await aethir_detect_fraud(transaction_data)
            
            if not aethir_result.get('error'):
                gpu_score = aethir_result.get('fraud_score', 5.0)
                gpu_details = {
                    "aethir_gpu_used": True,
                    "processing_node": aethir_result.get('processing_node'),
                    "model_type": aethir_result.get('model_type'),
                    "risk_factors": aethir_result.get('risk_factors', []),
                    "confidence": aethir_result.get('confidence', 0.95)
                }
                
                logger.info(f"✅ Aethir GPU fraud score: {gpu_score:.2f}")
                return gpu_score, gpu_details
            else:
                logger.warning(f"⚠️ Aethir GPU analysis failed: {aethir_result.get('error')}")
        except Exception as gpu_error:
            logger.warning(f"⚠️ Aethir GPU unavailable: {gpu_error}")
        
        # Fallback to local analysis
        logger.info("🔧 Using local fraud detection...")
        await asyncio.sleep(0.1)  # Simulate processing time
        
        fraud_score = 0.0
        risk_factors = []
        
        # Amount-based risk assessment
        if request.amount > 100000:
            fraud_score += 3.0
            risk_factors.append("very_high_amount")
        elif request.amount > 50000:
            fraud_score += 2.0
            risk_factors.append("high_amount")
        elif request.amount > 10000:
            fraud_score += 1.0
            risk_factors.append("medium_amount")
        
        # Currency risk assessment
        high_risk_currencies = ["PHP", "INR", "BRL", "MXN"]
        medium_risk_currencies = ["EUR", "GBP", "CAD", "AUD"]
        
        if request.currency_to in high_risk_currencies:
            fraud_score += 1.5
            risk_factors.append("high_risk_currency")
        elif request.currency_to in medium_risk_currencies:
            fraud_score += 0.5
            risk_factors.append("medium_risk_currency")
        
        # Time-based risk (simulate business hours)
        current_hour = datetime.now().hour
        if current_hour < 6 or current_hour > 22:  # Outside business hours
            fraud_score += 0.5
            risk_factors.append("off_hours_transaction")
        
        # Purpose-based risk
        suspicious_purposes = ["urgent", "emergency", "family_emergency"]
        if any(purpose in request.purpose.lower() for purpose in suspicious_purposes):
            fraud_score += 1.0
            risk_factors.append("suspicious_purpose")
        
        # Cross-border risk
        if request.currency_from != request.currency_to:
            fraud_score += 0.5
            risk_factors.append("cross_border")
        
        # Session-based risk (simulate user behavior)
        if hasattr(request, 'user_id') and request.user_id:
            # In a real system, you'd check user history here
            fraud_score += 0.2
            risk_factors.append("new_user")
        
        # Add some randomness for simulation
        import random
        fraud_score += random.uniform(-0.5, 0.5)
        
        # Log risk assessment
        logger.info(f"Fraud detection for {request.amount} {request.currency_from} -> {request.currency_to}")
        logger.info(f"Risk factors: {risk_factors}")
        logger.info(f"Final fraud score: {fraud_score:.2f}")
        
        final_score = min(max(fraud_score, 0.0), 10.0)
        local_details = {
            "aethir_gpu_used": False,
            "fallback_mode": True,
            "risk_factors": risk_factors,
            "local_analysis": True
        }
        
        logger.info(f"📊 Local fraud score: {final_score:.2f}")
        return final_score, local_details
    
    async def _get_conversion_rate(self, from_currency: str, to_currency: str) -> float:
        """Get real-time conversion rate from external API"""
        try:
            # Use exchangerate-api.com for real conversion rates
            async with aiohttp.ClientSession() as session:
                url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("rates", {}).get(to_currency, 1.0)
                    else:
                        logger.warning(f"Failed to fetch conversion rate: {response.status}")
                        return self._get_fallback_rate(from_currency, to_currency)
        except Exception as e:
            logger.error(f"Error fetching conversion rate: {e}")
            return self._get_fallback_rate(from_currency, to_currency)
    
    def _get_fallback_rate(self, from_currency: str, to_currency: str) -> float:
        """Fallback conversion rates if API fails"""
        rates = {
            "USD_PHP": 56.5,
            "USD_INR": 83.2,
            "USD_BRL": 5.1,
            "USD_MXN": 17.8,
            "USD_EUR": 0.92,
            "USD_GBP": 0.79,
            "USD_JPY": 150.0,
            "USD_CAD": 1.35,
            "USD_AUD": 1.52
        }
        
        key = f"{from_currency}_{to_currency}"
        return rates.get(key, 1.0)
    
    async def _calculate_fee(self, amount: float) -> float:
        """Calculate processing fee"""
        # 0.01% fee + $1 minimum
        fee = max(amount * 0.0001, 1.0)
        return fee
    
    async def _execute_payment(self, request: PaymentRequest, amount_received: float, fee: float) -> str:
        """Execute the actual payment"""
        # Simulate payment processing
        await asyncio.sleep(0.2)  # Simulate network delay
        
        transaction_id = f"TXN_{uuid.uuid4().hex[:8].upper()}"
        logger.info(f"Payment executed: {transaction_id}")
        
        return transaction_id
    
    async def _burn_orgo_tokens(self, amount: float) -> float:
        """Burn ORGO tokens for deflationary mechanics"""
        # Burn 0.1% of transaction amount in ORGO tokens
        orgo_burned = amount * 0.001
        logger.info(f"Burned {orgo_burned} ORGO tokens")
        return orgo_burned
    
    async def _create_blockchain_transaction(self, transaction_id: str) -> str:
        """Create blockchain transaction record"""
        # Simulate blockchain transaction
        await asyncio.sleep(0.1)
        
        tx_hash = f"0x{uuid.uuid4().hex}"
        logger.info(f"Blockchain transaction created: {tx_hash}")
        
        return tx_hash
    
    async def get_payment_status(self, transaction_id: str) -> Dict[str, Any]:
        """Get status of a payment transaction"""
        for session in self.active_sessions.values():
            if session.get("result", {}).get("transaction_id") == transaction_id:
                return session["result"]
        
        return {"error": "Transaction not found"}
    
    async def get_agent_metrics(self) -> Dict[str, Any]:
        """Get agent performance metrics"""
        total_transactions = len(self.active_sessions)
        successful_transactions = sum(1 for s in self.active_sessions.values() 
                                   if s.get("status") == "completed")
        
        total_orgo_burned = sum(s.get("result", {}).get("orgo_burned", 0) 
                               for s in self.active_sessions.values())
        
        avg_processing_time = 0
        if self.active_sessions:
            total_time = sum(s.get("result", {}).get("processing_time_ms", 0) 
                           for s in self.active_sessions.values())
            avg_processing_time = total_time / len(self.active_sessions)
        
        return {
            "total_transactions": total_transactions,
            "successful_transactions": successful_transactions,
            "success_rate": (successful_transactions / total_transactions * 100) if total_transactions > 0 else 0,
            "total_orgo_burned": total_orgo_burned,
            "average_processing_time_ms": avg_processing_time,
            "agent_uptime": "100%",
            "last_updated": datetime.now().isoformat()
        }
    
    async def handle_coral_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle requests from Coral Protocol
        
        This is the main entry point for other agents/systems to interact with this agent
        """
        action = request_data.get("action")
        
        if action == "process_payment":
            payment_request = PaymentRequest(**request_data.get("payment_request", {}))
            result = await self.process_payment(payment_request)
            return {"result": asdict(result)}
            
        elif action == "get_status":
            transaction_id = request_data.get("transaction_id")
            status = await self.get_payment_status(transaction_id)
            return {"status": status}
            
        elif action == "get_metrics":
            metrics = await self.get_agent_metrics()
            return {"metrics": metrics}
            
        else:
            return {"error": f"Unknown action: {action}"}

# Agent Registry Entry Point
async def create_payment_agent() -> CoralPaymentAgent:
    """Factory function to create a payment agent instance"""
    agent = CoralPaymentAgent()
    await agent.initialize()
    return agent

if __name__ == "__main__":
    # Run the agent
    async def main():
        agent = await create_payment_agent()
        
        # Keep the agent running
        logger.info("Payment Agent is running and ready to process requests...")
        
        # Example usage
        sample_request = PaymentRequest(
            amount=1000.0,
            currency_from="USD",
            currency_to="PHP",
            recipient="Philippines",
            purpose="Family support",
            session_id="demo_session_001"
        )
        
        result = await agent.process_payment(sample_request)
        logger.info(f"Sample payment result: {result}")
        
        # Keep running
        while True:
            await asyncio.sleep(1)
    
    asyncio.run(main())
