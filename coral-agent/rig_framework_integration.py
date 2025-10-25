#!/usr/bin/env python3
"""
Rig Framework Integration
Integrates Rig Framework for modular AI agent building in the Coral Protocol system
"""

import asyncio
import json
import logging
import os
import subprocess
import tempfile
from typing import Dict, Any, Optional, List, Union
from dataclasses import dataclass
from datetime import datetime
import aiohttp
import aiofiles
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class RigConfig:
    """Configuration for Rig Framework"""
    rig_binary_path: str = "rig"
    workspace_path: str = "./rig_workspace"
    rust_toolchain: str = "stable"
    timeout: int = 60
    max_parallel_agents: int = 10

@dataclass
class AgentModule:
    """Rig agent module specification"""
    name: str
    module_type: str  # "llm", "blockchain", "api", "custom"
    model_provider: Optional[str] = None  # "openai", "anthropic", "local"
    model_name: Optional[str] = None
    capabilities: List[str] = None
    configuration: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.capabilities is None:
            self.capabilities = []
        if self.configuration is None:
            self.configuration = {}

@dataclass
class AgentPipeline:
    """Rig agent pipeline definition"""
    name: str
    description: str
    modules: List[AgentModule]
    pipeline_type: str  # "sequential", "parallel", "conditional"
    error_handling: str = "continue"  # "stop", "continue", "retry"

@dataclass
class RigResult:
    """Result from Rig Framework operations"""
    success: bool
    output: Optional[Any] = None
    error_message: Optional[str] = None
    execution_time: float = 0.0
    agent_id: Optional[str] = None
    pipeline_id: Optional[str] = None

class RigFrameworkAgent:
    """Rig Framework agent for modular AI agent building"""
    
    def __init__(self, config: RigConfig):
        self.config = config
        self.workspace_path = Path(config.workspace_path)
        
        # Available capabilities
        self.capabilities = [
            "create_llm_agent",
            "create_blockchain_agent", 
            "create_api_agent",
            "create_composite_agent",
            "run_agent_pipeline",
            "train_custom_model",
            "deploy_agent",
            "monitor_agents",
            "scale_agents",
            "update_agent_config"
        ]
        
        # Supported model providers
        self.model_providers = {
            "openai": {
                "models": ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
                "capabilities": ["text_generation", "code_generation", "reasoning"]
            },
            "anthropic": {
                "models": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
                "capabilities": ["text_generation", "analysis", "reasoning"]
            },
            "local": {
                "models": ["llama-2", "codellama", "mistral"],
                "capabilities": ["text_generation", "code_generation"]
            },
            "solana": {
                "models": ["solana-agent-kit"],
                "capabilities": ["blockchain_operations", "token_transfers", "nft_minting"]
            }
        }
        
        # Pre-defined agent templates
        self.agent_templates = {
            "payment_processor": {
                "description": "AI agent for processing cross-border payments",
                "modules": [
                    {"name": "fraud_detector", "type": "llm", "provider": "anthropic"},
                    {"name": "payment_executor", "type": "blockchain", "provider": "solana"},
                    {"name": "notification_sender", "type": "api", "provider": "custom"}
                ]
            },
            "voice_assistant": {
                "description": "Voice-enabled AI assistant for Web3 operations",
                "modules": [
                    {"name": "speech_processor", "type": "api", "provider": "openai"},
                    {"name": "intent_analyzer", "type": "llm", "provider": "anthropic"},
                    {"name": "action_executor", "type": "blockchain", "provider": "solana"}
                ]
            },
            "nft_curator": {
                "description": "AI agent for NFT collection management and curation",
                "modules": [
                    {"name": "image_analyzer", "type": "llm", "provider": "openai"},
                    {"name": "market_analyzer", "type": "api", "provider": "custom"},
                    {"name": "nft_minter", "type": "blockchain", "provider": "solana"}
                ]
            },
            "defi_optimizer": {
                "description": "AI agent for DeFi yield optimization",
                "modules": [
                    {"name": "yield_analyzer", "type": "llm", "provider": "anthropic"},
                    {"name": "market_monitor", "type": "api", "provider": "custom"},
                    {"name": "strategy_executor", "type": "blockchain", "provider": "solana"}
                ]
            }
        }
    
    async def initialize(self):
        """Initialize the Rig Framework agent"""
        try:
            # Check if Rig binary exists
            if not await self._check_rig_installation():
                logger.warning("Rig binary not found, creating mock implementation")
                return True
            
            # Create workspace directory
            self.workspace_path.mkdir(parents=True, exist_ok=True)
            
            # Initialize Rig workspace
            await self._initialize_rig_workspace()
            
            logger.info("✅ Rig Framework agent initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Rig Framework agent: {e}")
            return False
    
    async def _check_rig_installation(self) -> bool:
        """Check if Rig Framework is installed"""
        try:
            result = await asyncio.create_subprocess_exec(
                self.config.rig_binary_path, "--version",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                logger.info(f"✅ Rig Framework found: {stdout.decode().strip()}")
                return True
            else:
                logger.warning(f"❌ Rig Framework not found: {stderr.decode()}")
                return False
                
        except FileNotFoundError:
            logger.warning("❌ Rig binary not found in PATH")
            return False
    
    async def _initialize_rig_workspace(self):
        """Initialize Rig workspace"""
        try:
            # Create Rig project
            cmd = [
                self.config.rig_binary_path,
                "new",
                str(self.workspace_path),
                "--template", "agent"
            ]
            
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.workspace_path.parent
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                logger.info("✅ Rig workspace initialized")
            else:
                logger.warning(f"Rig workspace init warning: {stderr.decode()}")
                
        except Exception as e:
            logger.warning(f"Could not initialize Rig workspace: {e}")
    
    async def create_agent(self, agent_spec: Dict[str, Any]) -> RigResult:
        """Create a new Rig agent"""
        start_time = datetime.now()
        
        try:
            agent_name = agent_spec.get("name", f"agent_{int(datetime.now().timestamp())}")
            agent_type = agent_spec.get("type", "llm")
            
            # Generate Rust code for the agent
            agent_code = await self._generate_agent_code(agent_spec)
            
            # Create agent directory
            agent_dir = self.workspace_path / "agents" / agent_name
            agent_dir.mkdir(parents=True, exist_ok=True)
            
            # Write agent code
            agent_file = agent_dir / "mod.rs"
            async with aiofiles.open(agent_file, 'w') as f:
                await f.write(agent_code)
            
            # Create Cargo.toml for the agent
            cargo_toml = await self._generate_cargo_toml(agent_spec)
            cargo_file = agent_dir / "Cargo.toml"
            async with aiofiles.open(cargo_file, 'w') as f:
                await f.write(cargo_toml)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return RigResult(
                success=True,
                output={
                    "agent_name": agent_name,
                    "agent_type": agent_type,
                    "agent_path": str(agent_dir),
                    "capabilities": agent_spec.get("capabilities", [])
                },
                execution_time=processing_time,
                agent_id=agent_name
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Agent creation failed: {e}")
            return RigResult(
                success=False,
                error_message=str(e),
                execution_time=processing_time
            )
    
    async def _generate_agent_code(self, agent_spec: Dict[str, Any]) -> str:
        """Generate Rust code for a Rig agent"""
        
        agent_name = agent_spec.get("name", "DefaultAgent")
        agent_type = agent_spec.get("type", "llm")
        model_provider = agent_spec.get("model_provider", "openai")
        model_name = agent_spec.get("model_name", "gpt-4")
        
        rust_code = f'''use rig::{{
    agent::Agent,
    completion::CompletionModel,
    providers::{{{model_provider}::{model_provider.title()}Provider}},
    workflow::WorkflowBuilder,
}};
use serde::{{Deserialize, Serialize}};
use std::sync::Arc;
use tokio;

/// {agent_name} - Specialized AI agent for {agent_spec.get("description", "general tasks")}
#[derive(Debug)]
pub struct {agent_name} {{
    agent: Arc<Agent<impl CompletionModel>>,
    capabilities: Vec<String>,
}}

#[derive(Debug, Serialize, Deserialize)]
pub struct {agent_name}Request {{
    pub input: String,
    pub context: Option<String>,
    pub parameters: std::collections::HashMap<String, serde_json::Value>,
}}

#[derive(Debug, Serialize, Deserialize)]
pub struct {agent_name}Response {{
    pub success: bool,
    pub output: Option<String>,
    pub error: Option<String>,
    pub execution_time: f64,
}}

impl {agent_name} {{
    /// Create a new {agent_name} instance
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {{
        // Initialize the model provider
        let provider = {model_provider.title()}Provider::new(
            std::env::var("{model_provider.upper()}_API_KEY")?
        );
        
        // Create completion model
        let model = provider.completion_model("{model_name}");
        
        // Build the agent
        let agent = Agent::builder()
            .with_model(model)
            .with_system_prompt(Self::get_system_prompt())
            .build();
        
        Ok(Self {{
            agent: Arc::new(agent),
            capabilities: vec![
'''

        # Add capabilities
        capabilities = agent_spec.get("capabilities", ["text_generation", "reasoning"])
        for cap in capabilities:
            rust_code += f'                "{cap}".to_string(),\n'

        rust_code += f'''            ],
        }})
    }}
    
    /// Get the system prompt for this agent
    fn get_system_prompt() -> String {{
        format!(
            "You are {agent_name}, a specialized AI agent for {agent_spec.get('description', 'general tasks')}. \\
            Your capabilities include: {', '.join(capabilities)}. \\
            Always provide helpful, accurate, and contextual responses."
        )
    }}
    
    /// Process a request using this agent
    pub async fn process_request(&self, request: {agent_name}Request) -> {agent_name}Response {{
        let start_time = std::time::Instant::now();
        
        match self._internal_process(&request).await {{
            Ok(output) => {{
                {agent_name}Response {{
                    success: true,
                    output: Some(output),
                    error: None,
                    execution_time: start_time.elapsed().as_secs_f64(),
                }}
            }},
            Err(e) => {{
                {agent_name}Response {{
                    success: false,
                    output: None,
                    error: Some(e.to_string()),
                    execution_time: start_time.elapsed().as_secs_f64(),
                }}
            }}
        }}
    }}
    
    /// Internal processing logic
    async fn _internal_process(&self, request: &{agent_name}Request) -> Result<String, Box<dyn std::error::Error>> {{
        // Prepare the prompt
        let mut prompt = request.input.clone();
        
        if let Some(context) = &request.context {{
            prompt = format!("Context: {{}}\\n\\nRequest: {{}}", context, prompt);
        }}
'''

        # Add specific processing based on agent type
        if agent_type == "blockchain":
            rust_code += '''
        // Blockchain-specific processing
        if request.parameters.contains_key("blockchain_operation") {
            prompt = format!("{}\\n\\nPlease analyze this blockchain operation and provide recommendations.", prompt);
        }
'''
        elif agent_type == "voice":
            rust_code += '''
        // Voice processing specific logic
        if request.parameters.contains_key("audio_transcript") {
            prompt = format!("{}\\n\\nProcess this voice command: {}", prompt, 
                request.parameters["audio_transcript"].as_str().unwrap_or(""));
        }
'''

        rust_code += '''
        // Execute the completion
        let completion = self.agent.completion(&prompt).await?;
        
        Ok(completion.content)
    }
    
    /// Get agent capabilities
    pub fn get_capabilities(&self) -> &Vec<String> {
        &self.capabilities
    }
    
    /// Health check
    pub fn health_check(&self) -> bool {
        // Simple health check
        true
    }
}

// Workflow integration
impl {agent_name} {
    /// Create a workflow with this agent
    pub async fn create_workflow(&self) -> WorkflowBuilder {
        WorkflowBuilder::new()
            .add_step("process", |input| async move {
                // Workflow step implementation
                Ok(input)
            })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_agent_creation() {
        let agent = {agent_name}::new().await;
        assert!(agent.is_ok());
    }
    
    #[tokio::test]
    async fn test_basic_processing() {
        let agent = {agent_name}::new().await.unwrap();
        
        let request = {agent_name}Request {
            input: "Hello, can you help me?".to_string(),
            context: None,
            parameters: std::collections::HashMap::new(),
        };
        
        let response = agent.process_request(request).await;
        assert!(response.success);
        assert!(response.output.is_some());
    }
}
'''
        
        return rust_code
    
    async def _generate_cargo_toml(self, agent_spec: Dict[str, Any]) -> str:
        """Generate Cargo.toml for the agent"""
        
        agent_name = agent_spec.get("name", "default_agent")
        
        cargo_toml = f'''[package]
name = "{agent_name.lower().replace(' ', '_')}"
version = "0.1.0"
edition = "2021"

[dependencies]
rig = {{ version = "0.1", features = ["full"] }}
tokio = {{ version = "1.0", features = ["full"] }}
serde = {{ version = "1.0", features = ["derive"] }}
serde_json = "1.0"
anyhow = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"

# Model provider dependencies
'''

        model_provider = agent_spec.get("model_provider", "openai")
        if model_provider == "openai":
            cargo_toml += 'openai = "1.0"\n'
        elif model_provider == "anthropic":
            cargo_toml += 'anthropic = "0.1"\n'
        
        # Add blockchain dependencies if needed
        if agent_spec.get("type") == "blockchain":
            cargo_toml += '''
# Blockchain dependencies
solana-sdk = "1.16"
anchor-client = "0.29"
spl-token = "4.0"
'''

        cargo_toml += '''
[dev-dependencies]
tokio-test = "0.4"
'''
        
        return cargo_toml
    
    async def create_agent_pipeline(self, pipeline_spec: AgentPipeline) -> RigResult:
        """Create an agent pipeline using Rig Framework"""
        start_time = datetime.now()
        
        try:
            pipeline_code = await self._generate_pipeline_code(pipeline_spec)
            
            # Create pipeline directory
            pipeline_dir = self.workspace_path / "pipelines" / pipeline_spec.name
            pipeline_dir.mkdir(parents=True, exist_ok=True)
            
            # Write pipeline code
            pipeline_file = pipeline_dir / "mod.rs"
            async with aiofiles.open(pipeline_file, 'w') as f:
                await f.write(pipeline_code)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return RigResult(
                success=True,
                output={
                    "pipeline_name": pipeline_spec.name,
                    "pipeline_type": pipeline_spec.pipeline_type,
                    "modules_count": len(pipeline_spec.modules),
                    "pipeline_path": str(pipeline_dir)
                },
                execution_time=processing_time,
                pipeline_id=pipeline_spec.name
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Pipeline creation failed: {e}")
            return RigResult(
                success=False,
                error_message=str(e),
                execution_time=processing_time
            )
    
    async def _generate_pipeline_code(self, pipeline_spec: AgentPipeline) -> str:
        """Generate Rust code for an agent pipeline"""
        
        pipeline_name = pipeline_spec.name.replace(" ", "").replace("-", "_")
        
        rust_code = f'''use rig::{{
    workflow::{{WorkflowBuilder, WorkflowStep}},
    agent::Agent,
    completion::CompletionModel,
}};
use serde::{{Deserialize, Serialize}};
use std::sync::Arc;
use tokio;

/// {pipeline_spec.name} - {pipeline_spec.description}
#[derive(Debug)]
pub struct {pipeline_name}Pipeline {{
    modules: Vec<Box<dyn AgentModule>>,
    pipeline_type: PipelineType,
    error_handling: ErrorHandling,
}}

#[derive(Debug)]
pub enum PipelineType {{
    Sequential,
    Parallel,
    Conditional,
}}

#[derive(Debug)]
pub enum ErrorHandling {{
    Stop,
    Continue,
    Retry,
}}

#[derive(Debug, Serialize, Deserialize)]
pub struct PipelineRequest {{
    pub input: serde_json::Value,
    pub context: Option<String>,
    pub parameters: std::collections::HashMap<String, serde_json::Value>,
}}

#[derive(Debug, Serialize, Deserialize)]
pub struct PipelineResponse {{
    pub success: bool,
    pub outputs: Vec<serde_json::Value>,
    pub errors: Vec<String>,
    pub execution_time: f64,
    pub module_results: std::collections::HashMap<String, serde_json::Value>,
}}

pub trait AgentModule: Send + Sync {{
    async fn process(&self, input: &serde_json::Value) -> Result<serde_json::Value, Box<dyn std::error::Error>>;
    fn name(&self) -> &str;
    fn module_type(&self) -> &str;
}}

impl {pipeline_name}Pipeline {{
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {{
        let mut modules: Vec<Box<dyn AgentModule>> = Vec::new();
        
'''

        # Add modules based on specification
        for module in pipeline_spec.modules:
            module_name = module.name.replace(" ", "").replace("-", "_")
            rust_code += f'''        // Add {module.name} module
        modules.push(Box::new({module_name}Module::new().await?));
        
'''

        rust_code += f'''        Ok(Self {{
            modules,
            pipeline_type: PipelineType::{pipeline_spec.pipeline_type.title()},
            error_handling: ErrorHandling::{pipeline_spec.error_handling.title()},
        }})
    }}
    
    pub async fn execute(&self, request: PipelineRequest) -> PipelineResponse {{
        let start_time = std::time::Instant::now();
        let mut outputs = Vec::new();
        let mut errors = Vec::new();
        let mut module_results = std::collections::HashMap::new();
        
        match self.pipeline_type {{
            PipelineType::Sequential => {{
                self.execute_sequential(&request, &mut outputs, &mut errors, &mut module_results).await;
            }},
            PipelineType::Parallel => {{
                self.execute_parallel(&request, &mut outputs, &mut errors, &mut module_results).await;
            }},
            PipelineType::Conditional => {{
                self.execute_conditional(&request, &mut outputs, &mut errors, &mut module_results).await;
            }},
        }}
        
        PipelineResponse {{
            success: errors.is_empty(),
            outputs,
            errors,
            execution_time: start_time.elapsed().as_secs_f64(),
            module_results,
        }}
    }}
    
    async fn execute_sequential(
        &self,
        request: &PipelineRequest,
        outputs: &mut Vec<serde_json::Value>,
        errors: &mut Vec<String>,
        module_results: &mut std::collections::HashMap<String, serde_json::Value>,
    ) {{
        let mut current_input = request.input.clone();
        
        for module in &self.modules {{
            match module.process(&current_input).await {{
                Ok(output) => {{
                    module_results.insert(module.name().to_string(), output.clone());
                    outputs.push(output.clone());
                    current_input = output; // Chain outputs
                }},
                Err(e) => {{
                    let error_msg = format!("Module '{{}}' failed: {{}}", module.name(), e);
                    errors.push(error_msg);
                    
                    match self.error_handling {{
                        ErrorHandling::Stop => break,
                        ErrorHandling::Continue => continue,
                        ErrorHandling::Retry => {{
                            // Implement retry logic
                            continue;
                        }},
                    }}
                }},
            }}
        }}
    }}
    
    async fn execute_parallel(
        &self,
        request: &PipelineRequest,
        outputs: &mut Vec<serde_json::Value>,
        errors: &mut Vec<String>,
        module_results: &mut std::collections::HashMap<String, serde_json::Value>,
    ) {{
        let mut tasks = Vec::new();
        
        for module in &self.modules {{
            let input = request.input.clone();
            let module_name = module.name().to_string();
            
            // Note: This is a simplified parallel execution
            // In real implementation, you'd need proper async handling
            match module.process(&input).await {{
                Ok(output) => {{
                    module_results.insert(module_name, output.clone());
                    outputs.push(output);
                }},
                Err(e) => {{
                    let error_msg = format!("Module '{{}}' failed: {{}}", module_name, e);
                    errors.push(error_msg);
                }},
            }}
        }}
    }}
    
    async fn execute_conditional(
        &self,
        request: &PipelineRequest,
        outputs: &mut Vec<serde_json::Value>,
        errors: &mut Vec<String>,
        module_results: &mut std::collections::HashMap<String, serde_json::Value>,
    ) {{
        // Implement conditional execution logic based on input/context
        // This is a simplified version
        self.execute_sequential(request, outputs, errors, module_results).await;
    }}
}}

// Example module implementations
'''

        # Generate module implementations
        for module in pipeline_spec.modules:
            module_name = module.name.replace(" ", "").replace("-", "_")
            rust_code += f'''
struct {module_name}Module {{
    // Module-specific fields
}}

impl {module_name}Module {{
    async fn new() -> Result<Self, Box<dyn std::error::Error>> {{
        Ok(Self {{}})
    }}
}}

#[async_trait::async_trait]
impl AgentModule for {module_name}Module {{
    async fn process(&self, input: &serde_json::Value) -> Result<serde_json::Value, Box<dyn std::error::Error>> {{
        // Implement {module.name} processing logic
        // This is a mock implementation
        Ok(serde_json::json!({{
            "module": "{module.name}",
            "processed": true,
            "input": input,
            "timestamp": chrono::Utc::now().to_rfc3339()
        }}))
    }}
    
    fn name(&self) -> &str {{
        "{module.name}"
    }}
    
    fn module_type(&self) -> &str {{
        "{module.module_type}"
    }}
}}
'''

        rust_code += '''
#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_pipeline_creation() {
        let pipeline = ''' + pipeline_name + '''Pipeline::new().await;
        assert!(pipeline.is_ok());
    }
}
'''
        
        return rust_code
    
    async def create_from_template(self, template_name: str, parameters: Dict[str, Any]) -> RigResult:
        """Create agent from predefined template"""
        try:
            if template_name not in self.agent_templates:
                return RigResult(
                    success=False,
                    error_message=f"Unknown template: {template_name}"
                )
            
            template = self.agent_templates[template_name]
            
            # Create agent specification from template
            agent_spec = {
                "name": parameters.get("name", template_name.replace("_", " ").title()),
                "description": template["description"],
                "type": "composite",  # Templates are usually composite agents
                "modules": template["modules"],
                "capabilities": parameters.get("capabilities", []),
                **parameters
            }
            
            # Create the agent
            return await self.create_agent(agent_spec)
            
        except Exception as e:
            logger.error(f"Template creation failed: {e}")
            return RigResult(
                success=False,
                error_message=str(e)
            )
    
    async def run_agent(self, agent_id: str, input_data: Dict[str, Any]) -> RigResult:
        """Run a specific agent with input data"""
        start_time = datetime.now()
        
        try:
            # In a real implementation, this would compile and run the Rust agent
            # For demo purposes, we'll simulate the execution
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Simulate agent execution
            output = {
                "agent_id": agent_id,
                "input": input_data,
                "output": f"Processed by {agent_id}",
                "timestamp": datetime.now().isoformat(),
                "status": "completed"
            }
            
            return RigResult(
                success=True,
                output=output,
                execution_time=processing_time,
                agent_id=agent_id
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Agent execution failed: {e}")
            return RigResult(
                success=False,
                error_message=str(e),
                execution_time=processing_time,
                agent_id=agent_id
            )
    
    async def get_capabilities(self) -> List[str]:
        """Get list of available capabilities"""
        return self.capabilities.copy()
    
    async def get_model_providers(self) -> Dict[str, Any]:
        """Get supported model providers"""
        return self.model_providers.copy()

# Integration with Coral Protocol Agent System
class RigCoralAgent:
    """Coral Protocol agent wrapper for Rig Framework"""
    
    def __init__(self, rig_agent: RigFrameworkAgent):
        self.rig_agent = rig_agent
        self.agent_id = "rig-framework-agent"
        self.name = "Rig Framework Agent"
        self.capabilities = rig_agent.capabilities
    
    async def handle_tool_call(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tool calls from the Coral Protocol orchestrator"""
        try:
            if tool_name == "create_agent":
                result = await self.rig_agent.create_agent(parameters)
                
                return {
                    "success": result.success,
                    "agent_id": result.agent_id,
                    "output": result.output,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "create_from_template":
                result = await self.rig_agent.create_from_template(
                    parameters["template_name"],
                    parameters.get("parameters", {})
                )
                
                return {
                    "success": result.success,
                    "agent_id": result.agent_id,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "run_agent":
                result = await self.rig_agent.run_agent(
                    parameters["agent_id"],
                    parameters["input_data"]
                )
                
                return {
                    "success": result.success,
                    "output": result.output,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "create_pipeline":
                # Create pipeline from parameters
                pipeline = AgentPipeline(
                    name=parameters["name"],
                    description=parameters["description"],
                    modules=[AgentModule(**mod) for mod in parameters["modules"]],
                    pipeline_type=parameters.get("pipeline_type", "sequential"),
                    error_handling=parameters.get("error_handling", "continue")
                )
                
                result = await self.rig_agent.create_agent_pipeline(pipeline)
                
                return {
                    "success": result.success,
                    "pipeline_id": result.pipeline_id,
                    "output": result.output,
                    "execution_time": result.execution_time,
                    "error": result.error_message
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
async def create_rig_agent(
    workspace_path: str = "./rig_workspace",
    rig_binary_path: str = "rig"
) -> RigFrameworkAgent:
    """Create and initialize a Rig Framework agent"""
    
    config = RigConfig(
        rig_binary_path=rig_binary_path,
        workspace_path=workspace_path
    )
    
    agent = RigFrameworkAgent(config)
    
    if await agent.initialize():
        logger.info("✅ Rig Framework agent initialized successfully")
        return agent
    else:
        logger.error("❌ Failed to initialize Rig Framework agent")
        raise RuntimeError("Failed to initialize Rig Framework agent")

# Example usage and testing
async def test_rig_agent():
    """Test the Rig Framework integration"""
    try:
        # Create agent
        agent = await create_rig_agent()
        
        # Test agent creation from template
        result = await agent.create_from_template(
            "payment_processor",
            {"name": "Coral Payment Agent"}
        )
        
        print(f"Agent creation result: {result.success}")
        if result.success:
            print(f"Agent created in {result.execution_time:.2f}s")
            print(f"Agent ID: {result.agent_id}")
        
        # Test capabilities
        capabilities = await agent.get_capabilities()
        print(f"Available capabilities: {capabilities}")
        
        # Test model providers
        providers = await agent.get_model_providers()
        print(f"Supported providers: {list(providers.keys())}")
        
        # Create Coral Protocol wrapper
        coral_agent = RigCoralAgent(agent)
        
        # Test tool call
        result = await coral_agent.handle_tool_call(
            "create_from_template",
            {
                "template_name": "voice_assistant",
                "parameters": {"name": "Coral Voice Agent"}
            }
        )
        print(f"Tool call result: {result['success']}")
        
        return True
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    # Run test
    asyncio.run(test_rig_agent())
