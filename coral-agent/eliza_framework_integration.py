#!/usr/bin/env python3
"""
Eliza Framework Integration
Integrates Eliza Framework for conversational AI with Web3 capabilities in the Coral Protocol system
"""

import asyncio
import json
import logging
import os
import re
from typing import Dict, Any, Optional, List, Union, Callable
from dataclasses import dataclass, field
from datetime import datetime
import aiohttp
import aiofiles
from pathlib import Path
import openai
from anthropic import AsyncAnthropic

logger = logging.getLogger(__name__)

@dataclass
class ElizaConfig:
    """Configuration for Eliza Framework"""
    personality_name: str = "Eliza"
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    default_model: str = "gpt-4"
    conversation_memory_limit: int = 100
    web3_enabled: bool = True
    voice_enabled: bool = True
    context_window: int = 4000

@dataclass
class ConversationContext:
    """Context for ongoing conversations"""
    session_id: str
    user_id: Optional[str] = None
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    user_profile: Dict[str, Any] = field(default_factory=dict)
    web3_context: Dict[str, Any] = field(default_factory=dict)
    preferences: Dict[str, Any] = field(default_factory=dict)
    last_interaction: Optional[datetime] = None

@dataclass
class ElizaResponse:
    """Response from Eliza Framework"""
    success: bool
    response_text: Optional[str] = None
    actions: List[Dict[str, Any]] = field(default_factory=list)
    web3_operations: List[Dict[str, Any]] = field(default_factory=list)
    confidence: float = 0.0
    processing_time: float = 0.0
    error_message: Optional[str] = None
    session_id: Optional[str] = None

class ElizaPersonality:
    """Base class for Eliza personalities"""
    
    def __init__(self, name: str, traits: Dict[str, Any]):
        self.name = name
        self.traits = traits
        self.conversation_patterns = []
        self.response_templates = []
        self.web3_knowledge = {}
    
    def get_system_prompt(self) -> str:
        """Get the system prompt for this personality"""
        return f"""You are {self.name}, a conversational AI assistant specializing in Web3 and blockchain technologies.

Personality Traits:
{self._format_traits()}

Core Capabilities:
- Expert knowledge of blockchain, DeFi, NFTs, and Web3 technologies
- Ability to execute Web3 operations through integrations
- Natural conversation with memory of previous interactions
- Voice interaction support
- Cross-border payment expertise
- Smart contract understanding

Communication Style:
- Be helpful, knowledgeable, and engaging
- Use natural conversation patterns
- Explain complex Web3 concepts in simple terms
- Suggest relevant actions when appropriate
- Remember context from previous conversations

When users ask about Web3 operations, offer to help execute them if possible.
Always prioritize user safety and security in Web3 interactions."""
    
    def _format_traits(self) -> str:
        """Format personality traits for the prompt"""
        return "\n".join([f"- {trait}: {value}" for trait, value in self.traits.items()])

class ElizaFrameworkAgent:
    """Eliza Framework agent for conversational AI with Web3 capabilities"""
    
    def __init__(self, config: ElizaConfig):
        self.config = config
        self.active_sessions: Dict[str, ConversationContext] = {}
        self.personalities: Dict[str, ElizaPersonality] = {}
        self.openai_client: Optional[openai.AsyncOpenAI] = None
        self.anthropic_client: Optional[AsyncAnthropic] = None
        
        # Available capabilities
        self.capabilities = [
            "natural_conversation",
            "web3_operations",
            "voice_interaction", 
            "context_memory",
            "personality_adaptation",
            "blockchain_explanations",
            "defi_guidance",
            "nft_assistance",
            "payment_processing",
            "smart_contract_interaction"
        ]
        
        # Conversation patterns and responses
        self.conversation_patterns = {
            # Greetings
            r"^(hi|hello|hey|good morning|good afternoon|good evening).*": [
                "Hello! I'm {personality_name}, your Web3 assistant. How can I help you today?",
                "Hi there! Ready to explore the world of Web3 together?",
                "Hey! What Web3 adventures can I help you with today?"
            ],
            
            # Web3 queries
            r".*(what is|explain|tell me about).*(blockchain|web3|defi|nft).*": [
                "I'd love to explain that! Let me break down {topic} for you in simple terms.",
                "Great question about {topic}! Here's what you need to know:",
                "That's one of my favorite topics! {topic} is fascinating because..."
            ],
            
            # Payment/transaction requests
            r".*(send|transfer|pay|payment).*(money|\$|dollar|crypto|token).*": [
                "I can help you with that payment! Let me guide you through the process safely.",
                "I'll help you process that transaction. First, let me verify the details with you.",
                "Let's handle that payment together. Security is our top priority!"
            ],
            
            # Help requests
            r".*(help|assist|support|problem|issue|stuck).*": [
                "I'm here to help! Can you tell me more about what you're trying to do?",
                "Of course! I specialize in Web3 support. What's the challenge you're facing?",
                "Let me assist you with that. What specific area do you need help with?"
            ],
            
            # Farewells
            r"^(bye|goodbye|see you|thanks|thank you).*": [
                "Goodbye! Feel free to come back anytime you need Web3 assistance!",
                "It was great chatting with you! Your Web3 journey awaits!",
                "Take care! Remember, I'm always here to help with Web3 questions."
            ]
        }
        
        # Web3 operation templates
        self.web3_operations = {
            "send_payment": {
                "description": "Process a cross-border payment",
                "parameters": ["amount", "recipient", "currency"],
                "safety_checks": ["verify_recipient", "confirm_amount", "check_balance"]
            },
            "mint_nft": {
                "description": "Mint a new NFT",
                "parameters": ["name", "description", "image_url"],
                "safety_checks": ["verify_metadata", "check_costs"]
            },
            "swap_tokens": {
                "description": "Swap one token for another",
                "parameters": ["from_token", "to_token", "amount"],
                "safety_checks": ["verify_rates", "check_slippage", "confirm_swap"]
            },
            "check_balance": {
                "description": "Check wallet balance",
                "parameters": ["wallet_address"],
                "safety_checks": ["verify_address"]
            }
        }
        
        # Pre-defined personalities
        self._initialize_personalities()
    
    async def initialize(self):
        """Initialize the Eliza Framework agent"""
        try:
            # Initialize AI clients
            if self.config.openai_api_key:
                self.openai_client = openai.AsyncOpenAI(
                    api_key=self.config.openai_api_key
                )
            
            if self.config.anthropic_api_key:
                self.anthropic_client = AsyncAnthropic(
                    api_key=self.config.anthropic_api_key
                )
            
            # Verify at least one AI provider is available
            if not self.openai_client and not self.anthropic_client:
                logger.warning("No AI provider configured, using mock responses")
            
            logger.info("✅ Eliza Framework agent initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Eliza Framework agent: {e}")
            return False
    
    def _initialize_personalities(self):
        """Initialize pre-defined personalities"""
        
        # Web3 Expert Personality
        web3_expert = ElizaPersonality(
            name="Web3 Expert Eliza",
            traits={
                "expertise": "Deep knowledge of blockchain technology",
                "communication_style": "Clear and educational",
                "helpfulness": "Always eager to explain and assist",
                "security_focus": "Prioritizes user safety in Web3 operations"
            }
        )
        
        # Friendly Assistant Personality  
        friendly_assistant = ElizaPersonality(
            name="Friendly Eliza",
            traits={
                "personality": "Warm and approachable",
                "communication_style": "Casual and conversational", 
                "enthusiasm": "Excited about Web3 possibilities",
                "patience": "Takes time to ensure user understanding"
            }
        )
        
        # DeFi Specialist Personality
        defi_specialist = ElizaPersonality(
            name="DeFi Specialist Eliza", 
            traits={
                "expertise": "Advanced DeFi protocols and strategies",
                "communication_style": "Technical but accessible",
                "risk_awareness": "Always mentions risks and considerations",
                "innovation_focus": "Keeps up with latest DeFi developments"
            }
        )
        
        self.personalities["web3_expert"] = web3_expert
        self.personalities["friendly_assistant"] = friendly_assistant
        self.personalities["defi_specialist"] = defi_specialist
    
    async def start_conversation(self, session_id: str, user_id: Optional[str] = None) -> ConversationContext:
        """Start a new conversation session"""
        try:
            context = ConversationContext(
                session_id=session_id,
                user_id=user_id,
                last_interaction=datetime.now()
            )
            
            self.active_sessions[session_id] = context
            
            logger.info(f"Started new conversation session: {session_id}")
            return context
            
        except Exception as e:
            logger.error(f"Failed to start conversation: {e}")
            raise
    
    async def process_message(self, session_id: str, message: str, context: Optional[Dict[str, Any]] = None) -> ElizaResponse:
        """Process a user message and generate response"""
        start_time = datetime.now()
        
        try:
            # Get or create conversation context
            if session_id not in self.active_sessions:
                await self.start_conversation(session_id)
            
            conversation_context = self.active_sessions[session_id]
            
            # Update context with new message
            conversation_context.conversation_history.append({
                "type": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Analyze message for intent and Web3 operations
            intent_analysis = await self._analyze_intent(message, conversation_context)
            
            # Generate response using AI
            response = await self._generate_response(message, conversation_context, intent_analysis)
            
            # Process any Web3 operations
            web3_operations = await self._process_web3_operations(intent_analysis, conversation_context)
            
            # Update conversation history
            conversation_context.conversation_history.append({
                "type": "assistant", 
                "content": response,
                "timestamp": datetime.now().isoformat(),
                "intent": intent_analysis,
                "web3_operations": web3_operations
            })
            
            # Limit conversation history
            if len(conversation_context.conversation_history) > self.config.conversation_memory_limit:
                conversation_context.conversation_history = conversation_context.conversation_history[-self.config.conversation_memory_limit:]
            
            conversation_context.last_interaction = datetime.now()
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ElizaResponse(
                success=True,
                response_text=response,
                actions=intent_analysis.get("actions", []),
                web3_operations=web3_operations,
                confidence=intent_analysis.get("confidence", 0.8),
                processing_time=processing_time,
                session_id=session_id
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Message processing failed: {e}")
            return ElizaResponse(
                success=False,
                error_message=str(e),
                processing_time=processing_time,
                session_id=session_id
            )
    
    async def _analyze_intent(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Analyze user message for intent and required actions"""
        
        intents = []
        confidence = 0.0
        actions = []
        web3_operations = []
        
        # Pattern matching for common intents
        for pattern, responses in self.conversation_patterns.items():
            if re.match(pattern, message.lower()):
                intents.append(pattern)
                confidence = max(confidence, 0.8)
        
        # Check for Web3 operation requests
        for operation, config in self.web3_operations.items():
            if any(keyword in message.lower() for keyword in operation.split("_")):
                web3_operations.append({
                    "operation": operation,
                    "confidence": 0.7,
                    "parameters_needed": config["parameters"],
                    "safety_checks": config["safety_checks"]
                })
        
        # Extract entities (amounts, addresses, tokens, etc.)
        entities = self._extract_entities(message)
        
        return {
            "intents": intents,
            "confidence": confidence,
            "actions": actions,
            "web3_operations": web3_operations,
            "entities": entities,
            "message_type": self._classify_message_type(message)
        }
    
    def _extract_entities(self, message: str) -> Dict[str, Any]:
        """Extract entities from user message"""
        entities = {}
        
        # Extract amounts (dollar amounts, token amounts, etc.)
        amount_patterns = [
            r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)',  # $1,000.00
            r'(\d+(?:,\d{3})*(?:\.\d+)?)\s*(dollars?|usd|sol|eth|btc)',  # 1000 SOL
        ]
        
        for pattern in amount_patterns:
            matches = re.findall(pattern, message, re.IGNORECASE)
            if matches:
                entities["amounts"] = matches
        
        # Extract wallet addresses (simplified)
        address_pattern = r'[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{32,44}'
        addresses = re.findall(address_pattern, message)
        if addresses:
            entities["addresses"] = addresses
        
        # Extract country/location mentions
        countries = ["philippines", "india", "mexico", "nigeria", "vietnam", "brazil"]
        mentioned_countries = [country for country in countries if country in message.lower()]
        if mentioned_countries:
            entities["countries"] = mentioned_countries
        
        return entities
    
    def _classify_message_type(self, message: str) -> str:
        """Classify the type of message"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["hello", "hi", "hey", "good morning"]):
            return "greeting"
        elif any(word in message_lower for word in ["bye", "goodbye", "see you", "thanks"]):
            return "farewell"
        elif any(word in message_lower for word in ["help", "support", "problem", "issue"]):
            return "help_request"
        elif any(word in message_lower for word in ["send", "transfer", "pay", "payment"]):
            return "payment_request"
        elif any(word in message_lower for word in ["what is", "explain", "tell me", "how"]):
            return "information_request"
        else:
            return "general_conversation"
    
    async def _generate_response(self, message: str, context: ConversationContext, intent_analysis: Dict[str, Any]) -> str:
        """Generate response using AI or pattern matching"""
        
        try:
            # Use AI if available
            if self.openai_client and self.config.default_model.startswith("gpt"):
                return await self._generate_openai_response(message, context, intent_analysis)
            elif self.anthropic_client and self.config.default_model.startswith("claude"):
                return await self._generate_anthropic_response(message, context, intent_analysis)
            else:
                # Fallback to pattern-based responses
                return self._generate_pattern_response(message, intent_analysis)
                
        except Exception as e:
            logger.warning(f"AI response generation failed: {e}, using fallback")
            return self._generate_pattern_response(message, intent_analysis)
    
    async def _generate_openai_response(self, message: str, context: ConversationContext, intent_analysis: Dict[str, Any]) -> str:
        """Generate response using OpenAI"""
        
        # Get personality
        personality = self.personalities.get("web3_expert", self.personalities["friendly_assistant"])
        
        # Prepare conversation history for context
        recent_history = context.conversation_history[-10:]  # Last 10 messages
        
        messages = [
            {"role": "system", "content": personality.get_system_prompt()},
        ]
        
        # Add conversation history
        for hist_msg in recent_history:
            role = "user" if hist_msg["type"] == "user" else "assistant"
            messages.append({"role": role, "content": hist_msg["content"]})
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Generate response
        response = await self.openai_client.chat.completions.create(
            model=self.config.default_model,
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def _generate_anthropic_response(self, message: str, context: ConversationContext, intent_analysis: Dict[str, Any]) -> str:
        """Generate response using Anthropic Claude"""
        
        # Get personality
        personality = self.personalities.get("web3_expert", self.personalities["friendly_assistant"])
        
        # Prepare conversation history
        recent_history = context.conversation_history[-10:]
        conversation_text = ""
        
        for hist_msg in recent_history:
            role = "Human" if hist_msg["type"] == "user" else "Assistant"
            conversation_text += f"{role}: {hist_msg['content']}\\n"
        
        prompt = f"""{personality.get_system_prompt()}

Previous conversation:
{conversation_text}

Current message from human: {message}

Please provide a helpful, natural response as {personality.name}. If the user is asking about Web3 operations, offer to help execute them safely."""
        
        response = await self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def _generate_pattern_response(self, message: str, intent_analysis: Dict[str, Any]) -> str:
        """Generate response using pattern matching (fallback)"""
        
        message_type = intent_analysis.get("message_type", "general_conversation")
        
        # Default responses based on message type
        responses = {
            "greeting": [
                f"Hello! I'm {self.config.personality_name}, your Web3 assistant. How can I help you today?",
                "Hi there! Ready to explore Web3 together?",
                "Hey! What can I help you with in the world of blockchain and crypto?"
            ],
            "farewell": [
                "Goodbye! Feel free to return anytime for Web3 assistance!",
                "Take care! Your Web3 journey awaits!",
                "See you later! I'm always here to help with blockchain questions."
            ],
            "help_request": [
                "I'm here to help! I specialize in Web3, blockchain, and crypto. What do you need assistance with?",
                "Of course I can help! What's the challenge you're facing with Web3?",
                "Let me assist you! I'm an expert in blockchain technology and Web3 operations."
            ],
            "payment_request": [
                "I can help you with that payment! Let me guide you through the process safely.",
                "I'll help you process that transaction securely. What are the details?",
                "Let's handle that payment together, making sure everything is secure."
            ],
            "information_request": [
                "Great question! I love explaining Web3 concepts. What would you like to know?",
                "I'd be happy to explain that! Web3 can be complex, but I'll make it clear.",
                "That's a fantastic topic! Let me break it down for you."
            ],
            "general_conversation": [
                "That's interesting! How can I help you with Web3 or blockchain technology?",
                "I'm here to assist with anything Web3 related. What's on your mind?",
                "Feel free to ask me about blockchain, DeFi, NFTs, or any Web3 topic!"
            ]
        }
        
        import random
        response_options = responses.get(message_type, responses["general_conversation"])
        return random.choice(response_options).format(personality_name=self.config.personality_name)
    
    async def _process_web3_operations(self, intent_analysis: Dict[str, Any], context: ConversationContext) -> List[Dict[str, Any]]:
        """Process any Web3 operations identified in the message"""
        
        web3_ops = intent_analysis.get("web3_operations", [])
        processed_operations = []
        
        for operation in web3_ops:
            try:
                # Extract entities that match operation parameters
                entities = intent_analysis.get("entities", {})
                
                op_result = {
                    "operation": operation["operation"],
                    "status": "identified",
                    "parameters": {},
                    "safety_checks": operation["safety_checks"],
                    "ready_to_execute": False
                }
                
                # Map entities to operation parameters
                if operation["operation"] == "send_payment":
                    if "amounts" in entities:
                        op_result["parameters"]["amount"] = entities["amounts"][0]
                    if "addresses" in entities:
                        op_result["parameters"]["recipient"] = entities["addresses"][0]
                    if "countries" in entities:
                        op_result["parameters"]["destination"] = entities["countries"][0]
                
                elif operation["operation"] == "check_balance":
                    if "addresses" in entities:
                        op_result["parameters"]["wallet_address"] = entities["addresses"][0]
                
                # Check if all required parameters are present
                required_params = operation.get("parameters_needed", [])
                if all(param in op_result["parameters"] for param in required_params):
                    op_result["ready_to_execute"] = True
                    op_result["status"] = "ready"
                
                processed_operations.append(op_result)
                
            except Exception as e:
                logger.error(f"Failed to process Web3 operation: {e}")
                processed_operations.append({
                    "operation": operation["operation"],
                    "status": "error",
                    "error": str(e)
                })
        
        return processed_operations
    
    async def execute_web3_operation(self, session_id: str, operation: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a Web3 operation"""
        try:
            operation_type = operation.get("operation")
            parameters = operation.get("parameters", {})
            
            if operation_type == "send_payment":
                return await self._execute_payment(parameters)
            elif operation_type == "check_balance":
                return await self._execute_balance_check(parameters)
            elif operation_type == "mint_nft":
                return await self._execute_nft_mint(parameters)
            elif operation_type == "swap_tokens":
                return await self._execute_token_swap(parameters)
            else:
                return {
                    "success": False,
                    "error": f"Unknown operation: {operation_type}"
                }
                
        except Exception as e:
            logger.error(f"Web3 operation execution failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _execute_payment(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a payment operation"""
        # This would integrate with the Solana Agent Kit
        return {
            "success": True,
            "operation": "send_payment",
            "transaction_hash": f"demo_tx_{int(datetime.now().timestamp())}",
            "amount": parameters.get("amount"),
            "recipient": parameters.get("recipient"),
            "processing_time": 0.5,
            "fee": 0.00001
        }
    
    async def _execute_balance_check(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a balance check operation"""
        return {
            "success": True,
            "operation": "check_balance",
            "wallet_address": parameters.get("wallet_address"),
            "balances": {
                "SOL": 2.5,
                "USDC": 1000.0,
                "ORGO": 500.0
            }
        }
    
    async def _execute_nft_mint(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute NFT minting operation"""
        return {
            "success": True,
            "operation": "mint_nft",
            "nft_address": f"nft_{int(datetime.now().timestamp())}",
            "name": parameters.get("name"),
            "description": parameters.get("description"),
            "image_url": parameters.get("image_url")
        }
    
    async def _execute_token_swap(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute token swap operation"""
        return {
            "success": True,
            "operation": "swap_tokens",
            "from_token": parameters.get("from_token"),
            "to_token": parameters.get("to_token"),
            "amount_in": parameters.get("amount"),
            "amount_out": float(parameters.get("amount", 0)) * 0.95,  # Mock 5% slippage
            "transaction_hash": f"swap_tx_{int(datetime.now().timestamp())}"
        }
    
    async def get_conversation_summary(self, session_id: str) -> Dict[str, Any]:
        """Get a summary of the conversation"""
        try:
            if session_id not in self.active_sessions:
                return {"error": "Session not found"}
            
            context = self.active_sessions[session_id]
            
            return {
                "session_id": session_id,
                "user_id": context.user_id,
                "message_count": len(context.conversation_history),
                "last_interaction": context.last_interaction.isoformat() if context.last_interaction else None,
                "web3_operations_executed": len([msg for msg in context.conversation_history 
                                               if msg.get("web3_operations")]),
                "conversation_topics": self._extract_conversation_topics(context)
            }
            
        except Exception as e:
            logger.error(f"Failed to get conversation summary: {e}")
            return {"error": str(e)}
    
    def _extract_conversation_topics(self, context: ConversationContext) -> List[str]:
        """Extract main topics from conversation"""
        topics = []
        
        # Simple keyword-based topic extraction
        web3_keywords = {
            "payment": ["send", "transfer", "pay", "payment", "money"],
            "nft": ["nft", "token", "mint", "collection"],
            "defi": ["defi", "yield", "lending", "borrowing", "pool"],
            "blockchain": ["blockchain", "solana", "ethereum", "crypto"],
            "wallet": ["wallet", "balance", "address", "keys"]
        }
        
        for msg in context.conversation_history:
            content = msg.get("content", "").lower()
            for topic, keywords in web3_keywords.items():
                if any(keyword in content for keyword in keywords):
                    if topic not in topics:
                        topics.append(topic)
        
        return topics
    
    async def set_personality(self, session_id: str, personality_name: str) -> bool:
        """Set the personality for a conversation session"""
        try:
            if session_id not in self.active_sessions:
                return False
            
            if personality_name not in self.personalities:
                return False
            
            context = self.active_sessions[session_id]
            context.preferences["personality"] = personality_name
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to set personality: {e}")
            return False
    
    async def get_capabilities(self) -> List[str]:
        """Get list of available capabilities"""
        return self.capabilities.copy()
    
    async def get_personalities(self) -> List[str]:
        """Get list of available personalities"""
        return list(self.personalities.keys())

# Integration with Coral Protocol Agent System
class ElizaCoralAgent:
    """Coral Protocol agent wrapper for Eliza Framework"""
    
    def __init__(self, eliza_agent: ElizaFrameworkAgent):
        self.eliza_agent = eliza_agent
        self.agent_id = "eliza-framework-agent"
        self.name = "Eliza Framework Agent"
        self.capabilities = eliza_agent.capabilities
    
    async def handle_tool_call(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tool calls from the Coral Protocol orchestrator"""
        try:
            if tool_name == "start_conversation":
                context = await self.eliza_agent.start_conversation(
                    parameters["session_id"],
                    parameters.get("user_id")
                )
                
                return {
                    "success": True,
                    "session_id": context.session_id,
                    "user_id": context.user_id,
                    "created_at": context.last_interaction.isoformat()
                }
            
            elif tool_name == "process_message":
                result = await self.eliza_agent.process_message(
                    parameters["session_id"],
                    parameters["message"],
                    parameters.get("context")
                )
                
                return {
                    "success": result.success,
                    "response_text": result.response_text,
                    "actions": result.actions,
                    "web3_operations": result.web3_operations,
                    "confidence": result.confidence,
                    "processing_time": result.processing_time,
                    "error": result.error_message
                }
            
            elif tool_name == "execute_web3_operation":
                result = await self.eliza_agent.execute_web3_operation(
                    parameters["session_id"],
                    parameters["operation"]
                )
                return result
            
            elif tool_name == "get_conversation_summary":
                result = await self.eliza_agent.get_conversation_summary(
                    parameters["session_id"]
                )
                return result
            
            elif tool_name == "set_personality":
                success = await self.eliza_agent.set_personality(
                    parameters["session_id"],
                    parameters["personality_name"]
                )
                return {"success": success}
            
            elif tool_name == "get_personalities":
                personalities = await self.eliza_agent.get_personalities()
                return {
                    "success": True,
                    "personalities": personalities
                }
            
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
async def create_eliza_agent(
    personality_name: str = "Eliza",
    openai_api_key: Optional[str] = None,
    anthropic_api_key: Optional[str] = None
) -> ElizaFrameworkAgent:
    """Create and initialize an Eliza Framework agent"""
    
    config = ElizaConfig(
        personality_name=personality_name,
        openai_api_key=openai_api_key or os.getenv("OPENAI_API_KEY"),
        anthropic_api_key=anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
    )
    
    agent = ElizaFrameworkAgent(config)
    
    if await agent.initialize():
        logger.info("✅ Eliza Framework agent initialized successfully")
        return agent
    else:
        logger.error("❌ Failed to initialize Eliza Framework agent")
        raise RuntimeError("Failed to initialize Eliza Framework agent")

# Example usage and testing
async def test_eliza_agent():
    """Test the Eliza Framework integration"""
    try:
        # Create agent
        agent = await create_eliza_agent(personality_name="Web3 Expert Eliza")
        
        # Start conversation
        session_id = "test_session_001"
        context = await agent.start_conversation(session_id, "test_user")
        print(f"Started conversation: {context.session_id}")
        
        # Test messages
        test_messages = [
            "Hello! I'm new to Web3",
            "Can you explain what DeFi is?", 
            "I want to send $500 to Philippines",
            "What's my wallet balance?",
            "Thanks for your help!"
        ]
        
        for message in test_messages:
            response = await agent.process_message(session_id, message)
            print(f"User: {message}")
            print(f"Eliza: {response.response_text}")
            print(f"Web3 Operations: {len(response.web3_operations)}")
            print("---")
        
        # Test conversation summary
        summary = await agent.get_conversation_summary(session_id)
        print(f"Conversation Summary: {summary}")
        
        # Test capabilities
        capabilities = await agent.get_capabilities()
        print(f"Available capabilities: {capabilities}")
        
        # Test personalities
        personalities = await agent.get_personalities()
        print(f"Available personalities: {personalities}")
        
        # Create Coral Protocol wrapper
        coral_agent = ElizaCoralAgent(agent)
        
        # Test tool call
        result = await coral_agent.handle_tool_call(
            "process_message",
            {
                "session_id": session_id,
                "message": "Help me mint an NFT"
            }
        )
        print(f"Tool call result: {result['success']}")
        
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
    asyncio.run(test_eliza_agent())
