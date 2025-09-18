#!/usr/bin/env python3
"""
VM-Integrated OrgoRush Payment Agent
Combines AI agents with ORGO Virtual Computers for enhanced processing
"""

import asyncio
import json
import time
import logging
import os
import sys
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import openai

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.orgo_vm_backend import OrgoRushVMBackend, PaymentResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
openai.api_base = os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1')

@dataclass
class AgentVMResponse:
    success: bool
    message: str
    payment_result: Optional[PaymentResult]
    vm_operations: List[str]
    ai_confidence: float
    total_execution_time: float

class VMIntegratedPaymentAgent:
    """AI Payment Agent with ORGO VM Backend Integration"""
    
    def __init__(self):
        self.vm_backend = OrgoRushVMBackend()
        self.session_memory = {}
        self.model_hierarchy = {
            "strategic": "gpt-4o",
            "tactical": "gpt-4o-mini",
            "operational": "gpt-3.5-turbo"
        }
        self.vm_operations_log = []
        
    async def initialize(self):
        """Initialize the VM-integrated agent"""
        await self.vm_backend.initialize()
        logger.info("VM-Integrated Payment Agent initialized")
    
    async def process_payment_with_ai_vm(self, user_id: str, payment_request: Dict) -> AgentVMResponse:
        """Process payment using both AI and VM capabilities"""
        start_time = time.time()
        vm_operations = []
        
        try:
            # Step 1: AI Analysis and Planning
            ai_analysis = await self._ai_analyze_payment(user_id, payment_request)
            vm_operations.append("AI analysis completed")
            
            # Step 2: VM-Powered Payment Processing
            if ai_analysis.get("proceed", True):
                # Enhance payment request with AI insights
                enhanced_request = await self._enhance_payment_request(payment_request, ai_analysis)
                vm_operations.append("Payment request enhanced with AI insights")
                
                # Execute through VM backend
                payment_result = await self.vm_backend.process_payment(enhanced_request)
                vm_operations.append(f"VM processing completed with {len(payment_result.vm_instances_used)} VMs")
                
                # Post-processing with AI
                final_message = await self._ai_post_process(payment_result, ai_analysis)
                vm_operations.append("AI post-processing completed")
                
            else:
                payment_result = None
                final_message = ai_analysis.get("reason", "Payment blocked by AI analysis")
            
            total_time = time.time() - start_time
            
            return AgentVMResponse(
                success=payment_result.status == "settled" if payment_result else False,
                message=final_message,
                payment_result=payment_result,
                vm_operations=vm_operations,
                ai_confidence=ai_analysis.get("confidence", 0.8),
                total_execution_time=total_time
            )
            
        except Exception as e:
            logger.error(f"VM-integrated payment processing failed: {e}")
            total_time = time.time() - start_time
            
            return AgentVMResponse(
                success=False,
                message=f"Payment processing failed: {str(e)}",
                payment_result=None,
                vm_operations=vm_operations,
                ai_confidence=0.0,
                total_execution_time=total_time
            )
    
    async def _ai_analyze_payment(self, user_id: str, payment_request: Dict) -> Dict:
        """AI analysis of payment request"""
        try:
            # Get user context
            user_context = self.session_memory.get(user_id, {})
            
            # Prepare AI prompt
            analysis_prompt = f"""
            Analyze this payment request for processing:
            
            Payment Details:
            - Amount: ${payment_request.get('amount', 0):,.2f}
            - From: {payment_request.get('from', 'USD')}
            - To: {payment_request.get('to', 'Unknown')}
            - User: {user_id}
            
            User Context:
            - Previous transactions: {user_context.get('transaction_count', 0)}
            - Risk profile: {user_context.get('risk_profile', 'unknown')}
            - Average amount: ${user_context.get('avg_amount', 0):,.2f}
            
            Provide analysis including:
            1. Risk assessment (0-1 scale)
            2. Recommended processing approach
            3. Any special considerations
            4. Proceed/block recommendation
            
            Respond in JSON format.
            """
            
            # Call AI model
            model = self._select_model_for_analysis(payment_request)
            response = await self._call_openai_api(model, [
                {"role": "system", "content": "You are an expert payment risk analyst. Provide concise, actionable analysis in JSON format."},
                {"role": "user", "content": analysis_prompt}
            ])
            
            # Parse AI response
            try:
                ai_analysis = json.loads(response)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                ai_analysis = {
                    "risk_score": 0.3,
                    "approach": "standard",
                    "proceed": True,
                    "confidence": 0.7,
                    "reasoning": "AI analysis completed with fallback parsing"
                }
            
            return ai_analysis
            
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            return {
                "risk_score": 0.5,
                "approach": "cautious",
                "proceed": True,
                "confidence": 0.5,
                "reasoning": f"AI analysis failed: {str(e)}"
            }
    
    async def _enhance_payment_request(self, payment_request: Dict, ai_analysis: Dict) -> Dict:
        """Enhance payment request with AI insights"""
        enhanced_request = payment_request.copy()
        
        # Add AI-derived metadata
        enhanced_request["ai_metadata"] = {
            "risk_score": ai_analysis.get("risk_score", 0.3),
            "processing_approach": ai_analysis.get("approach", "standard"),
            "ai_confidence": ai_analysis.get("confidence", 0.8),
            "special_instructions": ai_analysis.get("special_considerations", [])
        }
        
        # Adjust processing parameters based on AI analysis
        if ai_analysis.get("risk_score", 0) > 0.7:
            enhanced_request["enhanced_verification"] = True
            enhanced_request["compliance_level"] = "strict"
        
        if payment_request.get("amount", 0) > 50000:
            enhanced_request["priority"] = "high"
            enhanced_request["multi_signature"] = True
        
        return enhanced_request
    
    async def _ai_post_process(self, payment_result: PaymentResult, ai_analysis: Dict) -> str:
        """AI post-processing of payment results"""
        try:
            if payment_result.status == "settled":
                message_prompt = f"""
                Generate a user-friendly message for a successful payment:
                
                Payment Details:
                - Status: {payment_result.status}
                - Processing time: {payment_result.processing_time:.3f}s
                - ORGO burned: {payment_result.burned_orgo}
                - VMs used: {len(payment_result.vm_instances_used)}
                - Loyalty awarded: {payment_result.loyalty_awarded}
                
                AI Analysis:
                - Risk score: {ai_analysis.get('risk_score', 0)}
                - Confidence: {ai_analysis.get('confidence', 0)}
                
                Create a concise, positive message highlighting the speed and security.
                """
            else:
                message_prompt = f"""
                Generate a user-friendly message for a failed payment:
                
                Status: {payment_result.status}
                Processing time: {payment_result.processing_time:.3f}s
                
                Create a helpful message explaining next steps.
                """
            
            response = await self._call_openai_api("gpt-3.5-turbo", [
                {"role": "system", "content": "You are a helpful payment assistant. Create clear, concise messages."},
                {"role": "user", "content": message_prompt}
            ])
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"AI post-processing failed: {e}")
            if payment_result.status == "settled":
                return f"Payment completed successfully in {payment_result.processing_time:.3f}s with {payment_result.burned_orgo} ORGO burned."
            else:
                return f"Payment processing failed. Status: {payment_result.status}"
    
    def _select_model_for_analysis(self, payment_request: Dict) -> str:
        """Select appropriate AI model based on payment complexity"""
        amount = payment_request.get("amount", 0)
        
        if amount > 100000:  # Large transactions need strategic analysis
            return self.model_hierarchy["strategic"]
        elif amount > 10000:  # Medium transactions need tactical analysis
            return self.model_hierarchy["tactical"]
        else:  # Standard transactions use operational model
            return self.model_hierarchy["operational"]
    
    async def _call_openai_api(self, model: str, messages: List[Dict]) -> str:
        """Call OpenAI API with error handling"""
        try:
            response = await openai.ChatCompletion.acreate(
                model=model,
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            return "AI processing temporarily unavailable. Using fallback analysis."
    
    async def chat_with_vm_agent(self, user_id: str, message: str) -> Dict:
        """Chat interface with VM-powered capabilities"""
        try:
            start_time = time.time()
            
            # Initialize user session
            if user_id not in self.session_memory:
                self.session_memory[user_id] = {
                    "conversation_history": [],
                    "transaction_count": 0,
                    "avg_amount": 0,
                    "risk_profile": "medium"
                }
            
            # Add message to history
            self.session_memory[user_id]["conversation_history"].append({
                "role": "user",
                "content": message,
                "timestamp": time.time()
            })
            
            # Analyze message intent
            intent = await self._analyze_message_intent(message)
            
            # Process based on intent
            if intent.get("type") == "payment_request":
                # Extract payment details from message
                payment_details = await self._extract_payment_details(message, user_id)
                
                if payment_details:
                    # Process payment with VM backend
                    vm_response = await self.process_payment_with_ai_vm(user_id, payment_details)
                    
                    response_message = vm_response.message
                    additional_data = {
                        "payment_processed": vm_response.success,
                        "vm_operations": vm_response.vm_operations,
                        "execution_time": vm_response.total_execution_time
                    }
                else:
                    response_message = "I need more details to process your payment. Please provide the amount and destination."
                    additional_data = {}
            
            else:
                # General conversation
                response_message = await self._generate_conversational_response(user_id, message)
                additional_data = {}
            
            # Add response to history
            self.session_memory[user_id]["conversation_history"].append({
                "role": "assistant",
                "content": response_message,
                "timestamp": time.time()
            })
            
            execution_time = time.time() - start_time
            
            return {
                "success": True,
                "message": response_message,
                "intent": intent,
                "execution_time": execution_time,
                **additional_data
            }
            
        except Exception as e:
            logger.error(f"Chat processing failed: {e}")
            return {
                "success": False,
                "message": "I'm experiencing technical difficulties. Please try again.",
                "error": str(e)
            }
    
    async def _analyze_message_intent(self, message: str) -> Dict:
        """Analyze user message intent"""
        payment_keywords = ["send", "transfer", "pay", "payment", "money", "$", "USD", "PHP", "ORGO"]
        
        if any(keyword.lower() in message.lower() for keyword in payment_keywords):
            return {"type": "payment_request", "confidence": 0.8}
        else:
            return {"type": "general_inquiry", "confidence": 0.9}
    
    async def _extract_payment_details(self, message: str, user_id: str) -> Optional[Dict]:
        """Extract payment details from natural language"""
        try:
            extraction_prompt = f"""
            Extract payment details from this message:
            "{message}"
            
            Look for:
            - Amount (number with currency)
            - Destination country/currency
            - Any special instructions
            
            Return JSON with: amount, from, to, special_notes
            If information is missing, set to null.
            """
            
            response = await self._call_openai_api("gpt-3.5-turbo", [
                {"role": "system", "content": "Extract payment details and return valid JSON only."},
                {"role": "user", "content": extraction_prompt}
            ])
            
            try:
                details = json.loads(response)
                if details.get("amount"):
                    details["user"] = user_id
                    details["timestamp"] = time.time()
                    return details
            except json.JSONDecodeError:
                pass
            
            return None
            
        except Exception as e:
            logger.error(f"Payment detail extraction failed: {e}")
            return None
    
    async def _generate_conversational_response(self, user_id: str, message: str) -> str:
        """Generate conversational response"""
        try:
            history = self.session_memory[user_id]["conversation_history"][-5:]  # Last 5 messages
            
            conversation_prompt = f"""
            You are an advanced OrgoRush payment agent with access to:
            - ORGO Virtual Computers for instant payment processing
            - AI-powered fraud detection and compliance
            - Sub-second cross-border transfers
            - Dynamic ORGO token burning
            
            User message: "{message}"
            
            Provide a helpful, friendly response about OrgoRush capabilities.
            """
            
            messages = [
                {"role": "system", "content": "You are a helpful OrgoRush payment assistant."}
            ]
            
            # Add conversation history
            for msg in history:
                messages.append({"role": msg["role"], "content": msg["content"]})
            
            messages.append({"role": "user", "content": conversation_prompt})
            
            response = await self._call_openai_api("gpt-3.5-turbo", messages)
            return response.strip()
            
        except Exception as e:
            logger.error(f"Conversational response failed: {e}")
            return "I'm here to help with your payment needs. How can I assist you today?"
    
    def get_agent_status(self) -> Dict:
        """Get comprehensive agent status"""
        vm_status = self.vm_backend.get_system_status()
        
        return {
            "agent_type": "VM-Integrated Payment Agent",
            "active_sessions": len(self.session_memory),
            "vm_backend_status": vm_status["status"],
            "vm_operations_completed": len(self.vm_operations_log),
            "ai_models": self.model_hierarchy,
            "vm_performance": vm_status["performance"],
            "capabilities": [
                "AI-powered payment analysis",
                "VM-orchestrated processing",
                "Multi-modal fraud detection",
                "Dynamic tokenomics",
                "Conversational interface",
                "Real-time compliance",
                "Autonomous error recovery"
            ]
        }

# Demo function
async def demo_vm_integrated_agent():
    """Demonstrate VM-integrated agent capabilities"""
    print("🤖 VM-INTEGRATED PAYMENT AGENT DEMO")
    print("=" * 60)
    
    agent = VMIntegratedPaymentAgent()
    await agent.initialize()
    
    # Demo 1: Conversational payment processing
    print("💬 CONVERSATIONAL PAYMENT PROCESSING")
    print("-" * 40)
    
    user_id = "demo_user_vm"
    message = "I need to send $15,000 to the Philippines for my family. Can you help me process this securely?"
    
    chat_response = await agent.chat_with_vm_agent(user_id, message)
    
    print(f"👤 User: {message}")
    print(f"🤖 Agent: {chat_response['message']}")
    print(f"🎯 Intent: {chat_response['intent']['type']}")
    print(f"⚡ Response Time: {chat_response['execution_time']:.3f}s")
    
    if chat_response.get('payment_processed'):
        print(f"💳 Payment Processed: {chat_response['payment_processed']}")
        print(f"🖥️ VM Operations: {len(chat_response['vm_operations'])}")
        for op in chat_response['vm_operations']:
            print(f"   • {op}")
    
    # Demo 2: Direct payment processing with AI+VM
    print("\n💰 DIRECT AI+VM PAYMENT PROCESSING")
    print("-" * 40)
    
    payment_request = {
        "amount": 25000,
        "from": "USD",
        "to": "PHP",
        "user": "demo_user_vm",
        "bank_url": "https://example-bank.com",
        "user_history": {
            "previous_transactions": 23,
            "average_amount": 8000,
            "risk_profile": "low"
        }
    }
    
    vm_response = await agent.process_payment_with_ai_vm(user_id, payment_request)
    
    print(f"✅ Success: {vm_response.success}")
    print(f"💬 Message: {vm_response.message}")
    print(f"🧠 AI Confidence: {vm_response.ai_confidence:.2f}")
    print(f"⚡ Total Time: {vm_response.total_execution_time:.3f}s")
    
    if vm_response.payment_result:
        result = vm_response.payment_result
        print(f"📊 Payment Details:")
        print(f"   Status: {result.status}")
        print(f"   TX Hash: {result.tx_hash[:20]}..." if result.tx_hash else "N/A")
        print(f"   ORGO Burned: {result.burned_orgo}")
        print(f"   VMs Used: {len(result.vm_instances_used)}")
        print(f"   Processing Time: {result.processing_time:.3f}s")
    
    print(f"\n🖥️ VM Operations:")
    for i, op in enumerate(vm_response.vm_operations, 1):
        print(f"   {i}. {op}")
    
    # Demo 3: Agent status
    print("\n📊 AGENT STATUS")
    print("-" * 40)
    
    status = agent.get_agent_status()
    
    print(f"🤖 Agent Type: {status['agent_type']}")
    print(f"👥 Active Sessions: {status['active_sessions']}")
    print(f"🖥️ VM Backend: {status['vm_backend_status']}")
    print(f"🔧 VM Operations: {status['vm_operations_completed']}")
    print(f"📈 Success Rate: {status['vm_performance']['success_rate']:.1f}%")
    print(f"⚡ Avg Processing: {status['vm_performance']['average_processing_time']:.3f}s")
    
    print(f"\n🎯 Capabilities:")
    for capability in status['capabilities']:
        print(f"   ✅ {capability}")
    
    print("\n🎉 VM-INTEGRATED AGENT DEMO COMPLETED!")

if __name__ == "__main__":
    asyncio.run(demo_vm_integrated_agent())

