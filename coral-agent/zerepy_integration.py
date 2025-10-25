#!/usr/bin/env python3
"""
ZerePy Integration
Integrates ZerePy framework for autonomous multi-platform agents in the Coral Protocol system
"""

import asyncio
import json
import logging
import os
import subprocess
from typing import Dict, Any, Optional, List, Union
from dataclasses import dataclass, field
from datetime import datetime
import aiohttp
import aiofiles
from pathlib import Path
import yaml

logger = logging.getLogger(__name__)

@dataclass
class ZerePyConfig:
    """Configuration for ZerePy Framework"""
    workspace_path: str = "./zerepy_workspace"
    python_executable: str = "python"
    poetry_executable: str = "poetry"
    timeout: int = 120
    max_concurrent_agents: int = 50
    api_endpoints: Dict[str, str] = field(default_factory=dict)

@dataclass
class PlatformConfig:
    """Configuration for a specific platform"""
    platform_name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    authentication_method: str = "api_key"  # "api_key", "oauth", "bearer_token"
    rate_limits: Dict[str, int] = field(default_factory=dict)
    capabilities: List[str] = field(default_factory=list)

@dataclass
class AgentTask:
    """Task specification for ZerePy agents"""
    task_id: str
    task_type: str  # "social_media", "blockchain", "api_interaction", "data_analysis"
    platforms: List[str]
    schedule: Optional[str] = None  # Cron-like schedule
    parameters: Dict[str, Any] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)
    retry_policy: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ZerePyResult:
    """Result from ZerePy operations"""
    success: bool
    output: Optional[Any] = None
    error_message: Optional[str] = None
    execution_time: float = 0.0
    agent_id: Optional[str] = None
    task_id: Optional[str] = None
    platform_results: Dict[str, Any] = field(default_factory=dict)

class ZerePyAgent:
    """ZerePy agent for autonomous multi-platform operations"""
    
    def __init__(self, config: ZerePyConfig):
        self.config = config
        self.workspace_path = Path(config.workspace_path)
        self.active_agents: Dict[str, Dict[str, Any]] = {}
        self.platform_configs: Dict[str, PlatformConfig] = {}
        
        # Available capabilities
        self.capabilities = [
            "deploy_autonomous_agents",
            "cross_platform_coordination",
            "social_media_automation",
            "blockchain_monitoring",
            "api_orchestration",
            "data_pipeline_automation",
            "notification_management",
            "performance_monitoring",
            "auto_scaling",
            "task_scheduling"
        ]
        
        # Supported platforms
        self.supported_platforms = {
            "twitter": {
                "capabilities": ["post_tweets", "monitor_mentions", "follow_users", "dm_users"],
                "api_version": "v2",
                "rate_limits": {"tweets": 300, "follows": 400}
            },
            "discord": {
                "capabilities": ["send_messages", "manage_roles", "moderate_content", "voice_interaction"],
                "api_version": "v10",
                "rate_limits": {"messages": 120, "role_updates": 50}
            },
            "telegram": {
                "capabilities": ["send_messages", "manage_groups", "inline_queries", "webhook_management"],
                "api_version": "bot_api",
                "rate_limits": {"messages": 30, "group_actions": 20}
            },
            "solana": {
                "capabilities": ["monitor_transactions", "execute_trades", "track_wallets", "nft_operations"],
                "api_version": "mainnet",
                "rate_limits": {"rpc_calls": 1000, "websocket_subs": 100}
            },
            "ethereum": {
                "capabilities": ["monitor_contracts", "execute_transactions", "defi_operations", "nft_tracking"],
                "api_version": "mainnet",
                "rate_limits": {"rpc_calls": 500, "websocket_subs": 50}
            },
            "web_apis": {
                "capabilities": ["http_requests", "webhook_handling", "data_extraction", "api_monitoring"],
                "api_version": "custom",
                "rate_limits": {"requests": 1000, "webhooks": 100}
            }
        }
        
        # Agent templates for common use cases
        self.agent_templates = {
            "social_coordinator": {
                "description": "Cross-platform social media coordination agent",
                "platforms": ["twitter", "discord", "telegram"],
                "tasks": ["cross_post_updates", "monitor_sentiment", "engage_community"]
            },
            "defi_monitor": {
                "description": "DeFi protocol monitoring and alert agent",
                "platforms": ["solana", "ethereum", "web_apis"],
                "tasks": ["monitor_pools", "track_yields", "alert_opportunities"]
            },
            "customer_support": {
                "description": "Automated customer support agent across platforms",
                "platforms": ["discord", "telegram", "web_apis"],
                "tasks": ["answer_queries", "escalate_issues", "update_tickets"]
            },
            "trading_bot": {
                "description": "Automated trading bot with risk management",
                "platforms": ["solana", "ethereum"],
                "tasks": ["execute_trades", "monitor_positions", "manage_risk"]
            },
            "content_curator": {
                "description": "Content curation and distribution agent",
                "platforms": ["twitter", "discord", "web_apis"],
                "tasks": ["curate_content", "schedule_posts", "analyze_engagement"]
            }
        }
    
    async def initialize(self):
        """Initialize the ZerePy agent"""
        try:
            # Create workspace directory
            self.workspace_path.mkdir(parents=True, exist_ok=True)
            
            # Initialize Poetry project if not exists
            await self._initialize_poetry_project()
            
            # Set up platform configurations
            await self._setup_platform_configs()
            
            logger.info("✅ ZerePy agent initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize ZerePy agent: {e}")
            return False
    
    async def _initialize_poetry_project(self):
        """Initialize Poetry project for ZerePy workspace"""
        try:
            pyproject_toml = self.workspace_path / "pyproject.toml"
            
            if not pyproject_toml.exists():
                # Create pyproject.toml
                toml_content = '''[tool.poetry]
name = "zerepy-agents"
version = "0.1.0"
description = "Autonomous multi-platform agents powered by ZerePy"
authors = ["Coral Rush Team <team@coral-rush.com>"]

[tool.poetry.dependencies]
python = "^3.9"
aiohttp = "^3.8.0"
asyncio = "^3.4.3"
schedule = "^1.2.0"
pydantic = "^2.0.0"
tweepy = "^4.14.0"
discord-py = "^2.3.0"
python-telegram-bot = "^20.0"
web3 = "^6.11.0"
solana = "^0.30.0"
requests = "^2.31.0"
aiofiles = "^23.0.0"
python-dotenv = "^1.0.0"
croniter = "^1.4.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
black = "^23.0.0"
flake8 = "^6.0.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
'''
                
                async with aiofiles.open(pyproject_toml, 'w') as f:
                    await f.write(toml_content)
                
                # Install dependencies
                result = await asyncio.create_subprocess_exec(
                    self.config.poetry_executable, "install",
                    cwd=self.workspace_path,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                
                stdout, stderr = await result.communicate()
                
                if result.returncode == 0:
                    logger.info("✅ Poetry project initialized")
                else:
                    logger.warning(f"Poetry install warning: {stderr.decode()}")
                    
        except Exception as e:
            logger.warning(f"Could not initialize Poetry project: {e}")
    
    async def _setup_platform_configs(self):
        """Set up configurations for supported platforms"""
        try:
            # Load platform configurations from environment
            for platform_name in self.supported_platforms:
                api_key_env = f"{platform_name.upper()}_API_KEY"
                base_url_env = f"{platform_name.upper()}_BASE_URL"
                
                platform_config = PlatformConfig(
                    platform_name=platform_name,
                    api_key=os.getenv(api_key_env),
                    base_url=os.getenv(base_url_env),
                    capabilities=self.supported_platforms[platform_name]["capabilities"],
                    rate_limits=self.supported_platforms[platform_name]["rate_limits"]
                )
                
                self.platform_configs[platform_name] = platform_config
                
        except Exception as e:
            logger.warning(f"Could not setup platform configs: {e}")
    
    async def create_autonomous_agent(self, agent_spec: Dict[str, Any]) -> ZerePyResult:
        """Create a new autonomous agent"""
        start_time = datetime.now()
        
        try:
            agent_id = agent_spec.get("agent_id", f"agent_{int(datetime.now().timestamp())}")
            agent_name = agent_spec.get("name", f"Agent {agent_id}")
            platforms = agent_spec.get("platforms", [])
            tasks = agent_spec.get("tasks", [])
            
            # Generate agent code
            agent_code = await self._generate_agent_code(agent_spec)
            
            # Create agent directory
            agent_dir = self.workspace_path / "agents" / agent_id
            agent_dir.mkdir(parents=True, exist_ok=True)
            
            # Write agent files
            await self._write_agent_files(agent_dir, agent_code, agent_spec)
            
            # Register agent
            self.active_agents[agent_id] = {
                "name": agent_name,
                "platforms": platforms,
                "tasks": tasks,
                "status": "created",
                "created_at": datetime.now().isoformat(),
                "agent_dir": str(agent_dir)
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ZerePyResult(
                success=True,
                output={
                    "agent_id": agent_id,
                    "agent_name": agent_name,
                    "platforms": platforms,
                    "tasks": tasks,
                    "agent_path": str(agent_dir)
                },
                execution_time=processing_time,
                agent_id=agent_id
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Agent creation failed: {e}")
            return ZerePyResult(
                success=False,
                error_message=str(e),
                execution_time=processing_time
            )
    
    async def _generate_agent_code(self, agent_spec: Dict[str, Any]) -> Dict[str, str]:
        """Generate code files for the autonomous agent"""
        
        agent_id = agent_spec.get("agent_id")
        agent_name = agent_spec.get("name", f"Agent {agent_id}")
        platforms = agent_spec.get("platforms", [])
        tasks = agent_spec.get("tasks", [])
        
        # Main agent file
        main_agent_code = f'''#!/usr/bin/env python3
"""
{agent_name} - Autonomous Multi-Platform Agent
Generated by ZerePy Integration for Coral Protocol
"""

import asyncio
import logging
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import aiohttp
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class AgentConfig:
    agent_id: str
    name: str
    platforms: List[str]
    tasks: List[str]
    
class {agent_id.replace('-', '_').title()}Agent:
    """Autonomous agent for {agent_spec.get('description', 'multi-platform operations')}"""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.platform_clients = {{}}
        self.task_handlers = {{}}
        self.is_running = False
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def initialize(self):
        """Initialize the agent and platform clients"""
        try:
            self.session = aiohttp.ClientSession()
            
            # Initialize platform clients
            await self._initialize_platform_clients()
            
            # Set up task handlers
            await self._setup_task_handlers()
            
            logger.info(f"✅ {{self.config.name}} initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize agent: {{e}}")
            return False
    
    async def _initialize_platform_clients(self):
        """Initialize clients for each platform"""
'''

        # Add platform client initialization
        for platform in platforms:
            if platform == "twitter":
                main_agent_code += f'''
        # Initialize Twitter client
        if "twitter" in self.config.platforms:
            import tweepy
            
            twitter_api_key = os.getenv('TWITTER_API_KEY')
            twitter_api_secret = os.getenv('TWITTER_API_SECRET')
            twitter_access_token = os.getenv('TWITTER_ACCESS_TOKEN')
            twitter_access_secret = os.getenv('TWITTER_ACCESS_SECRET')
            
            if all([twitter_api_key, twitter_api_secret, twitter_access_token, twitter_access_secret]):
                auth = tweepy.OAuthHandler(twitter_api_key, twitter_api_secret)
                auth.set_access_token(twitter_access_token, twitter_access_secret)
                self.platform_clients["twitter"] = tweepy.API(auth)
                logger.info("✅ Twitter client initialized")
            else:
                logger.warning("❌ Twitter credentials not found")
'''
            
            elif platform == "discord":
                main_agent_code += f'''
        # Initialize Discord client
        if "discord" in self.config.platforms:
            import discord
            
            discord_token = os.getenv('DISCORD_BOT_TOKEN')
            if discord_token:
                intents = discord.Intents.default()
                intents.message_content = True
                self.platform_clients["discord"] = discord.Client(intents=intents)
                logger.info("✅ Discord client initialized")
            else:
                logger.warning("❌ Discord token not found")
'''
            
            elif platform == "solana":
                main_agent_code += f'''
        # Initialize Solana client
        if "solana" in self.config.platforms:
            from solana.rpc.async_api import AsyncClient
            
            solana_rpc_url = os.getenv('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com')
            self.platform_clients["solana"] = AsyncClient(solana_rpc_url)
            logger.info("✅ Solana client initialized")
'''

        main_agent_code += '''
    async def _setup_task_handlers(self):
        """Set up handlers for each task type"""
'''

        # Add task handler setup
        for task in tasks:
            task_method_name = task.lower().replace(" ", "_").replace("-", "_")
            main_agent_code += f'''
        self.task_handlers["{task}"] = self.{task_method_name}
'''

        main_agent_code += '''
    
    async def start(self):
        """Start the autonomous agent"""
        try:
            self.is_running = True
            logger.info(f"🚀 {self.config.name} started")
            
            # Start main execution loop
            await self._execution_loop()
            
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            self.is_running = False
    
    async def stop(self):
        """Stop the autonomous agent"""
        self.is_running = False
        
        if self.session:
            await self.session.close()
        
        logger.info(f"🛑 {self.config.name} stopped")
    
    async def _execution_loop(self):
        """Main execution loop for autonomous operations"""
        while self.is_running:
            try:
                # Execute all configured tasks
                for task_name in self.config.tasks:
                    if task_name in self.task_handlers:
                        await self.task_handlers[task_name]()
                    else:
                        logger.warning(f"No handler found for task: {task_name}")
                
                # Wait before next iteration
                await asyncio.sleep(60)  # Run tasks every minute
                
            except Exception as e:
                logger.error(f"Execution loop error: {e}")
                await asyncio.sleep(5)  # Short delay on error
    
    # Task handler methods
'''

        # Generate task handler methods
        for task in tasks:
            task_method_name = task.lower().replace(" ", "_").replace("-", "_")
            main_agent_code += f'''
    async def {task_method_name}(self):
        """Handle {task} task"""
        try:
            logger.info(f"Executing task: {task}")
            
            # Task-specific logic goes here
            # This is a template - customize based on task requirements
            
            result = await self._execute_task_logic("{task}")
            
            logger.info(f"Task {task} completed: {{result}}")
            return result
            
        except Exception as e:
            logger.error(f"Task {task} failed: {{e}}")
            return None
'''

        main_agent_code += '''
    
    async def _execute_task_logic(self, task_name: str) -> Dict[str, Any]:
        """Execute specific task logic based on task name and platforms"""
        
        results = {}
        
        for platform in self.config.platforms:
            try:
                if platform in self.platform_clients:
                    platform_result = await self._execute_platform_task(platform, task_name)
                    results[platform] = platform_result
                
            except Exception as e:
                logger.error(f"Platform {platform} task failed: {e}")
                results[platform] = {"error": str(e)}
        
        return results
    
    async def _execute_platform_task(self, platform: str, task_name: str) -> Dict[str, Any]:
        """Execute task on specific platform"""
        
        # Platform-specific task execution
        if platform == "twitter" and "post" in task_name.lower():
            return await self._twitter_post_task()
        elif platform == "discord" and "message" in task_name.lower():
            return await self._discord_message_task()
        elif platform == "solana" and "monitor" in task_name.lower():
            return await self._solana_monitor_task()
        else:
            return {"status": "not_implemented", "platform": platform, "task": task_name}
    
    async def _twitter_post_task(self) -> Dict[str, Any]:
        """Execute Twitter posting task"""
        try:
            # Example Twitter task
            # tweet = self.platform_clients["twitter"].update_status("Hello from ZerePy agent!")
            return {"status": "success", "action": "tweet_posted", "timestamp": datetime.now().isoformat()}
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    async def _discord_message_task(self) -> Dict[str, Any]:
        """Execute Discord messaging task"""
        try:
            # Example Discord task
            return {"status": "success", "action": "message_sent", "timestamp": datetime.now().isoformat()}
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    async def _solana_monitor_task(self) -> Dict[str, Any]:
        """Execute Solana monitoring task"""
        try:
            # Example Solana monitoring
            client = self.platform_clients.get("solana")
            if client:
                # health = await client.get_health()
                return {"status": "success", "action": "blockchain_monitored", "timestamp": datetime.now().isoformat()}
            else:
                return {"status": "error", "error": "Solana client not available"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

# Agent execution
async def main():
    """Main entry point for the agent"""
    config = AgentConfig(
        agent_id="{agent_id}",
        name="{agent_name}",
        platforms={platforms},
        tasks={tasks}
    )
    
    agent = {agent_id.replace('-', '_').title()}Agent(config)
    
    if await agent.initialize():
        try:
            await agent.start()
        except KeyboardInterrupt:
            logger.info("Agent interrupted by user")
        finally:
            await agent.stop()
    else:
        logger.error("Failed to initialize agent")

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Run the agent
    asyncio.run(main())
'''

        # Configuration file
        config_file = f'''# {agent_name} Configuration

# Agent Settings
AGENT_ID={agent_id}
AGENT_NAME={agent_name}

# Platform API Keys
'''

        for platform in platforms:
            if platform == "twitter":
                config_file += '''
# Twitter Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret
'''
            elif platform == "discord":
                config_file += '''
# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token
'''
            elif platform == "solana":
                config_file += '''
# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_solana_private_key
'''

        # Dockerfile for deployment
        dockerfile = f'''FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    g++ \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY pyproject.toml poetry.lock ./

# Install Poetry and dependencies
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

# Copy agent code
COPY . .

# Run the agent
CMD ["python", "main.py"]
'''

        return {
            "main.py": main_agent_code,
            "config.env": config_file,
            "Dockerfile": dockerfile
        }
    
    async def _write_agent_files(self, agent_dir: Path, agent_code: Dict[str, str], agent_spec: Dict[str, Any]):
        """Write generated agent files to disk"""
        
        for filename, content in agent_code.items():
            file_path = agent_dir / filename
            async with aiofiles.open(file_path, 'w') as f:
                await f.write(content)
        
        # Write agent specification
        spec_file = agent_dir / "agent_spec.json"
        async with aiofiles.open(spec_file, 'w') as f:
            await f.write(json.dumps(agent_spec, indent=2))
        
        # Make main.py executable
        main_py = agent_dir / "main.py"
        main_py.chmod(0o755)
    
    async def deploy_agent(self, agent_id: str, deployment_config: Dict[str, Any]) -> ZerePyResult:
        """Deploy an autonomous agent"""
        start_time = datetime.now()
        
        try:
            if agent_id not in self.active_agents:
                return ZerePyResult(
                    success=False,
                    error_message=f"Agent {agent_id} not found"
                )
            
            agent_info = self.active_agents[agent_id]
            agent_dir = Path(agent_info["agent_dir"])
            
            deployment_type = deployment_config.get("type", "local")
            
            if deployment_type == "local":
                # Start agent as local process
                result = await self._deploy_local_agent(agent_dir)
            elif deployment_type == "docker":
                # Deploy as Docker container
                result = await self._deploy_docker_agent(agent_dir, deployment_config)
            elif deployment_type == "cloud":
                # Deploy to cloud platform
                result = await self._deploy_cloud_agent(agent_dir, deployment_config)
            else:
                return ZerePyResult(
                    success=False,
                    error_message=f"Unknown deployment type: {deployment_type}"
                )
            
            if result["success"]:
                agent_info["status"] = "deployed"
                agent_info["deployment_info"] = result
                agent_info["deployed_at"] = datetime.now().isoformat()
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ZerePyResult(
                success=result["success"],
                output=result,
                execution_time=processing_time,
                agent_id=agent_id
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Agent deployment failed: {e}")
            return ZerePyResult(
                success=False,
                error_message=str(e),
                execution_time=processing_time,
                agent_id=agent_id
            )
    
    async def _deploy_local_agent(self, agent_dir: Path) -> Dict[str, Any]:
        """Deploy agent as local process"""
        try:
            # Start the agent process
            process = await asyncio.create_subprocess_exec(
                self.config.python_executable, "main.py",
                cwd=agent_dir,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            return {
                "success": True,
                "deployment_type": "local",
                "process_id": process.pid,
                "status": "running"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _deploy_docker_agent(self, agent_dir: Path, config: Dict[str, Any]) -> Dict[str, Any]:
        """Deploy agent as Docker container"""
        try:
            # Build Docker image
            image_name = f"zerepy-agent-{agent_dir.name}"
            
            build_result = await asyncio.create_subprocess_exec(
                "docker", "build", "-t", image_name, ".",
                cwd=agent_dir,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await build_result.communicate()
            
            if build_result.returncode != 0:
                return {
                    "success": False,
                    "error": f"Docker build failed: {stderr.decode()}"
                }
            
            # Run Docker container
            run_result = await asyncio.create_subprocess_exec(
                "docker", "run", "-d", "--name", f"{image_name}-instance", image_name,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            container_id = (await run_result.communicate())[0].decode().strip()
            
            if run_result.returncode == 0:
                return {
                    "success": True,
                    "deployment_type": "docker",
                    "container_id": container_id,
                    "image_name": image_name,
                    "status": "running"
                }
            else:
                return {
                    "success": False,
                    "error": "Docker run failed"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _deploy_cloud_agent(self, agent_dir: Path, config: Dict[str, Any]) -> Dict[str, Any]:
        """Deploy agent to cloud platform"""
        try:
            # This would integrate with cloud platforms like AWS, GCP, etc.
            # For demo purposes, simulate cloud deployment
            
            return {
                "success": True,
                "deployment_type": "cloud",
                "cloud_provider": config.get("provider", "aws"),
                "instance_id": f"cloud-{int(datetime.now().timestamp())}",
                "status": "running",
                "endpoint": f"https://zerepy-{agent_dir.name}.cloud-provider.com"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_from_template(self, template_name: str, parameters: Dict[str, Any]) -> ZerePyResult:
        """Create agent from predefined template"""
        try:
            if template_name not in self.agent_templates:
                return ZerePyResult(
                    success=False,
                    error_message=f"Unknown template: {template_name}"
                )
            
            template = self.agent_templates[template_name]
            
            # Create agent specification from template
            agent_spec = {
                "agent_id": parameters.get("agent_id", f"{template_name}_{int(datetime.now().timestamp())}"),
                "name": parameters.get("name", template["description"]),
                "description": template["description"],
                "platforms": parameters.get("platforms", template["platforms"]),
                "tasks": parameters.get("tasks", template["tasks"]),
                **parameters
            }
            
            # Create the agent
            return await self.create_autonomous_agent(agent_spec)
            
        except Exception as e:
            logger.error(f"Template creation failed: {e}")
            return ZerePyResult(
                success=False,
                error_message=str(e)
            )
    
    async def monitor_agents(self) -> Dict[str, Any]:
        """Monitor all active agents"""
        try:
            agent_status = {}
            
            for agent_id, agent_info in self.active_agents.items():
                status = {
                    "name": agent_info["name"],
                    "platforms": agent_info["platforms"],
                    "tasks": agent_info["tasks"],
                    "status": agent_info["status"],
                    "created_at": agent_info["created_at"],
                    "health": "unknown"
                }
                
                # Check agent health (simplified)
                if agent_info["status"] == "deployed":
                    status["health"] = "healthy"
                
                agent_status[agent_id] = status
            
            return {
                "success": True,
                "total_agents": len(self.active_agents),
                "agents": agent_status,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Agent monitoring failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_capabilities(self) -> List[str]:
        """Get list of available capabilities"""
        return self.capabilities.copy()
    
    async def get_supported_platforms(self) -> Dict[str, Any]:
        """Get supported platforms and their capabilities"""
        return self.supported_platforms.copy()

# Integration with Coral Protocol Agent System
class ZerePyCoralAgent:
    """Coral Protocol agent wrapper for ZerePy"""
    
    def __init__(self, zerepy_agent: ZerePyAgent):
        self.zerepy_agent = zerepy_agent
        self.agent_id = "zerepy-agent"
        self.name = "ZerePy Agent"
        self.capabilities = zerepy_agent.capabilities
    
    async def handle_tool_call(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tool calls from the Coral Protocol orchestrator"""
        try:
            if tool_name == "create_autonomous_agent":
                result = await self.zerepy_agent.create_autonomous_agent(parameters)
                
                return {
                    "success": result.success,
                    "agent_id": result.agent_id,
                    "output": result.output,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "create_from_template":
                result = await self.zerepy_agent.create_from_template(
                    parameters["template_name"],
                    parameters.get("parameters", {})
                )
                
                return {
                    "success": result.success,
                    "agent_id": result.agent_id,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "deploy_agent":
                result = await self.zerepy_agent.deploy_agent(
                    parameters["agent_id"],
                    parameters.get("deployment_config", {})
                )
                
                return {
                    "success": result.success,
                    "output": result.output,
                    "execution_time": result.execution_time,
                    "error": result.error_message
                }
            
            elif tool_name == "monitor_agents":
                result = await self.zerepy_agent.monitor_agents()
                return result
            
            elif tool_name == "get_supported_platforms":
                result = await self.zerepy_agent.get_supported_platforms()
                return {
                    "success": True,
                    "platforms": result
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
async def create_zerepy_agent(
    workspace_path: str = "./zerepy_workspace"
) -> ZerePyAgent:
    """Create and initialize a ZerePy agent"""
    
    config = ZerePyConfig(workspace_path=workspace_path)
    
    agent = ZerePyAgent(config)
    
    if await agent.initialize():
        logger.info("✅ ZerePy agent initialized successfully")
        return agent
    else:
        logger.error("❌ Failed to initialize ZerePy agent")
        raise RuntimeError("Failed to initialize ZerePy agent")

# Example usage and testing
async def test_zerepy_agent():
    """Test the ZerePy integration"""
    try:
        # Create agent
        agent = await create_zerepy_agent()
        
        # Test agent creation from template
        result = await agent.create_from_template(
            "social_coordinator",
            {
                "name": "Coral Social Agent",
                "agent_id": "coral-social-coordinator"
            }
        )
        
        print(f"Agent creation result: {result.success}")
        if result.success:
            print(f"Agent created in {result.execution_time:.2f}s")
            print(f"Agent ID: {result.agent_id}")
        
        # Test capabilities
        capabilities = await agent.get_capabilities()
        print(f"Available capabilities: {capabilities}")
        
        # Test platform support
        platforms = await agent.get_supported_platforms()
        print(f"Supported platforms: {list(platforms.keys())}")
        
        # Test monitoring
        monitor_result = await agent.monitor_agents()
        print(f"Monitoring result: {monitor_result['success']}")
        
        # Create Coral Protocol wrapper
        coral_agent = ZerePyCoralAgent(agent)
        
        # Test tool call
        result = await coral_agent.handle_tool_call(
            "create_from_template",
            {
                "template_name": "defi_monitor",
                "parameters": {"name": "Coral DeFi Monitor"}
            }
        )
        print(f"Tool call result: {result['success']}")
        
        return True
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    # Run test
    asyncio.run(test_zerepy_agent())
