"""
RUSH Voice Listener Agent - Coral Protocol Integration
Specialized in voice processing and transcription with Coral MCP coordination
"""

import asyncio
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Mock imports for demo (in real implementation, use actual libraries)
class MockLangChain:
    class ChatOpenAI:
        def __init__(self, **kwargs):
            self.model = kwargs.get('model', 'gpt-4')
            self.temperature = kwargs.get('temperature', 0.3)
            self.max_tokens = kwargs.get('max_tokens', 32768)
            self.api_key = kwargs.get('api_key')
    
    class ChatPromptTemplate:
        @staticmethod
        def from_messages(messages):
            return MockPromptTemplate(messages)
    
    class AgentExecutor:
        def __init__(self, agent, tools, verbose=True, max_iterations=10):
            self.agent = agent
            self.tools = tools
            self.verbose = verbose
            self.max_iterations = max_iterations
        
        async def ainvoke(self, inputs):
            # Mock agent execution
            return {
                'input': inputs.get('input', ''),
                'output': 'Voice processing completed successfully',
                'intermediate_steps': []
            }
    
    @staticmethod
    def create_tool_calling_agent(model, tools, prompt):
        return MockAgent(model, tools, prompt)
    
    @staticmethod
    def tool(func):
        return MockTool(func)

class MockPromptTemplate:
    def __init__(self, messages):
        self.messages = messages

class MockAgent:
    def __init__(self, model, tools, prompt):
        self.model = model
        self.tools = tools
        self.prompt = prompt

class MockTool:
    def __init__(self, func):
        self.func = func
        self.name = func.__name__
        self.description = func.__doc__ or f"Tool: {func.__name__}"

class MockMCPClient:
    def __init__(self, servers):
        self.servers = servers
        self.connected = False
    
    async def connect(self):
        self.connected = True
        print("✅ Connected to Coral Server MCP")
    
    def get_tools(self):
        return [
            MockTool(lambda: None),
            MockTool(lambda: None),
            MockTool(lambda: None)
        ]

# Load environment variables
load_dotenv()

class RUSHVoiceListenerAgent:
    def __init__(self):
        self.agent_id = "rush_voice_listener"
        self.coral_client = None
        self.agent_executor = None
        self.setup_coral_connection()
        self.setup_agent()

    async def setup_coral_connection(self):
        """Connect to Coral Server as MCP client"""
        coral_url = f"{os.getenv('CORAL_SSE_URL', 'http://localhost:5555/devmode/rushApp/privkey/session1/sse')}?agentId={self.agent_id}&agentDescription=RUSH Voice Processing and Transcription Agent"
        
        self.coral_client = MockMCPClient([{
            "name": "coral-server",
            "url": coral_url,
            "transport": "sse",
            "timeout": 600,
            "sse_read_timeout": 600
        }])
        
        await self.coral_client.connect()
        print(f"✅ {self.agent_id} connected to Coral Server")

    def setup_agent(self):
        """Setup LangChain agent with Coral tools"""
        # Initialize model
        model = MockLangChain.ChatOpenAI(
            model="gpt-4-1106-preview",
            temperature=0.3,
            max_tokens=32768,
            api_key=os.getenv("OPENAI_API_KEY", "demo_key")
        )

        # Create collaboration-focused prompt
        prompt = MockLangChain.ChatPromptTemplate.from_messages([
            ("system", """You are the RUSH Voice Listener Agent, specialized in voice processing and transcription.
            
            Your primary responsibilities:
            1. Process voice input using ElevenLabs STT
            2. Transcribe speech with high accuracy
            3. Detect user intent and emotional state
            4. Coordinate with other RUSH agents via Coral Protocol
            
            Available Coral collaboration tools: {coral_tools_description}
            
            Workflow for voice support:
            1. Use list_agents to see available RUSH agents
            2. Create thread for voice support session
            3. Add relevant agents (brain, executor) to thread
            4. Send processed voice data with mentions to appropriate agents
            5. Wait for agent responses and coordinate next steps
            
            You MUST use Coral Protocol tools for all multi-agent coordination.
            Never finish without proper handoff to other agents."""),
            ("user", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])

        # Get Coral tools and combine with native tools
        coral_tools = self.coral_client.get_tools() if self.coral_client else []
        native_tools = [self.process_voice_input, self.elevenlabs_transcribe]
        
        all_tools = coral_tools + native_tools

        # Create agent
        agent = MockLangChain.create_tool_calling_agent(model, all_tools, prompt)
        self.agent_executor = MockLangChain.AgentExecutor(
            agent=agent, 
            tools=all_tools, 
            verbose=True,
            max_iterations=10
        )

    @MockLangChain.tool
    def process_voice_input(self, audio_data: str, session_id: str) -> Dict[str, Any]:
        """Process voice input and extract metadata"""
        # Simulate voice processing
        result = {
            "transcription": "My NFT transaction failed and I lost money",
            "confidence": 0.95,
            "language": "en-US",
            "emotion": "frustrated",
            "intent": "transaction_failure_support",
            "session_id": session_id,
            "timestamp": datetime.now().isoformat(),
            "extracted_entities": {
                "amount": 10000,
                "destination": "Philippines",
                "currency": "PHP",
                "payment_method": "coral_protocol"
            }
        }
        print(f"🎤 Voice processed: {result['transcription']}")
        return result

    @MockLangChain.tool 
    def elevenlabs_transcribe(self, audio_blob: str) -> Dict[str, Any]:
        """Use ElevenLabs API for speech-to-text transcription"""
        # Mock ElevenLabs integration
        return {
            "text": "I need help with my failed swap transaction",
            "confidence": 0.92,
            "language": "en",
            "processing_time": "450ms",
            "audio_quality": "high",
            "speaker_detection": True
        }

    async def run(self, user_input: str) -> Dict[str, Any]:
        """Execute the agent with Coral coordination"""
        try:
            print(f"🚀 RUSH Voice Listener Agent starting with input: {user_input}")
            
            result = await self.agent_executor.ainvoke({
                "input": user_input,
                "coral_tools_description": self.get_coral_tools_description()
            })
            
            print(f"✅ RUSH Voice Listener Agent completed: {result}")
            return result
        except Exception as e:
            print(f"❌ Agent execution error: {e}")
            return {"error": str(e), "agent": self.agent_id}

    def get_coral_tools_description(self) -> str:
        """Get description of available Coral tools"""
        if not self.coral_client:
            return "Coral tools not available"
        
        tools = self.coral_client.get_tools()
        descriptions = []
        for tool in tools:
            descriptions.append(f"- {tool.name}: {tool.description}")
        return "\n".join(descriptions)

    async def coordinate_with_other_agents(self, processed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate with other RUSH agents via Coral Protocol"""
        try:
            # Create thread for coordination
            thread_result = await self.coral_client.call_tool('create_thread', {
                'thread_name': f'voice_support_{processed_data["session_id"]}',
                'participants': ['rush-brain-agent', 'rush-executor-agent']
            })
            
            # Send processed data to brain agent
            await self.coral_client.call_tool('send_message', {
                'thread_id': thread_result['thread_id'],
                'message': f'Voice processing complete: {json.dumps(processed_data)}',
                'mentions': ['rush-brain-agent']
            })
            
            # Wait for brain agent response
            brain_response = await self.coral_client.call_tool('wait_for_mentions', {
                'thread_id': thread_result['thread_id'],
                'timeout': 30000
            })
            
            return {
                'thread_id': thread_result['thread_id'],
                'brain_response': brain_response,
                'coordination_status': 'success'
            }
            
        except Exception as e:
            print(f"❌ Coordination error: {e}")
            return {'coordination_status': 'failed', 'error': str(e)}

if __name__ == "__main__":
    async def main():
        agent = RUSHVoiceListenerAgent()
        
        # Example usage
        result = await agent.run("User spoke: My NFT mint failed and I need compensation")
        print("🎯 Agent Result:", result)
        
        # Test coordination
        processed_data = {
            "transcription": "Send $10,000 to Philippines",
            "session_id": "test_session_001",
            "confidence": 0.95
        }
        coordination_result = await agent.coordinate_with_other_agents(processed_data)
        print("🤝 Coordination Result:", coordination_result)
    
    asyncio.run(main())
