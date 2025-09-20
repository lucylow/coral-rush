#!/usr/bin/env python3
"""
Test script for Coral Protocol agents
Tests the functionality of all agents for the hackathon demo.
"""

import asyncio
import aiohttp
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CoralAgentTester:
    """Test Coral Protocol agents functionality"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def test_server_health(self):
        """Test Coral Server health"""
        logger.info("Testing Coral Server health...")
        
        try:
            async with self.session.get(f"{self.base_url}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"✅ Server health check passed: {data}")
                    return True
                else:
                    logger.error(f"❌ Server health check failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Server health check error: {e}")
            return False
    
    async def test_agent_registration(self):
        """Test agent registration"""
        logger.info("Testing agent registration...")
        
        test_agent = {
            "agent_id": "test-agent-001",
            "name": "Test Agent",
            "version": "1.0.0",
            "capabilities": ["testing", "demo"],
            "description": "Test agent for hackathon demo",
            "endpoint": "/api/test-agent"
        }
        
        try:
            async with self.session.post(f"{self.base_url}/api/agents/register", json=test_agent) as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"✅ Agent registration successful: {data}")
                    return True
                else:
                    logger.error(f"❌ Agent registration failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Agent registration error: {e}")
            return False
    
    async def test_agent_listing(self):
        """Test agent listing"""
        logger.info("Testing agent listing...")
        
        try:
            async with self.session.get(f"{self.base_url}/api/agents") as response:
                if response.status == 200:
                    data = await response.json()
                    agents = data.get("agents", [])
                    logger.info(f"✅ Found {len(agents)} registered agents")
                    
                    for agent in agents:
                        logger.info(f"  - {agent['name']} ({agent['agent_id']})")
                    
                    return True
                else:
                    logger.error(f"❌ Agent listing failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Agent listing error: {e}")
            return False
    
    async def test_workflow_listing(self):
        """Test workflow listing"""
        logger.info("Testing workflow listing...")
        
        try:
            async with self.session.get(f"{self.base_url}/api/workflows") as response:
                if response.status == 200:
                    data = await response.json()
                    workflows = data.get("workflows", {})
                    logger.info(f"✅ Found {len(workflows)} available workflows")
                    
                    for workflow_name, workflow_info in workflows.items():
                        logger.info(f"  - {workflow_name}: {workflow_info.get('description', 'No description')}")
                    
                    return True
                else:
                    logger.error(f"❌ Workflow listing failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Workflow listing error: {e}")
            return False
    
    async def test_voice_payment_workflow(self):
        """Test voice payment workflow execution"""
        logger.info("Testing voice payment workflow...")
        
        workflow_data = {
            "voice_input": "Send $10,000 to Philippines for family support",
            "user_id": "test_user_123",
            "session_id": "test_session_001"
        }
        
        try:
            # Start workflow
            async with self.session.post(
                f"{self.base_url}/api/workflows/voice_payment_workflow/execute",
                json=workflow_data
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    execution_id = data.get("execution_id")
                    logger.info(f"✅ Workflow started: {execution_id}")
                    
                    # Monitor workflow execution
                    result = await self.monitor_workflow_execution(execution_id)
                    return result
                else:
                    logger.error(f"❌ Workflow execution failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Workflow execution error: {e}")
            return False
    
    async def monitor_workflow_execution(self, execution_id: str):
        """Monitor workflow execution"""
        logger.info(f"Monitoring workflow execution: {execution_id}")
        
        max_attempts = 30  # 30 seconds timeout
        attempt = 0
        
        while attempt < max_attempts:
            try:
                async with self.session.get(f"{self.base_url}/api/workflows/executions/{execution_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        status = data.get("status")
                        current_step = data.get("current_step", 0)
                        total_steps = len(data.get("steps", []))
                        
                        logger.info(f"  Status: {status}, Step: {current_step}/{total_steps}")
                        
                        if status == "completed":
                            results = data.get("results", {})
                            logger.info(f"✅ Workflow completed successfully!")
                            logger.info(f"  Results: {list(results.keys())}")
                            
                            # Check for payment result
                            payment_result = results.get("payment_processing", {})
                            if payment_result and payment_result.get("success"):
                                payment_data = payment_result.get("payment_result", {})
                                logger.info(f"  💰 Payment completed:")
                                logger.info(f"    Transaction ID: {payment_data.get('transaction_id')}")
                                logger.info(f"    Amount sent: ${payment_data.get('amount_sent')}")
                                logger.info(f"    Amount received: {payment_data.get('amount_received')} PHP")
                                logger.info(f"    Processing time: {payment_data.get('processing_time_ms')}ms")
                                logger.info(f"    ORGO burned: {payment_data.get('orgo_burned')}")
                            
                            return True
                        
                        elif status == "failed":
                            error = data.get("error_message", "Unknown error")
                            logger.error(f"❌ Workflow failed: {error}")
                            return False
                        
                        attempt += 1
                        await asyncio.sleep(1)
                    else:
                        logger.error(f"❌ Failed to get workflow status: {response.status}")
                        return False
            except Exception as e:
                logger.error(f"❌ Workflow monitoring error: {e}")
                return False
        
        logger.warning("⏰ Workflow monitoring timeout")
        return False
    
    async def test_support_workflow(self):
        """Test support workflow execution"""
        logger.info("Testing support workflow...")
        
        workflow_data = {
            "user_query": "My transaction failed and I lost 0.5 ETH",
            "user_id": "test_user_456",
            "session_id": "test_session_002"
        }
        
        try:
            # Start workflow
            async with self.session.post(
                f"{self.base_url}/api/workflows/support_workflow/execute",
                json=workflow_data
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    execution_id = data.get("execution_id")
                    logger.info(f"✅ Support workflow started: {execution_id}")
                    
                    # Monitor workflow execution
                    result = await self.monitor_workflow_execution(execution_id)
                    return result
                else:
                    logger.error(f"❌ Support workflow execution failed: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"❌ Support workflow execution error: {e}")
            return False
    
    async def run_all_tests(self):
        """Run all tests"""
        logger.info("🚀 Starting Coral Protocol agents tests...")
        logger.info("=" * 60)
        
        tests = [
            ("Server Health", self.test_server_health),
            ("Agent Registration", self.test_agent_registration),
            ("Agent Listing", self.test_agent_listing),
            ("Workflow Listing", self.test_workflow_listing),
            ("Voice Payment Workflow", self.test_voice_payment_workflow),
            ("Support Workflow", self.test_support_workflow)
        ]
        
        results = []
        
        for test_name, test_func in tests:
            logger.info(f"\n🧪 Running test: {test_name}")
            logger.info("-" * 40)
            
            try:
                result = await test_func()
                results.append((test_name, result))
                
                if result:
                    logger.info(f"✅ {test_name} PASSED")
                else:
                    logger.error(f"❌ {test_name} FAILED")
                    
            except Exception as e:
                logger.error(f"❌ {test_name} ERROR: {e}")
                results.append((test_name, False))
        
        # Summary
        logger.info("\n" + "=" * 60)
        logger.info("📊 TEST SUMMARY")
        logger.info("=" * 60)
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASSED" if result else "❌ FAILED"
            logger.info(f"{test_name}: {status}")
        
        logger.info(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            logger.info("🎉 All tests passed! Coral Protocol agents are working correctly.")
        else:
            logger.warning(f"⚠️  {total - passed} tests failed. Please check the logs above.")
        
        return passed == total

async def main():
    """Main test function"""
    async with CoralAgentTester() as tester:
        success = await tester.run_all_tests()
        return success

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)

