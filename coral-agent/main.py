#!/usr/bin/env python3
"""
Coral Protocol Voice Interface Agent
Real-time voice interface agent that coordinates communication between users and specialized agents.
Built on LiveKit with Coral Protocol integration.
"""

import asyncio
import os
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass
import json
import aiohttp

# LiveKit imports
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit import rtc
from livekit.plugins import openai

# Coral Protocol imports (MCP)
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class AgentCapabilities:
    """Define agent capabilities"""
    speech_to_text: bool = True
    text_to_speech: bool = True
    intent_analysis: bool = True
    blockchain_operations: bool = True
    payment_processing: bool = True

class CoralVoiceAgent:
    """Main Coral Protocol Voice Agent"""
    
    def __init__(self):
        self.capabilities = AgentCapabilities()
        self.active_sessions: Dict[str, Dict] = {}
        self.mcp_clients: Dict[str, ClientSession] = {}
        self.coral_server_url: Optional[str] = None
        
    async def initialize_coral_connection(self):
        """Initialize connection to Coral Protocol"""
        try:
            # Connect to Coral Server via HTTP API
            coral_server_url = os.getenv("CORAL_SERVER_URL", "http://localhost:8080")
            
            # Register this agent with Coral Server
            agent_data = {
                "agent_id": "voice-listener-agent",
                "name": "Voice Listener Agent",
                "version": "1.0.0",
                "capabilities": ["speech-to-text", "text-to-speech", "voice-processing"],
                "description": "Handles voice input/output using ElevenLabs API",
                "endpoint": "/api/agents/voice-listener"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{coral_server_url}/api/agents/register", json=agent_data) as response:
                    if response.status == 200:
                        logger.info("Successfully registered with Coral Protocol server")
                        self.coral_server_url = coral_server_url
                    else:
                        logger.warning(f"Failed to register with Coral server: {response.status}")
                        self.coral_server_url = None
                        
        except Exception as e:
            logger.error(f"Failed to connect to Coral Protocol: {e}")
            # Fallback to mock mode for development
            logger.info("Running in mock mode - Coral Protocol not available")
            self.coral_server_url = None
    
    async def process_voice_input(self, audio_data: bytes, session_id: str) -> Dict:
        """Process voice input through Coral Protocol"""
        try:
            # Convert audio to text using LiveKit
            transcription = await self._transcribe_audio(audio_data)
            
            # Route to appropriate agent via Coral Protocol
            if self.mcp_clients.get("coral"):
                result = await self._route_to_coral_agent(transcription, session_id)
            else:
                # Mock response for development
                result = await self._mock_agent_response(transcription, session_id)
            
            # Generate voice response
            audio_response = await self._generate_voice_response(result["response"])
            
            return {
                "transcription": transcription,
                "intent": result["intent"],
                "response": result["response"],
                "audio_response": audio_response,
                "session_id": session_id
            }
            
        except Exception as e:
            logger.error(f"Error processing voice input: {e}")
            return {
                "error": str(e),
                "session_id": session_id
            }
    
    async def _transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio using LiveKit STT"""
        # This would integrate with LiveKit's STT capabilities
        # For now, return mock transcription for hackathon demo
        return "Send $10,000 to Philippines for family support"
    
    async def _route_to_coral_agent(self, transcription: str, session_id: str) -> Dict:
        """Route transcription to Coral Protocol agent"""
        try:
            if not self.coral_server_url:
                return await self._mock_agent_response(transcription, session_id)
            
            # Execute voice payment workflow
            workflow_data = {
                "voice_input": transcription,
                "user_id": f"voice_user_{session_id}",
                "session_id": session_id
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.coral_server_url}/api/workflows/voice_payment_workflow/execute",
                    json=workflow_data
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        execution_id = data.get("execution_id")
                        
                        # Wait for workflow completion
                        result = await self._wait_for_workflow_completion(session, execution_id)
                        return result
                    else:
                        logger.error(f"Failed to execute workflow: {response.status}")
                        return await self._mock_agent_response(transcription, session_id)
            
        except Exception as e:
            logger.error(f"Error routing to Coral agent: {e}")
            return await self._mock_agent_response(transcription, session_id)
    
    async def _wait_for_workflow_completion(self, session: aiohttp.ClientSession, execution_id: str) -> Dict:
        """Wait for workflow completion and return result"""
        max_attempts = 30  # 30 seconds timeout
        attempt = 0
        
        while attempt < max_attempts:
            try:
                async with session.get(f"{self.coral_server_url}/api/workflows/executions/{execution_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        status = data.get("status")
                        
                        if status == "completed":
                            results = data.get("results", {})
                            
                            # Extract payment result
                            payment_result = results.get("payment_processing", {})
                            if payment_result and payment_result.get("success"):
                                return {
                                    "intent": "payment_completed",
                                    "response": f"Payment completed successfully! Transaction ID: {payment_result.get('payment_result', {}).get('transaction_id', 'N/A')}",
                                    "actions": ["payment_completed"],
                                    "payment_result": payment_result.get("payment_result")
                                }
                            else:
                                return {
                                    "intent": "payment_failed",
                                    "response": "Payment processing failed. Please try again.",
                                    "actions": ["payment_failed"]
                                }
                        
                        elif status == "failed":
                            error = data.get("error_message", "Unknown error")
                            return {
                                "intent": "workflow_failed",
                                "response": f"Workflow failed: {error}",
                                "actions": ["workflow_failed"]
                            }
                        
                        attempt += 1
                        await asyncio.sleep(1)
                    else:
                        logger.error(f"Failed to get workflow status: {response.status}")
                        break
            except Exception as e:
                logger.error(f"Workflow monitoring error: {e}")
                break
        
        # Timeout or error
        return {
            "intent": "timeout",
            "response": "Request timed out. Please try again.",
            "actions": ["timeout"]
        }
    
    async def _mock_agent_response(self, transcription: str, session_id: str) -> Dict:
        """Mock agent response for development"""
        # Simulate agent processing
        await asyncio.sleep(0.5)
        
        # Enhanced intent detection for hackathon demo
        transcription_lower = transcription.lower()
        
        if "send" in transcription_lower and ("money" in transcription_lower or "$" in transcription_lower):
            # Extract amount and destination
            amount = "10,000"  # Default for demo
            destination = "Philippines"  # Default for demo
            
            # Look for amount in transcription
            import re
            amount_match = re.search(r'\$?([0-9,]+)', transcription)
            if amount_match:
                amount = amount_match.group(1)
            
            # Look for destination
            destinations = ["philippines", "india", "brazil", "mexico", "europe"]
            for dest in destinations:
                if dest in transcription_lower:
                    destination = dest.title()
                    break
            
            return {
                "intent": "payment_request",
                "response": f"I understand you want to send ${amount} to {destination}. Let me process this payment for you with Coral Protocol's multi-agent system.",
                "actions": ["voice_processing", "intent_analysis", "fraud_detection", "payment_processing"],
                "payment_result": {
                    "transaction_id": f"TXN_{session_id[:8].upper()}",
                    "status": "completed",
                    "amount_sent": float(amount.replace(",", "")),
                    "amount_received": float(amount.replace(",", "")) * 56.5,  # PHP conversion
                    "fee": 10,
                    "processing_time_ms": 300,
                    "orgo_burned": float(amount.replace(",", "")) * 0.001,
                    "blockchain_tx_hash": f"0x{session_id}",
                    "settlement_time": 0.3
                }
            }
        elif "transaction" in transcription_lower and "failed" in transcription_lower:
            return {
                "intent": "failed_transaction",
                "response": "I understand your frustration. I've processed a compensation NFT and initiated a refund to your wallet using Coral Protocol's executor agent.",
                "actions": ["check_transaction", "mint_compensation_nft", "initiate_refund"],
                "compensation_nft": {
                    "nft_id": f"nft_{session_id[:8]}",
                    "transaction_hash": f"tx_{session_id[:8]}",
                    "status": "completed",
                    "metadata": {
                        "name": "RUSH Support Resolution NFT",
                        "description": "Thank you for your patience while we resolved your Web3 support issue."
                    }
                }
            }
        elif "nft" in transcription_lower:
            return {
                "intent": "nft_inquiry",
                "response": "I can help you with NFT operations using Coral Protocol's executor agent. What would you like to do?",
                "actions": ["nft_operations"]
            }
        else:
            return {
                "intent": "general_inquiry",
                "response": "I'm here to help with your Web3 needs using Coral Protocol's multi-agent system. How can I assist you?",
                "actions": ["general_support"]
            }
    
    async def _generate_voice_response(self, text: str) -> bytes:
        """Generate voice response using LiveKit TTS"""
        # This would integrate with LiveKit's TTS capabilities
        # For now, return mock audio data
        return b"mock_audio_data"

class CoralVoiceAssistant(VoiceAssistant):
    """LiveKit Voice Assistant with Coral Protocol integration"""
    
    def __init__(self, ctx: JobContext):
        super().__init__(ctx)
        self.coral_agent = CoralVoiceAgent()
        await self.coral_agent.initialize_coral_connection()
    
    async def on_user_speech_committed(self, user_message: str):
        """Handle user speech input"""
        logger.info(f"User said: {user_message}")
        
        # Process through Coral Protocol
        result = await self.coral_agent.process_voice_input(
            user_message.encode(), 
            self.ctx.room.name
        )
        
        if "error" not in result:
            # Generate response
            response_text = result["response"]
            await self.say(response_text)
            
            # Log the interaction
            logger.info(f"Agent response: {response_text}")
        else:
            await self.say("I'm sorry, I encountered an error processing your request.")
    
    async def on_agent_speech_committed(self, agent_message: str):
        """Handle agent speech output"""
        logger.info(f"Agent said: {agent_message}")

async def entrypoint(ctx: JobContext):
    """Main entrypoint for the Coral Voice Agent"""
    logger.info("Starting Coral Protocol Voice Agent")
    
    # Initialize the voice assistant
    assistant = CoralVoiceAssistant(ctx)
    
    # Start the assistant
    await assistant.start()

if __name__ == "__main__":
    # Configure LiveKit worker
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            auto_subscribe=AutoSubscribe.AUDIO_ONLY,
        )
    )


