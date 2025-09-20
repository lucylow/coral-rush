#!/usr/bin/env python3
"""
Coral Protocol Agents Startup Script
Starts all Coral Protocol agents for the hackathon demo.
"""

import asyncio
import logging
import os
import sys
import subprocess
import time
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CoralAgentsManager:
    """Manages all Coral Protocol agents"""
    
    def __init__(self):
        self.processes = {}
        self.agent_scripts = {
            "coral_server": "coral_server.py",
            "payment_agent": "payment_agent.py",
            "fraud_detection_agent": "fraud_detection_agent.py",
            "agent_orchestrator": "agent_orchestrator.py",
            "main_agent": "main.py"
        }
        self.base_dir = Path(__file__).parent
    
    async def check_dependencies(self):
        """Check if all required dependencies are installed"""
        logger.info("Checking dependencies...")
        
        required_packages = [
            "fastapi", "uvicorn", "aiohttp", "numpy", "scikit-learn",
            "pandas", "mcp", "livekit-agents"
        ]
        
        missing_packages = []
        
        for package in required_packages:
            try:
                __import__(package.replace("-", "_"))
            except ImportError:
                missing_packages.append(package)
        
        if missing_packages:
            logger.error(f"Missing packages: {missing_packages}")
            logger.info("Installing missing packages...")
            
            try:
                subprocess.run([
                    sys.executable, "-m", "pip", "install", 
                    *missing_packages
                ], check=True)
                logger.info("Dependencies installed successfully")
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to install dependencies: {e}")
                return False
        
        logger.info("All dependencies are available")
        return True
    
    async def start_agent(self, agent_name: str, script_path: str):
        """Start a single agent"""
        try:
            logger.info(f"Starting {agent_name}...")
            
            # Change to the coral-agent directory
            os.chdir(self.base_dir)
            
            # Start the agent process
            process = subprocess.Popen([
                sys.executable, script_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes[agent_name] = process
            logger.info(f"{agent_name} started with PID {process.pid}")
            
            # Give the process a moment to start
            await asyncio.sleep(2)
            
            # Check if process is still running
            if process.poll() is None:
                logger.info(f"{agent_name} is running successfully")
                return True
            else:
                stdout, stderr = process.communicate()
                logger.error(f"{agent_name} failed to start:")
                logger.error(f"STDOUT: {stdout.decode()}")
                logger.error(f"STDERR: {stderr.decode()}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to start {agent_name}: {e}")
            return False
    
    async def start_all_agents(self):
        """Start all Coral Protocol agents"""
        logger.info("Starting Coral Protocol agents...")
        
        # Check dependencies first
        if not await self.check_dependencies():
            logger.error("Dependency check failed")
            return False
        
        # Start agents in order
        startup_order = [
            "coral_server",
            "payment_agent", 
            "fraud_detection_agent",
            "agent_orchestrator",
            "main_agent"
        ]
        
        for agent_name in startup_order:
            script_path = self.agent_scripts[agent_name]
            
            if not os.path.exists(script_path):
                logger.warning(f"Script {script_path} not found, skipping {agent_name}")
                continue
            
            success = await self.start_agent(agent_name, script_path)
            if not success:
                logger.error(f"Failed to start {agent_name}")
                # Continue with other agents
        
        # Wait a moment for all agents to initialize
        await asyncio.sleep(5)
        
        # Check which agents are running
        running_agents = []
        for agent_name, process in self.processes.items():
            if process.poll() is None:
                running_agents.append(agent_name)
        
        logger.info(f"Successfully started agents: {running_agents}")
        
        if running_agents:
            logger.info("Coral Protocol agents are ready!")
            logger.info("Available endpoints:")
            logger.info("  - Coral Server: http://localhost:8080")
            logger.info("  - Agent Registry: http://localhost:8080/api/agents")
            logger.info("  - Workflows: http://localhost:8080/api/workflows")
            logger.info("  - WebSocket: ws://localhost:8080/ws")
            return True
        else:
            logger.error("No agents started successfully")
            return False
    
    async def monitor_agents(self):
        """Monitor agent health"""
        logger.info("Monitoring agent health...")
        
        while True:
            try:
                for agent_name, process in list(self.processes.items()):
                    if process.poll() is not None:
                        logger.warning(f"{agent_name} has stopped")
                        del self.processes[agent_name]
                
                if not self.processes:
                    logger.warning("All agents have stopped")
                    break
                
                await asyncio.sleep(10)  # Check every 10 seconds
                
            except KeyboardInterrupt:
                logger.info("Monitoring interrupted by user")
                break
            except Exception as e:
                logger.error(f"Monitoring error: {e}")
                await asyncio.sleep(10)
    
    async def stop_all_agents(self):
        """Stop all running agents"""
        logger.info("Stopping all agents...")
        
        for agent_name, process in self.processes.items():
            try:
                logger.info(f"Stopping {agent_name}...")
                process.terminate()
                
                # Wait for graceful shutdown
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    logger.warning(f"{agent_name} didn't stop gracefully, forcing...")
                    process.kill()
                
                logger.info(f"{agent_name} stopped")
                
            except Exception as e:
                logger.error(f"Error stopping {agent_name}: {e}")
        
        self.processes.clear()
        logger.info("All agents stopped")
    
    async def run_demo(self):
        """Run a demo workflow"""
        logger.info("Running demo workflow...")
        
        try:
            import aiohttp
            
            # Wait for server to be ready
            await asyncio.sleep(10)
            
            # Test server health
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.get("http://localhost:8080/health") as response:
                        if response.status == 200:
                            data = await response.json()
                            logger.info(f"Server health check passed: {data}")
                        else:
                            logger.error(f"Server health check failed: {response.status}")
                            return
                except Exception as e:
                    logger.error(f"Server health check error: {e}")
                    return
                
                # List agents
                try:
                    async with session.get("http://localhost:8080/api/agents") as response:
                        if response.status == 200:
                            data = await response.json()
                            logger.info(f"Registered agents: {len(data.get('agents', []))}")
                        else:
                            logger.error(f"Failed to list agents: {response.status}")
                except Exception as e:
                    logger.error(f"Agent listing error: {e}")
                
                # Execute demo workflow
                try:
                    workflow_data = {
                        "voice_input": "Send $10,000 to Philippines for family support",
                        "user_id": "demo_user_123"
                    }
                    
                    async with session.post(
                        "http://localhost:8080/api/workflows/voice_payment_workflow/execute",
                        json=workflow_data
                    ) as response:
                        if response.status == 200:
                            data = await response.json()
                            execution_id = data.get("execution_id")
                            logger.info(f"Demo workflow started: {execution_id}")
                            
                            # Monitor workflow execution
                            await self.monitor_workflow_execution(session, execution_id)
                        else:
                            logger.error(f"Failed to execute workflow: {response.status}")
                except Exception as e:
                    logger.error(f"Workflow execution error: {e}")
        
        except ImportError:
            logger.warning("aiohttp not available for demo")
        except Exception as e:
            logger.error(f"Demo error: {e}")
    
    async def monitor_workflow_execution(self, session, execution_id: str):
        """Monitor workflow execution"""
        logger.info(f"Monitoring workflow execution: {execution_id}")
        
        max_attempts = 30  # 30 seconds timeout
        attempt = 0
        
        while attempt < max_attempts:
            try:
                async with session.get(f"http://localhost:8080/api/workflows/executions/{execution_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        status = data.get("status")
                        current_step = data.get("current_step", 0)
                        total_steps = len(data.get("steps", []))
                        
                        logger.info(f"Workflow status: {status}, Step: {current_step}/{total_steps}")
                        
                        if status in ["completed", "failed"]:
                            logger.info(f"Workflow {status}: {execution_id}")
                            if status == "completed":
                                results = data.get("results", {})
                                logger.info(f"Workflow results: {list(results.keys())}")
                            else:
                                error = data.get("error_message", "Unknown error")
                                logger.error(f"Workflow failed: {error}")
                            break
                        
                        attempt += 1
                        await asyncio.sleep(1)
                    else:
                        logger.error(f"Failed to get workflow status: {response.status}")
                        break
            except Exception as e:
                logger.error(f"Workflow monitoring error: {e}")
                break
        
        if attempt >= max_attempts:
            logger.warning("Workflow monitoring timeout")

async def main():
    """Main entry point"""
    manager = CoralAgentsManager()
    
    try:
        # Start all agents
        if await manager.start_all_agents():
            logger.info("All agents started successfully!")
            
            # Run demo
            await manager.run_demo()
            
            # Monitor agents
            await manager.monitor_agents()
        else:
            logger.error("Failed to start agents")
    
    except KeyboardInterrupt:
        logger.info("Shutdown requested by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        await manager.stop_all_agents()

if __name__ == "__main__":
    asyncio.run(main())

